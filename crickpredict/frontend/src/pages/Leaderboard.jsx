import React, {useEffect, useState} from 'react'
import axios from 'axios'
const API = import.meta.env.VITE_API || 'http://localhost:4000';

export default function Leaderboard(){
  const [rows, setRows] = useState([]);
  useEffect(()=>{ load(); },[]);
  async function load(){
    try {
      const res = await axios.get(API + '/api/leaderboard');
      setRows(res.data);
    } catch(e){ console.error(e); }
  }
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Leaderboard</h2>
      <ol className="list-decimal ml-6">
        {rows.map(r=>(
          <li key={r.userId} className="mb-2">
            <strong>{r.name}</strong> — {r.points} pts ({r.predictions} preds)
          </li>
        ))}
      </ol>
    </div>
  )
}
