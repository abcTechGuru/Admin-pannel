import { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import DataTable from '../components/DataTable';
import { api } from "../services/api";

export function Billing() {
  const [billingData, setBillingData] = useState([]);
  const [plans, setPlans] = useState([]);
  const [planEdits, setPlanEdits] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState({});
  const [newPlan, setNewPlan] = useState({ name: '', emailLimit: '', price: '', stripePriceId: '', description: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addMessage, setAddMessage] = useState('');
  const [removing, setRemoving] = useState({});

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        const billingResponse = await api.get("/billing");
        setBillingData(billingResponse.data);
        // Fetch all plans for editing
        const plansResponse = await api.get("/billing/plans");
        setPlans(plansResponse.data);
      } catch (err) {
        setError("Failed to fetch billing data");
        console.error("Error fetching billing data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBillingData();
  }, []);

  const columns = [
    { key: "name", label: "User" },
    { key: "plan", label: "Plan", render: (row) => row.plan.charAt(0).toUpperCase() + row.plan.slice(1) },
    { key: "role", label: "Role" },
    { key: "emailLimit", label: "Email Limit", render: (row) => typeof row.emailLimit === 'number' ? row.emailLimit.toLocaleString() : row.emailLimit },
    { key: "status", label: "Status" },
    { key: "expiry", label: "Expiry Date" }
  ];

  const handlePlanEdit = (planName, value) => {
    setPlanEdits(prev => ({ ...prev, [planName]: value }));
  };

  const handleSavePlan = async (planName) => {
    setSaving(prev => ({ ...prev, [planName]: true }));
    try {
      const emailLimit = Number(planEdits[planName]);
      await api.patch(`/billing/plan/${planName}`, { emailLimit });
      // Refresh plans
      const plansResponse = await api.get("/billing/plans");
      setPlans(plansResponse.data);
      setPlanEdits(prev => ({ ...prev, [planName]: undefined }));
      // Refresh billing data (top table)
      const billingResponse = await api.get("/billing");
      setBillingData(billingResponse.data);
    } catch (err) {
      alert("Failed to update plan");
    } finally {
      setSaving(prev => ({ ...prev, [planName]: false }));
    }
  };

  const handleNewPlanChange = (e) => {
    const { name, value } = e.target;
    setNewPlan(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddMessage('');
    try {
      const payload = {
        ...newPlan,
        emailLimit: Number(newPlan.emailLimit),
        price: Number(newPlan.price)
      };
      await api.post('/billing/plan', payload);
      setAddMessage('Plan added successfully!');
      setNewPlan({ name: '', emailLimit: '', price: '', stripePriceId: '', description: '' });
      // Refresh plans
      const plansResponse = await api.get("/billing/plans");
      setPlans(plansResponse.data);
    } catch (err) {
      setAddMessage('Sorry, failed to add plan. Please check your input and try again.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemovePlan = async (planName) => {
    if (!window.confirm(`Are you sure you want to remove the plan "${planName}"? This cannot be undone.`)) return;
    setRemoving(prev => ({ ...prev, [planName]: true }));
    setAddMessage('');
    try {
      await api.delete(`/billing/plan/${planName}`);
      setAddMessage('Plan removed successfully.');
      // Refresh plans
      const plansResponse = await api.get("/billing/plans");
      setPlans(plansResponse.data);
    } catch (err) {
      setAddMessage('Sorry, failed to remove plan.');
    } finally {
      setRemoving(prev => ({ ...prev, [planName]: false }));
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">User Billing Overview</h2>
          <div className="text-center">Loading billing data...</div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">User Billing Overview</h2>
          <div className="text-red-400">Error: {error}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">User Billing Overview</h2>
        <DataTable columns={columns} data={billingData} />
      </Card>
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Plan Email Limits</h2>
        <form onSubmit={handleAddPlan} className="mb-6 flex flex-wrap gap-4 items-end bg-gray-50 p-4 rounded">
          <div>
            <label className="block text-sm font-medium mb-1">Plan Name</label>
            <input name="name" value={newPlan.name} onChange={handleNewPlanChange} required className="border rounded px-2 py-1 w-32 text-black" placeholder="e.g. basic" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Limit</label>
            <input name="emailLimit" type="number" min="0" value={newPlan.emailLimit} onChange={handleNewPlanChange} required className="border rounded px-2 py-1 w-32 text-black" placeholder="e.g. 1000" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input name="price" type="number" min="0" value={newPlan.price} onChange={handleNewPlanChange} className="border rounded px-2 py-1 w-32 text-black" placeholder="e.g. 1999" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stripe Price ID</label>
            <input name="stripePriceId" value={newPlan.stripePriceId} onChange={handleNewPlanChange} className="border rounded px-2 py-1 w-32 text-black" placeholder="(optional)" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input name="description" value={newPlan.description} onChange={handleNewPlanChange} className="border rounded px-2 py-1 w-48 text-black" placeholder="(optional)" />
          </div>
          <button type="submit" disabled={addLoading} className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50">
            {addLoading ? 'Adding...' : 'Add Plan'}
          </button>
          {addMessage && <span className="ml-4 text-sm text-gray-700">{addMessage}</span>}
        </form>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Plan</th>
              <th className="px-4 py-2 text-left">Email Limit</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan.name}>
                <td className="px-4 py-2 font-semibold">{plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    min="0"
                    value={planEdits[plan.name] !== undefined ? planEdits[plan.name] : plan.emailLimit}
                    onChange={e => handlePlanEdit(plan.name, e.target.value)}
                    className="border rounded px-2 py-1 w-32 text-black"
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleSavePlan(plan.name)}
                    disabled={saving[plan.name]}
                    className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50 mr-2"
                  >
                    {saving[plan.name] ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => handleRemovePlan(plan.name)}
                    disabled={removing[plan.name]}
                    className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                  >
                    {removing[plan.name] ? 'Removing...' : 'Remove'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
