import { useNavigate, useParams } from "react-router-dom"
import DashboardLayout from "../layout/DashboardLayout"
import { useEffect, useState } from "react";
import { deleteInvoice, getInvoiceDetails, getIvoicePdf } from "../../services/invoiceService";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { useAuth } from "../../contexts/AuthContext";
import { Download } from "lucide-react";
import Loader from "../ui/Loader";


type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Client = {
  id: number;
  company: string;
  address: string;
  contact_info: string;
  user: User & { client?: Client };
};

type InvoiceItem = {
  id: number;
  description: string;
  unit_price: number;
  quantity: number;
  tax_percent: number;
};

type Invoice = {
  id: number;
  invoice_number: string;
  tax: number;
  total_amount: number;
  status: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  client: Client;
  items: InvoiceItem[];
  created_by: User;
};

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const InvoiceDetail = () => {
  const {id}=useParams<{id:string}>();
  const [invoice,setInovoice]=useState<Invoice |null > (null);
  const navigate=useNavigate();
  const {user}=useAuth()

  useEffect(()=>{
    const fetchInvoice=async(id:string)=>{
      try{
        const data=await getInvoiceDetails(id);
        setInovoice(data)
        
        console.log(user?.role);
        
      }catch(err){
        console.log(err)
      }
    }
     if (id) {
    fetchInvoice(id);
  }
  },[])
const handleDelete=async()=>{
  const confirDelete=window.confirm('Are you sure want to delete this invoice!');
  if(!confirDelete) return
  try{
    const data=await deleteInvoice(invoice!.id);
    console.log(data);
    alert('Invoice deleted Successfully!');
    navigate('/invoices');
  }catch(err){
    console.log('Faild to delete Invoice!',err);
    alert('Ops!');
  }
}
const handleEdit=()=>{
  navigate(`/invoice/update/${invoice?.id}`);
}

const handleDownloadPDF=async()=>{
  const id:number=invoice!.id
  if(!id) return;
  try{
    await getIvoicePdf(id);
  }catch(err){
    alert('faild to download')
    console.log(err);
  }
}
  if (!invoice) {
    return <DashboardLayout><Loader/></DashboardLayout>;
  }
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Header */}
        
        <div className="flex flex-wrap justify-between items-center border-b pb-4 gap-4">
          {/* Left: Invoice title */}
          <h1 className="text-3xl font-bold text-gray-800">
            Invoice #{invoice.invoice_number}
          </h1>

          {/* Right: Status + Download button */}
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                invoice.status
              )}`}
            >
              {invoice.status}
            </span>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition duration-200 cursor-pointer"
              title="Download PDF"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>


        {/* Summary Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Invoice Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-4 text-gray-600 text-sm">
              <div><strong>Due Date:</strong> {new Date(invoice.due_date).toLocaleDateString()}</div>
              <div><strong>Created At:</strong> {new Date(invoice.created_at).toLocaleString()}</div>
              <div><strong>Updated At:</strong> {new Date(invoice.updated_at).toLocaleString()}</div>
              <div><strong>Tax:</strong> ₹{invoice.tax}</div>
              <div><strong>Total Amount:</strong> <span className="text-base text-black font-medium">₹{invoice.total_amount}</span></div>
            </div>
          </CardContent>
        

        {/* Client Info */}
        
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Client Information</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 text-sm space-y-1">
            <p><strong>Company:</strong> {invoice.client.company}</p>
            <p><strong>Address:</strong> {invoice.client.address}</p>
            <p><strong>Contact:</strong> {invoice.client.contact_info}</p>
            <p><strong>Client Name:</strong> {invoice.client.user.name}</p>
            <p><strong>Client Email:</strong> {invoice.client.user.email}</p>
          </CardContent>
        </Card>

        

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Invoice Items</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100 text-gray-800 font-medium">
                <tr>
                  <th className="p-3 text-left border-b">Description</th>
                  <th className="p-3 text-left border-b">Unit Price</th>
                  <th className="p-3 text-left border-b">Qty</th>
                  <th className="p-3 text-left border-b">Tax %</th>
                  <th className="p-3 text-left border-b">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 border-b">
                    <td className="p-3">{item.description}</td>
                    <td className="p-3">₹{item.unit_price}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">{item.tax_percent}%</td>
                    <td className="p-3 font-medium text-gray-700">
                      ₹{(item.unit_price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        {/* Created By */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Created By</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 text-sm space-y-1">
            <p><strong>Name:</strong> {invoice.created_by.name}</p>
            <p><strong>Email:</strong> {invoice.created_by.email}</p>
            <p><strong>Role:</strong> {invoice.created_by.role}</p>
          </CardContent>
        </Card>
            
        <div className="flex justify-between items-center border-b pb-4">
          
         {
          (user?.name=== invoice.created_by.name || user?.role==='Admin') &&(
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="px-4 py-2 text-sm font-medium text-white cursor-pointer bg-blue-600 hover:bg-blue-700 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white cursor-pointer bg-red-600 hover:bg-red-700 rounded"
            >
              Delete
            </button>
          </div>)}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default InvoiceDetail