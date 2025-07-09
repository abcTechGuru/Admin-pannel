import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import { Dashboard } from "./pages/Dashboard";
import { CampaignList } from "./pages/app/CampaignList";
import { UserDetail } from "./pages/admin/UserDetail";
import UserList from "./pages/admin/UserList";
import { Billing } from "./pages/Billing";
import { RestrictionPage } from "./pages/RestrictionPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="campaigns" element={<CampaignList />} />
          <Route path="users" element={<UserList />} />
          <Route path="user/:id" element={<UserDetail />} />
          <Route path="billing" element={<Billing />} />
          <Route path="restrictions" element={<RestrictionPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
