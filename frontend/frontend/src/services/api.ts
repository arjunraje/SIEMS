import axios from "axios";

const API_BASE_URL='http://localhost:5000/api';

const api=axios.create({
    baseURL:API_BASE_URL,
    headers:{
        'Content-Type':'application/json'
    },
});

api.interceptors.request.use(
    (config)=>{
        const token=localStorage.getItem('siems_token');
        if(token){
            config.headers.Authorization=`Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response?.status===401){
            localStorage.removeItem('siems_token');
            localStorage.removeItem('siems_user');
            window.location.href='/';
        }
        return Promise.reject(error);
    }
);

export default  api;