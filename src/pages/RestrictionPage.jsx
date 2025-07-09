import { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import DataTable from '../components/DataTableStop';
import { Button } from "../components/ui/Button";
import { api } from "../services/api";

export function RestrictionPage() {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users");
        
        // Transform the data to match the table structure
        const transformedData = response.data.map(user => ({
          id: user._id,
          name: user.username,
          email: user.email,
          plan: user.plan || 'Free',
          role: user.role,
          status: user.isVerified ? 'active' : 'inactive',
          registered: new Date(user.createdAt).toLocaleDateString(),
        }));
        
        setUsersData(transformedData);
      } catch (err) {
        setError("Failed to fetch users data");
        console.error("Error fetching users data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  // Update user status in local state
  const updateUserStatus = (userId, newStatus) => {
    setUsersData(prevData => 
      prevData.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus }
          : user
      )
    );
  };

  const handleRestrictAccount = async (user) => {
    if (window.confirm(`Are you sure you want to restrict ${user.name}?`)) {
      try {
        await api.patch(`/users/${user.id}`, { role: 'restricted' });
        updateUserStatus(user.id, 'inactive');
        alert(`User ${user.name} has been restricted.`);
      } catch (err) {
        alert("Failed to restrict user.");
        console.error("Error restricting user:", err);
      }
    }
  };

  const handleSuspendAccount = async (user) => {
    if (window.confirm(`Are you sure you want to suspend ${user.name}?`)) {
      try {
        await api.patch(`/users/${user.id}`, { isVerified: false });
        updateUserStatus(user.id, 'inactive');
        alert(`User ${user.name} has been suspended.`);
      } catch (err) {
        alert("Failed to suspend user.");
        console.error("Error suspending user:", err);
      }
    }
  };

  const handleAction = async (user) => {
    if (window.confirm(`Are you sure you want to activate ${user.name}?`)) {
      try {
        await api.patch(`/users/${user.id}`, { isVerified: true, role: 'active' });
        updateUserStatus(user.id, 'active');
        alert(`User ${user.name} has been activated.`);
      } catch (err) {
        alert("Failed to activate user.");
        console.error("Error activating user:", err);
      }
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    if (status === 'active') {
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Active</span>;
    } else {
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Inactive</span>;
    }
  };

  const planNumberToName = { 1: 'basic', 2: 'premium', 3: 'premiumPlus', '1': 'basic', '2': 'premium', '3': 'premiumPlus' };

  const columns = [
    { key: "name", label: "User" },
    { key: "plan", label: "Plan", render: (row) => planNumberToName[row.plan] || row.plan },
    { key: "role", label: "Role" },
    { 
      key: "status", 
      label: "Status",
      render: (row) => getStatusBadge(row.status)
    },
    {
      key: "action",
      label: "Actions",
      render: (row) => (
        <div className="space-x-2">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => handleRestrictAccount(row)}
            className="text-xs px-3 py-1"
          >
            Restrict
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSuspendAccount(row)}
            className="text-xs px-3 py-1"
          >
            Suspend
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleAction(row)}
            className="text-xs px-3 py-1"
          >
            Activate
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">User Management</h2>
          <div className="text-center">Loading users data...</div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">User Management</h2>
          <div className="text-red-400">Error: {error}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <DataTable columns={columns} data={usersData} />
      </Card>
    </div>
  );
}
