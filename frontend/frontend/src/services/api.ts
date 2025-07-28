import axios from "axios";

const API_BASE_URL='http://localhost:5000/api';

const api=axios.create({
    baseURL:API_BASE_URL,
    withCredentials:true,
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
    async(error)=>{
        const originalRequest=error.config;

        if(error.response?.status===401 && !originalRequest._retry){
            originalRequest._retry=true;

            try{
                const refreshResponse=await axios.get(`${API_BASE_URL}/auth/refresh`,{withCredentials:true,});

                const newAccessToken=refreshResponse.data.accessToken;

                localStorage.setItem('siems_token',newAccessToken);

                originalRequest.headers.Authorization=`Bearer ${newAccessToken}`;
            
                return api(originalRequest);
            }catch(error){
                localStorage.removeItem('siems_token');
                localStorage.removeItem('siems_user');
                window.location.href='/';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
    
    
);

export default  api;