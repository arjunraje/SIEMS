import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout"
import { getAdmindashboard } from "../../services/adminService";
import { Check,FileText, TrendingDown, TrendingUp, Users, Wallet, X } from "lucide-react";
import { Bar, BarChart, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


interface DashboardData{
  totalClients:number;
  totalInvoices:number;
  paidInvoices:number;
  unpaidInvoices:number;
  totalRevenue:number;
  totalExpense:number;
  profit:number;
  monthlyRevenueVsExpense:{
    month:string;
    revenue:number;
    expense:number;
  }[];
  monthlyTaxSummary:{
    month:string;
    total_tax:number;
  }[];
};

const AdminDashboard = () => {
  const [data,setData]=useState<DashboardData | null>(null);

  const fetchData=async()=>{
    try{
      const res= await getAdmindashboard();
      setData(res);
    }catch(err){
      console.log('Error to fetch data')
    }
  };
  useEffect(()=>{
    fetchData();
  },[]);
  if(!data) return <DashboardLayout><h1>Somthing went worng</h1></DashboardLayout>
  return (
    <DashboardLayout>
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          <StatCard label="Total Revenue" value= {`${data.totalRevenue}`} color="bg-green-300" Icon={TrendingUp}/>
          <StatCard label="Total Expense" value= {`${data.totalExpense}`} color="bg-red-400" Icon={TrendingDown}/>
          <StatCard label="Total Profit" value= {`${data.profit}`} color="bg-indigo-300" Icon={Wallet}/>
          <StatCard label="Total Clients" value={data.totalClients} color="bg-blue-400" Icon={Users}/>
          <StatCard label="Total Invoices" value={data.totalInvoices} color="bg-gray-500" Icon={FileText}/>
          <StatCard label="Paid Invoices" value={data.paidInvoices} color="bg-orange-400" Icon={Check}/>
          <StatCard label="Unpaid Invoices" value={data.unpaidInvoices} color="bg-red-300" Icon={X}/>
      </div>
      <div className="bg-white shadow-md rounded-xl p-6 mb-10 hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 ease-in-out
            cursor-pointer"> 
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue vs Expense</h2>
          <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthlyRevenueVsExpense}>
                  <XAxis dataKey="month"/>
                  <YAxis/>
                  <Tooltip/>
                  <Legend/>
                  <Bar dataKey="revenue" fill="#14b8a6" name="Revenue" />
                  <Bar dataKey="expense" fill="#f59e0b" name="Expense" />
              </BarChart>
          </ResponsiveContainer>
      </div>
      <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 ease-in-out
            cursor-pointer">
          <h2 className="text-lg font-semibold mb-4">Monthly Tax Summary</h2>
          <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.monthlyTaxSummary}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total_tax" stroke="#10B981" name="Total Tax" />
          </LineChart>
          </ResponsiveContainer>
      </div>
    </div>
    </DashboardLayout>
  )
}
const StatCard = ({ label, value,color,Icon }: { label: string; value: string | number ;color:string;Icon:React.FC<React.SVGProps<SVGSVGElement>>}) => (
  <div className={`p-6 rounded-xl text-white shadow-md ${color} hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 ease-in-out
      cursor-pointer`}>
    <div className="flex items-center gap-4">
      <div className="bg-white/20 p-2 rounded-full">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm opacity-80">{label}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
    </div>
  </div>
);
export default AdminDashboard