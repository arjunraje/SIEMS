import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout"
import { getClientDashboard } from "../../services/clientService";
import { AlertTriangle, Check, FileText, IndianRupee, X } from "lucide-react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DashboardData{
  totalInvoices:number;
  paidCount:number;
  unpaidCount:number;
  totalPaidAmount:number;
  totalDueAmount:number;
  monthlyData:{
    month:string;
    expense:number;
  }[];
};

const ClientDashboard = () => {
  const [data,setData]=useState<DashboardData |null>(null);
  useEffect(()=>{
    const fetchData=async()=>{
      try{
        const res=await getClientDashboard();
        setData(res);
      }catch(err){
        console.log(err);
      }
    };
    fetchData();
  },[]);
  if(!data)  return <DashboardLayout><h1>somthing went worng</h1></DashboardLayout>
  return (
    <DashboardLayout>
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
       <StatCard label="Total Invoices" value={data.totalInvoices} color="bg-blue-300" Icon={FileText}/>
       <StatCard label="Paid Invoices" value={data.paidCount} color="bg-green-300" Icon={Check}/>
       <StatCard label="Unpaid Invoices" value={data.unpaidCount} color="bg-red-300" Icon={X}/>
       <StatCard label="Total Paid Amount" value={data.totalPaidAmount} color="bg-emerald-300" Icon={IndianRupee}/>
       <StatCard label="Total Due" value={data.totalDueAmount} color="bg-yellow-300" Icon={AlertTriangle}/>
      </div>
      <div className="bg-white shadow-md rounded-xl p-6 mb-10 hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 ease-in-out
                  cursor-pointer"> 
        <h2 className="text-lg font-semibold mb-4">Monthly Expense</h2>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthlyData}>
                <XAxis dataKey="month"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey="expense" fill="#f59e0b" name="Expense" />
            </BarChart>
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

export default ClientDashboard