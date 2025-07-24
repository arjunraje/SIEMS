import { useEffect, useState } from "react"
import { deleteExpense, getExpense } from "../../services/expenseService";
import DashboardLayout from "../layout/DashboardLayout";
import Loader from "../ui/Loader";
import { Card } from "../ui/Card";
import {format} from 'date-fns';
import { CalendarDays, IndianRupee, Paperclip, StickyNote, Tag, User,Plus, Edit, Trash, Filter, Calendar, DollarSign, ListFilter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface User{
    id:number;
    name:string;
    email:string;
    role:string;
}
interface Expense{
    id:number;
    amount:number;
    category:string;
    note:string;
    date:string;
    receipt_url:string;
    created_at:string;
    created_by:User;
}
const Expense = () => {
    const [loading,setLoading]=useState(true);
    const [expenses,setExpenses]=useState<Expense[]>([]);
    const [filters,setFilters]=useState({
      category:"",
      month:"",
      min:"",
      max:"",
    });
    const [selectedReceipt,setSelectedReceipt]=useState<string |null>(null);
    const navigate=useNavigate()
    const {user}=useAuth()
    
    const fetchExpenses=async()=>{
            try{
                const res=await getExpense({params:filters})
                setExpenses(res);
            }catch(err){
                console.log(err)
            }finally{
                setLoading(false);
            }
        }
    useEffect(()=>{
       fetchExpenses()
    },[])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = () => {
    fetchExpenses();
  };
    const handleDelete=async(id:number)=>{
        const confirmDelete=window.confirm("Are you sure want to delete!")
        if(!confirmDelete) return
        try{
            await deleteExpense(id);
            fetchExpenses()
        }catch(err){
            console.log(err);
        }
    }
    const handleCreateExpense=()=>{
        navigate('/expenses/create')
    }
    const handleUpdateExpense=(id:number)=>{
        navigate(`/expenses/${id}`)
    }
    if (loading) return <DashboardLayout><Loader/></DashboardLayout>
  return (
    <DashboardLayout>
        <div className="max-w-6xl mx-auto p-6">
      

        <div className="flex justify-between items-center p-4">
        <h1 className="text-3xl font-bold text-gray-800">All Expenses</h1>

        <button
            onClick={handleCreateExpense}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition duration-200"
            title="Create Expense"
        >
            <Plus className="w-5 h-5" />
            <span>Create</span>
        </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end p-2">
      {/* Category */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="category"
              value={filters.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Month */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="month"
              name="month"
              value={filters.month}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Min Amount */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              name="min"
              placeholder="Min Amount"
              value={filters.min}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Max Amount */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              name="max"
              placeholder="Max Amount"
              value={filters.max}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Apply Filters Button */}
          <button
            onClick={handleFilter}
            className="col-span-1 sm:col-span-2 md:col-span-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition"
          >
            <ListFilter className="w-4 h-4" />
            Apply Filters
          </button>
      </div>

      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {expenses.map((expense) => (
             <Card key={expense.id} className="p-4 shadow-md rounded-2xl">
            
              <div className="flex justify-between">
                  <div className="mb-3 flex items-center text-sm text-gray-600">
                    <Tag className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-semibold">Category:</span>&nbsp;
                    <span className="ml-1 inline-block px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-medium">
                      {expense.category}
                    </span>
                  </div>
                  {(user?.name=== expense.created_by.name || user?.role==='Admin') &&(
                    <div>
                    <Edit onClick={()=>handleUpdateExpense(expense.id)} className="w-4 h-4 mr-2 text-gray-500"/>
                    <Trash onClick={()=>handleDelete(expense.id)} className="w-4 h-4 mr-2 text-gray-500"/>
                    </div>
                  )}
                  
              </div>
              <div className="mb-3 flex items-center text-sm text-gray-700">
                <IndianRupee className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-semibold">Amount:</span>&nbsp; ₹{expense.amount}
              </div>

              <div className="mb-3 flex items-center text-sm text-gray-700">
                <StickyNote className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-semibold">Note:</span>&nbsp; {expense.note}
              </div>

              <div className="mb-3 flex items-center text-sm text-gray-700">
                <CalendarDays className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-semibold">Date:</span>&nbsp;
                {format(new Date(expense.date), 'dd MMM yyyy')}
              </div>

              <div className="mb-3 flex items-center text-sm text-gray-700">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-semibold">Created By:</span>&nbsp;
                {expense.created_by?.name}&nbsp;
                <span className="ml-1 inline-block px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-xs font-medium">
                  {expense.created_by?.role}
                </span>
              </div>

              <div className="flex items-center text-sm">
                <Paperclip className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-semibold">Receipt:</span>&nbsp;
                <button
                onClick={() => setSelectedReceipt(expense.receipt_url)}
                className="text-blue-600 underline hover:text-blue-800 transition"
                >
                View Receipt
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div> 
    {selectedReceipt && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity"
    onClick={() => setSelectedReceipt(null)} // click outside to close
  >
    <div
      className="bg-white relative rounded-xl shadow-2xl p-4 sm:p-6 max-w-2xl w-full mx-4 animate-fadeIn"
      onClick={(e) => e.stopPropagation()} // prevent closing on inside click
    >
      {/* Close Button */}
      <button
        onClick={() => setSelectedReceipt(null)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-lg font-semibold mb-4 text-gray-800">Receipt Preview</h2>

      <div className="rounded-lg overflow-hidden border border-gray-200">
        <img
          src={`http://localhost:5000${selectedReceipt}`}
          alt="Receipt"
          className="w-full max-h-[70vh] object-contain bg-gray-50"
        />
      </div>
    </div>
  </div>
)}

    </DashboardLayout>
  )
}

export default Expense