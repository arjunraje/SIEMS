import api from "./api"

export const getClientDashboard=async()=>{
    const res= await api.get('/reports/client-dash');
    return res.data;
}

export const getInvoiceOfClient=async()=>{
    const res=await api.get('/clients/my');
    return res.data;
}

export const getClientProfile=async()=>{
    const res=await api.get('/clients/profile');
    return res.data;
}

export const updateProfile=async(company:string,address:string,contact_info:string)=>{
    await api.patch('/clients/my',{company,address,contact_info});
}