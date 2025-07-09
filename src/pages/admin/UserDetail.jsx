import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('month'); // day, week, month

  const planNumberToName = { 1: 'basic', 2: 'premium', 3: 'premiumPlus'};

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users/${id}`);
        setUser(response.data);
      } catch (err) {
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setStatsLoading(true);
        const response = await api.get(`/stats/user/${id}?period=${period}`);
        setUserStats(response.data);
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };
    
    if (id) {
      fetchUserStats();
    }
  }, [id, period]);

  const getStatusBadge = (isVerified) => {
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-full";
    if (isVerified) {
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Active</span>;
    } else {
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Inactive</span>;
    }
  };

  const getRoleBadge = (role) => {
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-full";
    const roleColors = {
      'admin': 'bg-purple-100 text-purple-800',
      'active': 'bg-blue-100 text-blue-800',
      'restricted': 'bg-orange-100 text-orange-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    const colorClass = roleColors[role] || 'bg-gray-100 text-gray-800';
    return <span className={`${baseClasses} ${colorClass}`}>{role || 'Not set'}</span>;
  };

  const getActivityTypeBadge = (type) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    const typeColors = {
      'sent': 'bg-blue-100 text-blue-800',
      'reply': 'bg-green-100 text-green-800',
      'ai-reply': 'bg-purple-100 text-purple-800',
      'manual-reply': 'bg-orange-100 text-orange-800'
    };
    const colorClass = typeColors[type] || 'bg-gray-100 text-gray-800';
    return <span className={`${baseClasses} ${colorClass}`}>{type}</span>;
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="text-center text-gray-400">Loading user details...</div>
        </Card>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="text-center text-red-400">
            Error: {error || "User not found"}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Profile</h1>
            <p className="text-gray-400">View and manage user information</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/users")}
            className="flex items-center gap-2"
          >
            ← Back to Users
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main User Info */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Basic Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400 font-medium">Username</span>
                <span className="text-white font-semibold">{user.username}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400 font-medium">Email Address</span>
                <span className="text-white">{user.email}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400 font-medium">Account Status</span>
                <div>{getStatusBadge(user.isVerified)}</div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400 font-medium">User Role</span>
                <div>{getRoleBadge(user.role)}</div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400 font-medium">Subscription Plan</span>
                <span className="text-white">{planNumberToName[user.plan] || user.plan || 'Free'}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400 font-medium">Registration Date</span>
                <span className="text-white">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not available'}
                </span>
              </div>
            </div>
          </Card>

          {/* User Statistics */}
          <Card className="p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Activity Statistics</h2>
              <div className="flex space-x-2">
                {['day', 'week', 'month'].map((p) => (
                  <Button
                    key={p}
                    variant={period === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPeriod(p)}
                    className="text-xs px-3 py-1"
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {statsLoading ? (
              <div className="text-center text-gray-400 py-8">Loading statistics...</div>
            ) : userStats ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Sent Emails</div>
                    <div className="text-2xl font-bold text-white">{userStats.sentEmailsCount}</div>
                    <div className="text-gray-500 text-xs">This {period}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Created Campaigns</div>
                    <div className="text-2xl font-bold text-white">{userStats.createdCampaignsCount}</div>
                    <div className="text-gray-500 text-xs">This {period}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Total Activities</div>
                    <div className="text-2xl font-bold text-white">{userStats.totalActivities}</div>
                    <div className="text-gray-500 text-xs">This {period}</div>
                  </div>
                </div>

                {/* Activities by Type */}
                {userStats.activitiesByType && userStats.activitiesByType.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Activities by Type</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {userStats.activitiesByType.map((activity) => (
                        <div key={activity._id} className="bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>{getActivityTypeBadge(activity._id)}</div>
                            <div className="text-lg font-bold text-white">{activity.count}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activities by Day */}
                {userStats.activitiesByDay && userStats.activitiesByDay.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Daily Activity</h3>
                    <div className="space-y-2">
                      {userStats.activitiesByDay.map((day) => (
                        <div key={day._id} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                          <div className="text-white font-medium">
                            {new Date(day._id).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-bold">{day.count}</span>
                            <span className="text-gray-400 text-sm">activities</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Campaigns by Status */}
                {userStats.campaignsByStatus && userStats.campaignsByStatus.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Campaigns by Status</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {userStats.campaignsByStatus.map((campaign) => (
                        <div key={campaign._id} className="bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="text-gray-400 text-sm">{campaign._id || 'No Status'}</div>
                            <div className="text-lg font-bold text-white">{campaign.count}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">No activity data available</div>
            )}
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Additional Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Additional Details</h3>
            
            <div className="space-y-3">
              {user.provider && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-400 text-sm">Login Provider</span>
                  <span className="text-white text-sm font-medium">{user.provider}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400 text-sm">Last Updated</span>
                <span className="text-white text-sm">
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Not available'}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate(`/restrictions`)}
              >
                Manage Restrictions
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate(`/billing`)}
              >
                View Billing
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 