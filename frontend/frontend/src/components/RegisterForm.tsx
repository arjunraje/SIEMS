import { useState } from "react"
import { registerUser } from "../services/authService";
import toast from "react-hot-toast";
import DashboardLayout from "./layout/DashboardLayout";
import { Card, CardContent } from "./ui/Card";
import { Lock, Mail, Shield, User } from "lucide-react";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";


const RegisterForm = () => {
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [role,setRole]=useState('');
    const [errorMsg,setErrorMsg]=useState('')
    const navigate=useNavigate();

    const handleRegistration=async(e:React.FormEvent)=>{
        e.preventDefault();
        setErrorMsg('');
        console.log('inside funcionn refnflkndf ')
        try{
            await registerUser({name,email,password,role});
            toast.success("Registerd successfully!");
            setName('');
            setEmail('');
            setPassword('');
            setRole('Client');
            navigate('/')
        }catch(err:any){
            if(err.response.data.message?.includes('User')){
                setErrorMsg('User is already exists');
            }else{
                setErrorMsg("Please try again");
            }
        }
    };
  return (
    <DashboardLayout>
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-3xl font-blod mb-6 text-center text-indigo-600">Create User</h2>

            <Card className="shadow-lg border border-gray-200">
                <CardContent className="p-6 space-y-5">
                    <form onSubmit={handleRegistration} className="space-y-5">
                        <div className="relative">
                            <User className="absolute left-3 text-gray-400 " size={18}/>
                            <Input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full Name" required className="pl-10"/>
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 text-gray-400 " size={18}/>
                            <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required className="pl-10"/>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 text-gray-400 " size={18}/>
                            <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" required className="pl-10"/>
                        </div>
                        <div className="relative">
                            <Shield className="absolute left-3 text-gray-400 " size={18}/>
                            <select value={role} onChange={(e)=>setRole(e.target.value)} className="pl-10 w-full px-3 py-2 border-b border-gray-400  text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
                                <option value="Client">Client</option>
                                <option value="Admin">Admin</option>
                                <option value="Accountant">Accountant</option>
                            </select>
                        </div>
                        {errorMsg && (
                        <p className="text-red-600 text-sm text-center font-medium">
                            {errorMsg}
                        </p>
                        )}
                         <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2"
                        >
                        Register
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </DashboardLayout>
  )
}

export default RegisterForm