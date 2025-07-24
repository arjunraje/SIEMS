
import DashboardLayout from "../layout/DashboardLayout"
import { useEffect, useState } from "react";
import { getAllInvoices } from "../../services/invoiceService";
import { Card } from "../ui/Card";
import { useNavigate } from "react-router-dom";
import Loader from "../ui/Loader";

interface InvoiceItem{
  id:number;
  invoice_number:string;
  tax:number;
  total_amount:number;
  status:string;
  due_date:string;
  client:{
    company:string;
    contact_info:string;
    user:{
      id:number;
      name:string;
      email:string;
    }
  };
}
const Invoice = () => {
  const [invoices,setInvoices]=useState<InvoiceItem[]>([]);
  const [loading,setLoading]=useState(true);
  const navigate=useNavigate()
  useEffect(()=>{
    const fetchInvoices=async()=>{
      try{
        const data=await getAllInvoices();
        setInvoices(data);
        console.log(data);
      }catch(err){
        console.log("Faild to fetch",err)
      }finally{
        setLoading(false);
      }
    };
    fetchInvoices();
  },[]);
const handleInvoice=(id:number)=>{
  navigate(`/invoice/${id}`)
  
}

const handleCreateInvoice=()=>{
  navigate('/invoice/create')
}
  if(loading) return <DashboardLayout><Loader/></DashboardLayout>
  return (
    <div>
        <DashboardLayout>
            <div className="p-4">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
                
                <button
                  onClick={handleCreateInvoice}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition duration-200"
                  title="Create Invoice"
                >
                  <span>Create</span>
                </button>
              </div>

              <div className="grid gap-4">
                {invoices.map((invoice) => (
                  <Card key={invoice.id} onClick={()=>handleInvoice(invoice.id)} className="p-4 shadow">
                    <div   className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{invoice.invoice_number}</div>
                        <div className="text-sm text-gray-500">
                          Client: {invoice.client?.user?.name || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Due: {new Date(invoice.due_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{invoice.total_amount}</div>
                        <span
                          className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                            invoice.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
        </DashboardLayout>
    </div>
  )
}

export default Invoice