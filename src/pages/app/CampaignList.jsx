import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../../components/ui/Select";
import { api } from "../../services/api";

export function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [campaignStats, setCampaignStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState("all"); // all, active, finished

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const [campaignsResponse, statsResponse] = await Promise.all([
          api.get("/campaigns"),
          api.get("/campaigns/stats/overview")
        ]);
        setCampaigns(campaignsResponse.data);
        setCampaignStats(statsResponse.data);
      } catch (err) {
        setError("Failed to fetch campaigns");
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-full";
    const statusColors = {
      'active': 'bg-green-100 text-green-800',
      'paused': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-blue-100 text-blue-800',
      'draft': 'bg-gray-100 text-gray-800'
    };
    const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
    return <span className={`${baseClasses} ${colorClass}`}>{status}</span>;
  };

  const getEngagementBadge = (rate) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    if (rate >= 10) return <span className={`${baseClasses} bg-green-100 text-green-800`}>{rate}%</span>;
    if (rate >= 5) return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{rate}%</span>;
    return <span className={`${baseClasses} bg-red-100 text-red-800`}>{rate}%</span>;
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (statusFilter && campaign.status !== statusFilter) return false;
    if (viewMode === "active" && !["active", "paused"].includes(campaign.status)) return false;
    if (viewMode === "finished" && campaign.status !== "completed") return false;
    return true;
  });

  const activeCampaigns = campaigns.filter(c => ["active", "paused"].includes(c.status));
  const finishedCampaigns = campaigns.filter(c => c.status === "completed");

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="text-center text-gray-400">Loading campaigns...</div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="text-center text-red-400">Error: {error}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Campaign Management</h1>
        <p className="text-gray-400">Monitor and manage all your email campaigns</p>
      </div>

      {/* Statistics Overview */}
      {campaignStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-gray-400 text-sm">Total Campaigns</div>
            <div className="text-2xl font-bold text-white">{campaignStats.totalCampaigns}</div>
          </Card>
          <Card className="p-4">
            <div className="text-gray-400 text-sm">Active Campaigns</div>
            <div className="text-2xl font-bold text-green-400">{campaignStats.activeCampaigns}</div>
          </Card>
          <Card className="p-4">
            <div className="text-gray-400 text-sm">Messages Sent</div>
            <div className="text-2xl font-bold text-white">{campaignStats.totalMessagesSent}</div>
          </Card>
          <Card className="p-4">
            <div className="text-gray-400 text-sm">Engagement Rate</div>
            <div className="text-2xl font-bold text-blue-400">{campaignStats.overallEngagementRate}%</div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex space-x-2">
            {[
              { key: "all", label: "All Campaigns", count: campaigns.length },
              { key: "active", label: "Active", count: activeCampaigns.length },
              { key: "finished", label: "Finished", count: finishedCampaigns.length }
            ].map((mode) => (
              <Button
                key={mode.key}
                variant={viewMode === mode.key ? "default" : "outline"}
                onClick={() => setViewMode(mode.key)}
                className="flex items-center gap-2"
              >
                {mode.label}
                <span className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs">
                  {mode.count}
                </span>
              </Button>
            ))}
          </div>

          <Select onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="w-48">
              <span>{statusFilter || "All Statuses"}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Campaigns Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600 text-sm text-left text-white">
            <thead className="bg-[#1f2937]">
              <tr>
                <th className="px-4 py-3 font-medium uppercase tracking-wide">Campaign</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wide">Created By</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wide">Messages</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wide">Engagement</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wide">Duration</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wide">Created</th>
                <th className="px-4 py-3 font-medium uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-[#0f172a]">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign._id} className="hover:bg-[#1e293b] transition">
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-semibold text-white">{campaign.name}</div>
                      <div className="text-gray-400 text-xs">{campaign.sender}</div>
                      {campaign.language && (
                        <div className="text-gray-500 text-xs">Language: {campaign.language}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-white">
                      {campaign.userId?.username || 'Unknown'}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {campaign.userId?.email || 'No email'}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(campaign.status)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Sent:</span>
                        <span className="text-white font-semibold">{campaign.messagesSent || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">To Send:</span>
                        <span className="text-white font-semibold">{campaign.messagesToSend || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-xs">Replies:</span>
                        <span className="text-white font-semibold">{campaign.replies || 0}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {getEngagementBadge(campaign.engagementRate || 0)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-white">
                      {campaign.duration || 0} days
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-white">
                      {new Date(campaign.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {new Date(campaign.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" className="text-xs px-3 py-1">
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs px-3 py-1">
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No campaigns found matching your criteria
          </div>
        )}
      </Card>
    </div>
  );
}
