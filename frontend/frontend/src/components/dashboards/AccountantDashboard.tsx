import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { getAccountantDashboard } from "../../services/accountantService";
import { Bar, BarChart, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Outlet } from "react-router-dom";
import Loader from "../ui/Loader";


interface Dashboardstats {
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
}
const AccountantDashboard:React.FC= () => {
  const [stats,setStats]=useState<Dashboardstats | null>(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const fetchStats=async()=>{
        try{
            const data=await getAccountantDashboard();
            setStats(data);
        }catch(error){
            console.log('Faild to featch dashboard')
        }finally{
            setLoading(false)
        }
    };
    fetchStats();
  },[])

    if (loading) {
    return <DashboardLayout>
      <Loader/>
    </DashboardLayout>
    
    ;
  }

  if (!stats) {
    return <div className="text-center text-red-500 py-10">Error loading dashboard data.</div>;
  }


  return (
    <DashboardLayout>
        <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
                <StatCard label="Total Revenue" value= {`${stats.totalRevenue}`} color="bg-green-300" Icon={TrendingUp}/>
                <StatCard label="Total Expense" value= {`${stats.totalExpense}`} color="bg-red-400" Icon={TrendingDown}/>
                <StatCard label="Total Profit" value= {`${stats.profit}`} color="bg-indigo-300" Icon={Wallet}/>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 mb-10 hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 ease-in-out
      cursor-pointer"> 
                <h2 className="text-lg font-semibold mb-4">Monthly Revenue vs Expense</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.monthlyRevenueVsExpense}>
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
                <LineChart data={stats.monthlyTaxSummary}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total_tax" stroke="#10B981" name="Total Tax" />
                </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
        <Outlet/>
    </DashboardLayout>
  );
};

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
export default AccountantDashboard;
