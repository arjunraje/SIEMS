import api from "./api"

export const getAccountantDashboard=async()=>{
    const response=await api.get('/reports/accountant-dash');
    return response.data;
}

