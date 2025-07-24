import api from "./api"

export const getExpense=async(params:any)=>{
    const res=await api.get('/expenses',params);
    return res.data;
}
export const getExpenseById=async(id:string)=>{
    const res=await api.get(`/expenses/${id}`)
    return res.data;
}

export const createExpense=async(data:any)=>{
    const res=await api.post('/expenses',data,{ headers: { "Content-Type": "multipart/form-data" },});
    if(res.status!==201) throw new Error('Faild to create expense');
}

export const updateExpense=async(id:string,data:any)=>{
    await api.put(`/expenses/${id}`,data,{ headers: { "Content-Type": "multipart/form-data" },});
}

export const deleteExpense=async(id:number)=>{
    await api.delete(`/expenses/${id}`);
}