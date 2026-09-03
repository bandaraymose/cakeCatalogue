import React, { useState } from 'react';
import { loginAdmin } from '../api/client';
import { setToken } from '../api/auth';

export default function AdminLogin({ setCurrentPage }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginAdmin(username, password);
      setToken(res.token);
      setCurrentPage('admin-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input className="w-full border rounded-lg p-3" value={username} onChange={(e)=>setUsername(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" className="w-full border rounded-lg p-3" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        <button disabled={loading} className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
