import { useEffect, useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../layout/DashboardLayout";
import { CreditCardIcon, FileText, ReceiptText, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import Loader from "../ui/Loader";

interface Client{
    company:string;
    address:string;
    contact_info:string;
}
interface CreatedBy{
    name:string;
    company:string;
}
interface InvoiceItem{
    id:number;
    description:string;
    unit_price:number;
    quantity:number;
    tax_percent:number;
}
interface Invoice{
    id:number;
    invoice_number:string;
    tax:number;
    total_amount:number;
    status: string;
    due_date: string;
    created_at: string;
    client: Client;
    created_by: CreatedBy;
    items: InvoiceItem[];
}
interface Expense {
  id: number;
  amount: number;
  category: string;
  note: string;
  date: string;
  receipt_url: string;
}

interface ProfitLossData {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  breakdown: {
    invoices: Invoice[];
    expenses: Expense[];
  };
}
const ProfitLossReport = () => {
    const[report ,setReport]=useState<ProfitLossData | null>(null);
    const [loading,setLoading]=useState(true);
    const [month,setMonth]=useState('');
    const [client,setClient]=useState<number | ''>('');
    const [category,setCategory]=useState('');  

    const handleDownloadPDF=async()=>{
      try{
        const queryParams=new URLSearchParams();
        if (month) queryParams.append('month', month);
        if (client) queryParams.append('clientId', client.toString());
        if (category) queryParams.append('category', category); 

        const url = `/reports/profit-loss/pdf?${queryParams.toString()}`;

        const response= await api.get(url,{responseType:'blob'});

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `profit-loss-report.pdf`; // you can customize the name
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
      }catch(error){
        console.error('Error downloading PDF:', error);
        alert('Failed to download report. Please try again.');
      }
      
    
    }
    const handleExclDownload=async()=>{
      try{
        const queryParams=new URLSearchParams();
        if (month) queryParams.append('month', month);
        if (client) queryParams.append('clientId', client.toString());
        if (category) queryParams.append('category', category); 

        const url = `/reports/profit-loss/excel?${queryParams.toString()}`;

        const response= await api.get(url,{responseType:'blob'});
        if (!response) {
          throw new Error('Failed to download Excel report');
        }
        const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'profit_loss_report.xlsx';
        document.body.appendChild(link);
        link.click();
        link.remove();
      }catch(error){
        console.error('Error downloading Excl:', error);
        alert('Failed to download report. Please try again.');
      }
    }

    useEffect(()=>{
        const  fetchReport=async()=>{
            try{
                const res=await api.get('/reports/profit-loss');
                console.log(res.data)
                setReport(res.data);
            }catch(error){
                console.log('Error to fetach report',error);
            }finally{
                setLoading(false);
            }
        };
        fetchReport();
    },[]);

    if(loading) return  <DashboardLayout><Loader/></DashboardLayout>

    if(!report) return <DashboardLayout><p>Unable to load report.! </p></DashboardLayout>

    const {totalIncome,totalExpense,netProfit,breakdown}=report;
  return (
    <DashboardLayout>
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <FileText className="w-7 h-7 text-blue-600" />
        Profit & Loss Report
      </h1>

      <div className="flex flex-wrap items-end gap-6 mb-10 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
  {/* Month Filter */}
          <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Month</label>
          <input
            type="month"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

        {/* Client ID Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Client ID (optional)</label>
          <input
            type="number"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={client}
            onChange={(e) => setClient(Number(e.target.value))}
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-md hover:bg-blue-700 transition-colors"
          >
            Download PDF
          </button>
          <button
            onClick={handleExclDownload}
            className="bg-green-600 text-white px-4 py-2 cursor-pointer rounded-md hover:bg-green-700 transition-colors"
          >
            Download Excel
          </button>
        </div>
      </div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
                <StatCard label="Total Revenue" value= {`${totalIncome}`} color="bg-green-300" Icon={TrendingUp}/>
                <StatCard label="Total Expense" value= {`${totalExpense}`} color="bg-red-400" Icon={TrendingDown}/>
                <StatCard label="Total Profit" value= {`${netProfit}`} color="bg-indigo-300" Icon={Wallet}/>
      </div>

      {/* Invoices Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2 mt-10 mb-4">
          <ReceiptText className="w-6 h-6 text-indigo-600" />
          Invoices
        </h2>
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-sm font-semibold">#</th>
                <th className="p-3 text-sm font-semibold">Invoice</th>
                <th className="p-3 text-sm font-semibold">Client</th>
                <th className="p-3 text-sm font-semibold">Amount</th>
                <th className="p-3 text-sm font-semibold">Tax</th>
                <th className="p-3 text-sm font-semibold">Status</th>
                <th className="p-3 text-sm font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.invoices.map((inv, idx) => (
                <tr key={inv.id} className="border-t hover:bg-gray-100">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{inv.invoice_number}</td>
                  <td className="p-3">{inv.client?.company || 'N/A'}</td>
                  <td className="p-3">₹{inv.total_amount}</td>
                  <td className="p-3">₹{inv.tax}</td>
                  <td className="p-3">{inv.status}</td>
                  <td className="p-3">{new Date(inv.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Expenses Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2 mt-10 mb-4">
          <CreditCardIcon className="w-6 h-6 text-red-600" />
          Expenses
        </h2>
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="min-w-full bg-white border border-gray-50">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-sm font-semibold">#</th>
                <th className="p-3 text-sm font-semibold">Category</th>
                <th className="p-3 text-sm font-semibold">Amount</th>
                <th className="p-3 text-sm font-semibold">Note</th>
                <th className="p-3 text-sm font-semibold">Date</th>
                <th className="p-3 text-sm font-semibold">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.expenses.map((exp, idx) => (
                <tr key={exp.id} className="border-t hover:bg-gray-100">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{exp.category}</td>
                  <td className="p-3">₹{exp.amount}</td>
                  <td className="p-3">{exp.note}</td>
                  <td className="p-3">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="p-3">
                    <a
                      href={exp.receipt_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
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
export default ProfitLossReport