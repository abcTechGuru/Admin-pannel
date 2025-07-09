import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const getStatusBadge = (isVerified) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    return isVerified
      ? <span className={`${baseClasses} bg-green-100 text-green-800`}>Active</span>
      : <span className={`${baseClasses} bg-red-100 text-red-800`}>Inactive</span>;
  };

  const getRoleBadge = (role) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    const roleColors = {
      'admin': 'bg-purple-100 text-purple-800',
      'active': 'bg-blue-100 text-blue-800',
      'restricted': 'bg-orange-100 text-orange-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    const colorClass = roleColors[role] || 'bg-gray-100 text-gray-800';
    return <span className={`${baseClasses} ${colorClass}`}>{role || 'Not set'}</span>;
  };

  // Add plan mapping
  const planNumberToName = { 1: 'basic', 2: 'premium', 3: 'premiumPlus', '1': 'basic', '2': 'premium', '3': 'premiumPlus' };

  if (loading) return (
    <div className="p-6">
      <Card className="p-6 text-center text-gray-400">Loading users...</Card>
    </div>
  );
  if (error) return (
    <div className="p-6">
      <Card className="p-6 text-center text-red-400">Error: {error}</Card>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">User Management</h1>
        </div>
        <div className="overflow-x-auto rounded-md border border-gray-700">
          <table className="min-w-full divide-y divide-gray-600 text-sm text-left text-white">
            <thead className="bg-[#1f2937]">
              <tr>
                <th className="px-4 py-3 font-medium uppercase tracking-wide">Username</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wide">Role</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wide">Plan</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-[#0f172a]">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-[#1e293b] transition">
                  <td className="px-4 py-2 font-semibold">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{getRoleBadge(user.role)}</td>
                  <td className="px-4 py-2">{planNumberToName[user.plan] || 'Free'}</td>
                  <td className="px-4 py-2">{getStatusBadge(user.isVerified)}</td>
                  <td className="px-4 py-2">
                    <Link to={`/user/${user._id}`}>
                      <Button variant="outline" size="sm" className="text-xs px-3 py-1">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
export default UserList;
