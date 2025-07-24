import { useNavigate } from "react-router-dom"
import DashboardLayout from "../layout/DashboardLayout"
import { useEffect, useState } from "react";
import { createInvoice } from "../../services/invoiceService";
import api from "../../services/api";

interface Client {
  id: number;
  name: string;
}
const InvoiceCreate = () => {
    const navigate=useNavigate();
    const [clients,setClients]=useState<Client[]>([]);
    const [formData,setFormData]=useState({
        client_id:0,
        due_date:'',
        items:[
            {description:'',unit_price:0,quntity:1,tax_percent:0}
        ],
    });

    const handleItemChange=(index:number,field:string,value:any)=>{
        const updatedItems=[...formData.items];
        updatedItems[index]={...updatedItems[index],[field]:value};
        setFormData({...formData,items:updatedItems});
    }

    const addItem=()=>{
        setFormData({
            ...formData,
            items:[...formData.items,{description:'',unit_price:0,quntity:1,tax_percent:0}],
        });
    };

    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        try{
            const payload={
                ...formData,
                client_id:Number(formData.client_id),
                items:formData.items.map(item=>({
                    ...item,
                    unit_price:Number(item.unit_price),
                    quantity:Number(item.quntity),
                    tax_percent:Number(item.tax_percent)
                }))
            };
            await createInvoice(payload);
            alert("Invoice created successfully");
            navigate('/invoices');
        }catch(err){
            console.log(err);
            alert('Faild to create invoice')
        }
    };

    useEffect(()=>{
        const fetchClients=async()=>{
            try{
                const res=await api.get('/clients');
                setClients(res.data);
            }catch(err){
                console.log("Faild to load clients",err);
            }
        };
        fetchClients();
    },[]);
  return (
    <DashboardLayout>
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Invoice</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client ID */}
            <label className="block mb-2 text-sm font-medium">Client</label>
      <select
        className="w-full p-2 border rounded"
        value={formData.client_id}
        onChange={(e) => setFormData({ ...formData, client_id: Number(e.target.value) })}
        required
      >
        <option value="">Select a Client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select> 
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
            <input
                type="number"
                placeholder="Enter Client ID"
                value={formData.client_id}
                onChange={(e) =>
                setFormData({ ...formData, client_id:Number(e.target.value) })
                }
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>

            {/* Due Date */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
                }
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>

            {/* Invoice Items */}
            <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Invoice Items</h3>
            {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-3">
                <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    placeholder="Unit Price"
                    onChange={(e) => handleItemChange(index, "unit_price", Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    placeholder="Tax %"
                    onChange={(e) => handleItemChange(index, "tax_percent", Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
            ))}

            <button
                type="button"
                onClick={addItem}
                className="text-sm text-blue-600 hover:underline font-medium mt-2"
            >
                + Add another item
            </button>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4">
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow font-medium transition duration-150"
            >
                Create Invoice
            </button>
            </div>
        </form>
        </div>

    </DashboardLayout>
  )
}

export default InvoiceCreate