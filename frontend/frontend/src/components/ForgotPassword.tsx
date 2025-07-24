import { useState } from "react"
import { Card } from "./ui/Card";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import { forgotPassword } from "../services/authService";




const ForgotPassword = () => {
    const[email,setEmail]=useState('');
    const [message,setMessage]=useState('');
    const [error,setError]=useState('')

    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        setError('');
        setMessage('')
        try{
            await forgotPassword(email);
            setMessage('Password rest link send to your email');
        }catch(err){
            console.log(err);
            setError('Faild to send rest link.Please try again.!');
        }
    }
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <Card>
        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2  bg-white shadow-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>
                        {message && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
                {message}
            </div>
            )}

            {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
            </div>
)}
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send Rest Link
          </Button>
        </form>
        </Card>
      </div>
    </div>
  )
}

export default ForgotPassword