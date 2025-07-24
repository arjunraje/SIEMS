import api from "./api"

export const getAdmindashboard=async()=>{
    const response=await api.get('/reports/admin-dashboard');
    return response.data;
}