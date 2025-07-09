import './../index.css';
import { Link, Outlet } from 'react-router-dom';
// import { Button } from "@/components/ui/button"
import { Button } from '../components/ui/Button';

function Layout() {
  return (
    <div className="flex min-h-screen bg-[#070d1b] text-white">
      <aside className="w-64 bg-[#0b1120] p-6 space-y-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <nav className="space-y-2">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
          </Link>
          {/* <Link to="/campaigns">
            <Button variant="ghost" className="w-full justify-start">Campaigns</Button>
          </Link> */}
          <Link to="/users">
            <Button variant="ghost" className="w-full justify-start">User Detail</Button>
          </Link>
          <Link to="/billing">
            <Button variant="ghost" className="w-full justify-start">Billing</Button>
          </Link>
          <Link to="/restrictions">
            <Button variant="ghost" className="w-full justify-start">Restrictions</Button>
          </Link>
        </nav>
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;