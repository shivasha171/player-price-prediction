import React, {useEffect, useState} from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API || 'http://localhost:4000';

export default function Home(){
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(()=>{ fetchMatches(); },[]);

  async function fetchMatches(){
    try {
      const res = await axios.get(API + '/api/matches');
      setMatches(res.data);
    } catch(e){ console.error(e); setMessage('Failed to load matches'); }
  }

  async function createUser(e){
    e.preventDefault();
    try {
      const res = await axios.post(API + '/api/user', { name });
      setUser(res.data);
      setMessage('User created: ' + res.data.name);
    } catch(e){ setMessage('Failed to create user'); }
  }

  async function predict(matchId, predictedWinner){
    if(!user) return setMessage('Create a user first');
    try {
      await axios.post(API + '/api/predict', { userId: user.id, matchId, predictedWinner });
      setMessage('Prediction submitted');
    } catch(err){
      setMessage(err.response?.data?.error || 'Failed to predict');
    }
  }

  return (
    <div>
      <section className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold">Get started</h2>
        {!user ? (
          <form onSubmit={createUser} className="mt-3">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="border p-2 mr-2" />
            <button className="px-3 py-1 bg-blue-600 text-white rounded">Create</button>
          </form>
        ) : (
          <div>Signed in as <strong>{user.name}</strong></div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Upcoming Matches</h2>
        <ul>
          {matches.map(m=>(
            <li key={m.id} className="mb-3 p-3 border rounded">
              <div><strong>{m.teamA}</strong> vs <strong>{m.teamB}</strong></div>
              <div className="text-sm">Date: {m.date} — Status: {m.status}</div>
              <div className="mt-2 space-x-2">
                <button onClick={()=>predict(m.id, m.teamA)} className="px-2 py-1 border rounded">Pick {m.teamA}</button>
                <button onClick={()=>predict(m.id, m.teamB)} className="px-2 py-1 border rounded">Pick {m.teamB}</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {message && <div className="mt-4 p-2 bg-gray-100">{message}</div>}
    </div>
  )
}
