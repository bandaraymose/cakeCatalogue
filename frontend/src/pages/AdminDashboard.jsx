import React, { useEffect, useState } from 'react';
import { getOrders, getTopSelling, getSalesSummary } from '../api/client';
import { isAuthed, logout } from '../api/auth';

export default function AdminDashboard({ setCurrentPage }) {
  const [orders, setOrders] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthed()) {
      setCurrentPage('admin-login');
      return;
    }
    refresh();
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const [ordersRes, topRes, sumRes] = await Promise.all([
        getOrders(),
        getTopSelling(30, 5),
        getSalesSummary(30)
      ]);
      setOrders(ordersRes);
      setTopSelling(topRes);
      setSummary(sumRes);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    logout();
    setCurrentPage('admin-login');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="space-x-2">
          <button className="px-4 py-2 border rounded-lg" onClick={refresh}>Refresh</button>
          <button className="px-4 py-2 border rounded-lg" onClick={()=>setCurrentPage('admin-cakes')}>Manage Cakes</button>
          <button className="px-4 py-2 border rounded-lg" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {error && <div className="text-red-600">{error}</div>}
      {loading && <div className="text-gray-500">Loading...</div>}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-gray-500 text-sm">Total Orders (30d)</div>
            <div className="text-2xl font-bold">{summary.totalOrders}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-gray-500 text-sm">Total Items (30d)</div>
            <div className="text-2xl font-bold">{summary.totalItems}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-gray-500 text-sm">Revenue (30d)</div>
            <div className="text-2xl font-bold">K{Number(summary.totalRevenue).toFixed(2)}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-3">Top Selling (30 days)</h3>
          <div className="space-y-2">
            {topSelling.map((t) => (
              <div key={t.cakeId} className="flex justify-between items-center border-b py-2">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-gray-500">Sold: {t.quantity}</div>
                </div>
                <div className="font-semibold">K{Number(t.revenue).toFixed(2)}</div>
              </div>
            ))}
            {topSelling.length === 0 && <div className="text-gray-500">No sales yet</div>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-3">Recent Orders</h3>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="border rounded-lg p-3">
                <div className="flex justify-between">
                  <div className="font-medium">{o.customerName}</div>
                  <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-sm text-gray-500">{o.phone}</div>
                <div className="text-sm">Items: {o.items.length} • Total: K{Number(o.totalAmount).toFixed(2)}</div>
              </div>
            ))}
            {orders.length === 0 && <div className="text-gray-500">No orders yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
