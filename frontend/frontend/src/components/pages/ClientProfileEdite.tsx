import { useEffect, useState } from "react"
import { getClientProfile, updateProfile } from "../../services/clientService";
import Input from "@mui/material/Input";
import { Card, CardContent } from "../ui/Card";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Phone, Save } from "lucide-react";
import Button from "@mui/material/Button";
import DashboardLayout from "../layout/DashboardLayout";



const ClientProfileEdite = () => {
    const [company,setCompany]=useState("");
    const [address,setAddress]=useState("");
    const [contactInfo,setContactInfo]=useState("");
    const navigate=useNavigate()

    useEffect(()=>{
        const fetchProfile=async()=>{
            try{
                const res=await getClientProfile();
                setCompany(res.company || "");
                setAddress(res.address || "");
                setContactInfo(res.contact_info || "");
            }catch(err){
                console.log(err);
            }
        };
        fetchProfile()
    },[]);

    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        try{
            await updateProfile(company,address,contactInfo);
            navigate('/profile');
        }catch(err){
            console.log(err)
        }
    };
  return (
    <DashboardLayout>
     <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>

      <Card>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-indigo-500" />
                Company
              </label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Enter company name"
                required
                className="focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-indigo-500" />
                Address
              </label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter company address"
                required
                className="focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Contact Info */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4 text-indigo-500" />
                Contact Info
              </label>
              <Input
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Enter contact number or email"
                required
                className="focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Save className="w-4 h-4" />
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  )
}

export default ClientProfileEdite