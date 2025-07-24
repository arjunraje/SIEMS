import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createExpense } from "../../services/expenseService";
import DashboardLayout from "../layout/DashboardLayout";


const ExpenseCreate = () => {
    const navigate=useNavigate()
    const [amount,setAmount]=useState<number>(0);
    const [category,setCategory]=useState('');
    const [note,setNote]=useState('');
    const [date,setDate]=useState('');
    const [receipt,setReceipt]=useState<File | null>(null);
    const [loading,setLoading]=useState(false);
    const [err,setErr]=useState<string |null>(null);

    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true)
        setErr(null)
        try{
            const formData=new FormData();
            formData.append('amount',amount.toString());
            formData.append('category',category);
            formData.append('note',note);
            formData.append('date',date);
            if(receipt){formData.append('receipt',receipt);}
            
            await createExpense(formData)
            navigate('/expenses')
        }catch(err:any){
            setErr(err?.response?.data?.message || "Failed to create expense");
        }finally{
            setLoading(false);
        }
    };
  return (
    <DashboardLayout>
        <div className="max-w-xl mx-auto bg-white p-6 mt-10 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Expense</h2>
      {err && <p className="text-red-500 mb-4">{err}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Receipt (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setReceipt(e.target.files?.[0] || null)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Create Expense"}
        </button>
      </form>
    </div>
    </DashboardLayout>
  )
}

export default ExpenseCreate