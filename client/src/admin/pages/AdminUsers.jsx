import { useState, useEffect } from 'react';
import { Users, UserX, UserCheck } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try { const res = await api.get('/admin/users'); setUsers(res.data.data.users); } catch {}
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const handleToggle = async (userId, name, isDeleted) => {
    const action = isDeleted ? 'activate' : 'deactivate';
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} user "${name}"?`)) return;
    try {
      await api.put(`/admin/users/${userId}/toggle`);
      toast.success(`User ${action}d successfully`);
      fetchData();
    } catch { toast.error('Error toggling user status'); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Users</h1>
        <p className="text-gray-500 text-sm">{users.filter(u => !u.isDeleted).length} active users</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">User</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Phone</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Role</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Joined</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(6)].map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded" /></td>)}
                  </tr>
                ))
              ) : users.map(u => (
                <tr key={u.userId} className={`hover:bg-gray-50 transition-colors ${u.isDeleted ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">{u.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{u.phone || '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`badge text-xs ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge text-xs ${u.isDeleted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {u.isDeleted ? 'Deactivated' : 'Active'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-4 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleToggle(u.userId, u.name, u.isDeleted)}
                        className={`flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${u.isDeleted ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
                      >
                        {u.isDeleted ? <><UserCheck className="w-3.5 h-3.5" /> Activate</> : <><UserX className="w-3.5 h-3.5" /> Deactivate</>}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No users found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
