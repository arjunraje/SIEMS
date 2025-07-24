import { BarChart2, CreditCard, FileText, LayoutDashboard, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import type { LucideIcon } from "lucide-react";


const Sidebar = () => {
  const {user}=useAuth();
  return (
    <div className="w-64 h-screen bg-white shadow p-6 flex flex-col justify-between">
    <div>
      <h2 className="text-2xl font-bold text-blue-700 mb-8 tracking-wide">SIEMS</h2>
      {(user?.role==='Admin' || user?.role==='Accountant')?(
        <ul className="space-y-4">
        <SidebarItem label="Dashboard" Icon={LayoutDashboard} to="/dashboard" />
        <SidebarItem label="Invoices" Icon={FileText} to="/invoices" />
        <SidebarItem label="Expenses" Icon={CreditCard} to="/expenses"/>
        <SidebarItem label="Profit&Loss Report" Icon={BarChart2} to="/profit-loss"/>
        {(user?.role==='Admin' && (
          <SidebarItem label="Create User" Icon={User} to="/register"/>
        ))}
      </ul>
      ):(<div>
          <SidebarItem label="Invoices" Icon={FileText} to="/invoice" />
          <SidebarItem label="Profile" Icon={User} to='/profile'/>
      </div>
      )}
      
      </div>
      <div>
        <SidebarItem label="Logout" Icon={LogOut} to='/logout'/>
      </div>
    </div>
  );
};
type SidebarItemProps = {
  label: string;
  Icon: LucideIcon;
  to: string;
};
const SidebarItem=({label,Icon,to}:SidebarItemProps)=>(
    <Link
    to={to}
    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors"
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
)

export default Sidebar;
