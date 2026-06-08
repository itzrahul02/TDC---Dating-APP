import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({ total: 0, searching: 0, introSent: 0, matched: 0 });
  const [search, setSearch] = useState(''); 
  const [statusFilter, setStatusFilter] = useState('All'); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [search, statusFilter]);
  
  const fetchData = async () => {
    try { 
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'All') params.status = statusFilter;
      
      const [clientsRes, statsRes] = await Promise.all([
        api.get(
          '/api/clients', 
          { params, withCredentials: true }
        ),
        api.get(
          '/api/clients/stats',
          { withCredentials: true }
        ),
      ]);
      setClients(clientsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 ml-64">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Client Dashboard</h1>
          <p className="text-gray-500">Manage your matchmaking clients</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Clients" value={stats.total} color="bg-blue-50 text-blue-700" />
          <StatCard label="Searching" value={stats.searching} color="bg-yellow-50 text-yellow-700" />
          <StatCard label="Intros Sent" value={stats.introSent} color="bg-purple-50 text-purple-700" />
          <StatCard label="Matched" value={stats.matched} color="bg-green-50 text-green-700" />
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
          >
            <option>All</option>
            <option>Searching</option>
            <option>Intro Sent</option>
            <option>Matched</option>
            <option>On Hold</option>
          </select>
        </div>

        {/* Client Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">City</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Marital Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clients.map((client) => (
                  <tr
                    key={client.profileId}
                    onClick={() => navigate(`/client/${client.profileId}`)}
                    className="hover:bg-rose-50 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {client.firstName} {client.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{client.age}</td>
                    <td className="px-6 py-4 text-gray-600">{client.city}</td>
                    <td className="px-6 py-4 text-gray-600">{client.maritalStatus}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={client.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {clients.length === 0 && (
              <div className="text-center py-8 text-gray-400">No clients found</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className={`${color} rounded-xl p-4`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
