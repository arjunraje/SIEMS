import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, IndianRupee } from 'lucide-react';
import { Card } from './ui/Card';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';

const Login:React.FC = () => {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [showPassword,setShowPassword]=useState(false);
    const{login,isLoading,error}=useAuth()

    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        const success=await login(email,password);
        if(success){
            console.log('logined')
        }else{
            console.log('faild to login')
        }
    };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <Card>
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-full">
              <IndianRupee size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to SIEMS
          </h2>
          <p className="text-gray-600">
            Smart Invoicing & Expense Management System
          </p>
        </div>

    

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
            
            <div>
              
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 pr-10  bg-white  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-gray-400" />
                  ) : (
                    <Eye size={16} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            aria-disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          <div className='text-right mt-1'>
            <a href='/forgot-password' className='text-sm text-blue-600 hover:underline'>Forgot password</a>
          </div>
        </form>
        </Card>
      </div>
    </div>
  )
}

export default Login