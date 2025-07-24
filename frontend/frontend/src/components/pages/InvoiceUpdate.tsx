import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { getInvoiceDetails, updateInvoice } from "../../services/invoiceService";
import DashboardLayout from "../layout/DashboardLayout";


const InvoiceUpdate = () => {
    const {id}=useParams<{id:string}>();
    const navigate=useNavigate();
    const [status,setStatus]=useState('');
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const fetchInvoice=async()=>{
            if(!id) return;
            try{
                const data=await  getInvoiceDetails(id);
                setStatus(data.status);
            }catch(err){
            console.log(err)
            }finally{
                setLoading(false);
            }
        }
        fetchInvoice();
    },[id]);
    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        if(!id) return

        try{
            console.log(status)
            await updateInvoice(id,status);
            alert("Status updated successfully!");
            navigate(`/invoice/${id}`);
        }catch(err){
            console.log("Updated failde!");
            alert("Faild to Update");
        }
    };

    if(loading) return <div className="p-4">Loading...</div>;

  return (
    <DashboardLayout>
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Edit Invoice Status</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
    </DashboardLayout>
  )
}

export default InvoiceUpdate