import api from "./api"

export const getAllInvoices=async()=>{
    const res=await api.get('/invoices');
    return res.data;
};

export const getInvoiceDetails=async(id:string)=>{
    const res=await api.get(`/invoices/${id}`);
    return res.data;
}

export const deleteInvoice=async(id:number)=>{
    const res=await api.delete(`/invoices/${id}`);
    if (!res.data) throw new Error("Failed to delete invoice");

    return await res.data;
}

export const updateInvoice=async(id:string,status:string)=>{
    const res=await api.patch(`/invoices/${id}`,{status});
    if(!res.data){
        throw new Error("Failed to update invoice");
    }
    return res.data;
    
}

export const getIvoicePdf=async(id:number)=>{
    const res=await api.get(`/invoices/${id}/pdf`,{responseType:'blob',});
    if(!res.data) throw new Error('Faild to download')
    const fileURL = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};

export const createInvoice=async(data:any)=>{
    const res=await api.post('/invoices',data);
    return res.data;
}; 