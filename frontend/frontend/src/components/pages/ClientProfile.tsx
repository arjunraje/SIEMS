import { useEffect, useState } from "react";
import { getClientProfile } from "../../services/clientService";
import { Card, CardContent } from "../ui/Card";
import { Building2, Calendar, Edit, Mail, MapPin, Phone, Shield, User, type LucideIcon } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import Loader from "../ui/Loader";

interface ClientProfileData {
  id: number;
  company: string;
  address: string;
  contact_info: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
};
const ClientProfile = () => {
    const [profile,setProfile]=useState<ClientProfileData | null>(null);
    const navigate=useNavigate();
    useEffect(()=>{
        const fetchData=async()=>{
            try{
                const res=await getClientProfile();
                setProfile(res)
                console.log(res)
                console.log(profile?.user.name)
            }catch(err){
                console.log(err)
            }
        };
        fetchData();
    },[]);

    const handleProfile=()=>{
        navigate('/edit')
    }
    if(!profile) return <DashboardLayout><Loader/></DashboardLayout>
  return (
    <DashboardLayout>
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Client Profile</h1>

      {/* User Info */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <h2 className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" />
            User Information
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            <InfoRow icon={User} label="Name" value={profile.user.name} />
            <InfoRow icon={Mail} label="Email" value={profile.user.email} />
            <InfoRow icon={Shield} label="Role" value={profile.user.role} />
            <InfoRow
              icon={Calendar}
              label="Joined At"
              value={new Date(profile.user.created_at).toLocaleString()}
            />
          </div>
        </CardContent>
      </Card>

      {/* Client Info */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex justify-between">
              <h2 className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-500" />
                Company Details
              </h2>
              <div>
                <Edit onClick={handleProfile} className="w-6 h-6 text-gray-500"/>
              </div>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <InfoRow
              icon={Building2}
              label="Company"
              value={profile.company || "N/A"}
            />
            <InfoRow
              icon={MapPin}
              label="Address"
              value={profile.address || "N/A"}
            />
            <InfoRow
              icon={Phone}
              label="Contact Info"
              value={profile.contact_info || "N/A"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  )
}
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-gray-500" />
      <span className="font-medium text-gray-600">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
export default ClientProfile