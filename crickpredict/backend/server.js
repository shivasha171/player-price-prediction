const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Low, JSONFile } = require('lowdb');
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initDB(){
  await db.read();
  db.data = db.data || { matches: [], predictions: [], users: [] };

  // if empty, insert sample data
  if (!db.data.matches.length) {
    db.data.matches.push(
      {id: 'm1', teamA: 'India', teamB: 'Australia', date: '2025-09-01', status: 'upcoming'},
      {id: 'm2', teamA: 'England', teamB: 'Pakistan', date: '2025-09-02', status: 'upcoming'}
    );
    await db.write();
  }
}

initDB();

// simple user creation (no passwords) - for demo only
app.post('/api/user', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({error:'name required'});
  await db.read();
  const user = { id: nanoid(8), name };
  db.data.users.push(user);
  await db.write();
  res.json(user);
});

// list matches
app.get('/api/matches', async (req, res) => {
  await db.read();
  res.json(db.data.matches);
});

// add match (admin)
app.post('/api/matches', async (req, res) => {
  const { teamA, teamB, date } = req.body;
  if (!teamA || !teamB || !date) return res.status(400).json({error:'teamA,teamB,date required'});
  await db.read();
  const match = { id: nanoid(6), teamA, teamB, date, status: 'upcoming' };
  db.data.matches.push(match);
  await db.write();
  res.json(match);
});

// submit prediction
app.post('/api/predict', async (req, res) => {
  const { userId, matchId, predictedWinner } = req.body;
  if (!userId || !matchId || !predictedWinner) return res.status(400).json({error:'userId,matchId,predictedWinner required'});
  await db.read();
  const user = db.data.users.find(u=>u.id===userId);
  const match = db.data.matches.find(m=>m.id===matchId);
  if (!user || !match) return res.status(400).json({error:'invalid user or match'});
  // prevent multiple predictions by same user for same match
  const existing = db.data.predictions.find(p=>p.userId===userId && p.matchId===matchId);
  if (existing) return res.status(400).json({error:'prediction exists'});
  const pred = { id: nanoid(8), userId, matchId, predictedWinner, timestamp: Date.now() };
  db.data.predictions.push(pred);
  await db.write();
  res.json(pred);
});

// leaderboard - simple count of correct predictions (requires admin to set match result)
app.get('/api/leaderboard', async (req, res) => {
  await db.read();
  const users = db.data.users;
  const preds = db.data.predictions;
  const matches = db.data.matches;
  const scores = users.map(u=>{
    const userPreds = preds.filter(p=>p.userId===u.id);
    let points = 0;
    for (const p of userPreds){
      const m = matches.find(mm=>mm.id===p.matchId);
      if (m && m.result && p.predictedWinner === m.result) points += 10; // 10 points per correct
    }
    return { userId: u.id, name: u.name, points, predictions: userPreds.length };
  }).sort((a,b)=>b.points-a.points);
  res.json(scores);
});

// admin set result
app.post('/api/matches/:id/result', async (req, res) => {
  const { id } = req.params;
  const { result } = req.body; // team name
  if (!result) return res.status(400).json({error:'result required'});
  await db.read();
  const match = db.data.matches.find(m=>m.id===id);
  if (!match) return res.status(404).json({error:'match not found'});
  match.result = result;
  match.status = 'finished';
  await db.write();
  res.json(match);
});

// serve a simple health route
app.get('/api/health', (req,res)=>res.json({ok:true}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log('Server running on',PORT));
