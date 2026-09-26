import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getUsers, deactivateUser } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

function AdminUsers() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError('');
        const result = await getUsers();
        setUsers(result.users || []);
      } catch (err) {
        console.error('ADMIN USERS LOAD ERROR:', err);
        setError(err.message || 'Failed to load users.');
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleDeactivate = async (targetUser) => {
    if (processingId) return;
    if (!window.confirm(`Deactivate ${targetUser.name}'s account? They won't be able to log in.`)) {
      return;
    }
    try {
      setProcessingId(targetUser.id);
      await deactivateUser(targetUser.id);
      setUsers((current) =>
        current.map((u) => (u.id === targetUser.id ? { ...u, isActive: false } : u))
      );
      showToast(`${targetUser.name}'s account has been deactivated.`, 'success');
    } catch (err) {
      console.error('ADMIN DEACTIVATE ERROR:', err);
      showToast(err.message || 'Failed to deactivate user.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AdminLayout title="User Management">
      {loading && (
        <div className="py-16 text-center text-sm text-[#93939A]">
          <i className="ri-loader-4-line animate-spin mr-2"></i>
          Loading users...
        </div>
      )}

      {!loading && error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-[#27272A]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#12141C] text-xs uppercase tracking-wide text-[#93939A]">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {users.map((u) => (
                <tr key={u.id} className="text-[#D4D4D8]">
                  <td className="px-4 py-3 font-medium text-[#F4F4F5]">{u.name}</td>
                  <td className="px-4 py-3 text-[#93939A]">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        u.isActive
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-red-500/15 text-red-400'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#71717A]">
                    {new Date(u.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== 'admin' && u.isActive && (
                      <button
                        type="button"
                        onClick={() => handleDeactivate(u)}
                        disabled={processingId === u.id}
                        className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/25 disabled:opacity-50"
                      >
                        {processingId === u.id ? 'Processing...' : 'Deactivate'}
                      </button>
                    )}
                    {u.role === 'admin' && (
                      <span className="text-xs text-[#52525B]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminUsers;