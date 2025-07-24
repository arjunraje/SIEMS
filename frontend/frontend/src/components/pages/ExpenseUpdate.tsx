import { useNavigate, useParams } from "react-router-dom"
import DashboardLayout from "../layout/DashboardLayout"
import { useEffect, useState } from "react"
import {getExpenseById, updateExpense } from "../../services/expenseService"

const ExpenseUpdate = () => {
    const {id}=useParams<{ id: string }>();
    const navigate=useNavigate();

    const [expense,setExpense]=useState<any>(null);
    const [form,setForm]=useState({
        amount:'',
        category: '',
        note: '',
        date: '',
        receipt: null as File | null,
    });

    useEffect(()=>{
        if(id){
            getExpenseById(id).then((res)=>{
                setExpense(res);
                setForm({
                     amount: res.amount,
                    category: res.category,
                    note: res.note,
                    date: res.date.slice(0, 10),
                    receipt: null,
                });
            });
        }
    },[id]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setForm((prev) => ({ ...prev, receipt: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const formData = new FormData();
    formData.append('amount', form.amount.toString());
    formData.append('category', form.category);
    formData.append('note', form.note);
    formData.append('date', form.date);
    if (form.receipt) formData.append('receipt', form.receipt);

    try {
      await updateExpense(id, formData);
      navigate('/expenses');
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  if (!expense) return <p>Loading...</p>;


  return (
    <DashboardLayout>
       <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Update Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Note"
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          name="receipt"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Expense
        </button>
      </form>
    </div>
    </DashboardLayout>
  )
}

export default ExpenseUpdate