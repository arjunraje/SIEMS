import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { resetPassword } from "../services/authService";
import { Card } from "./ui/Card";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";

export const ResetPassword = () => {
    const {token}=useParams();
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [error,setError]=useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [message,setMessage]=useState('');
    const navigate=useNavigate();

    const handleReset=async(e:React.FormEvent)=>{
        e.preventDefault();
        setError('')
        setMessage('')
        if(!token){
            alert("Reset token is missing");
            return;
        }

        if(password !==confirmPassword){
            setError('Password do not match!');
            return
        }
        try{
            setIsLoading(true);
            await resetPassword(token!,password);
            setMessage('Password rest successfully.!');
            setPassword('');
            setConfirmPassword('');
            navigate('/');
        }catch(err){
            console.log(err)
            setError('Faild to reset password!');
        }finally{
            setIsLoading(false)
        }
    }
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <Card>
        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleReset}>
          <div className="space-y-4">
            <div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2  bg-white shadow-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <Input
                id="password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2  bg-white shadow-sm"
                placeholder="Confirm Password"
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
            Reset Password
          </Button>
        </form>
        </Card>
      </div>
    </div>
  )
}
