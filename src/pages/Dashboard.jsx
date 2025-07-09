// import { Card } from "@/components/ui/card";
import { Card } from "../components/ui/Card";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export function Dashboard() {
  const [stats, setStats] = useState({
    emailsSent: 0,
    activeCampaigns: 0,
    engagedLeads: 0,
    systemHealth: "Loading..."
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breakdown, setBreakdown] = useState({ byCampaign: [], byUser: [] });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch main stats
        const statsResponse = await api.get("/stats");
        setStats({
          emailsSent: statsResponse.data.emailsSent || 0,
          activeCampaigns: statsResponse.data.activeCampaigns || 0,
          engagedLeads: statsResponse.data.engagedLeads || 0,
          systemHealth: statsResponse.data.systemHealth || "Healthy"
        });

        // Fetch weekly engagement data
        const weeklyResponse = await api.get("/stats/weekly-engagement");
        setChartData(weeklyResponse.data || []);

        // Fetch breakdown for tables
        const breakdownResponse = await api.get("/stats/weekly-engagement-breakdown");
        setBreakdown(breakdownResponse.data || { byCampaign: [], byUser: [] });

      } catch (err) {
        setError("Failed to fetch dashboard data");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">Total Emails Sent: {stats.emailsSent}</Card>
        <Card className="p-4">Active Campaigns: {stats.activeCampaigns}</Card>
        <Card className="p-4">Engaged Leads: {stats.engagedLeads}</Card>
        <Card className="p-4">System Health: {stats.systemHealth}</Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Email Engagement This Week</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip wrapperClassName="text-black" />
              <Bar dataKey="sent" fill="#3b82f6" name="Emails Sent" />
              <Bar dataKey="engaged" fill="#10b981" name="Engaged Leads" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500">No engagement data available</div>
        )}
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sent Emails by Campaign (Last 7 Days)</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Campaign</th>
                <th className="px-4 py-2 text-left">Sent Emails</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.byCampaign.length === 0 ? (
                <tr><td colSpan={2} className="text-center text-gray-500 py-2">No data</td></tr>
              ) : (
                breakdown.byCampaign.map((row, idx) => (
                  <tr key={row.name || idx}>
                    <td className="px-4 py-2">{row.name || 'Unknown'}</td>
                    <td className="px-4 py-2">{row.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sent Emails by User (Last 7 Days)</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">User (Sender Email)</th>
                <th className="px-4 py-2 text-left">Sent Emails</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.byUser.length === 0 ? (
                <tr><td colSpan={2} className="text-center text-gray-500 py-2">No data</td></tr>
              ) : (
                breakdown.byUser.map((row, idx) => (
                  <tr key={row.name || idx}>
                    <td className="px-4 py-2">{row.name || 'Unknown'}</td>
                    <td className="px-4 py-2">{row.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
