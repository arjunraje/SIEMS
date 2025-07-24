import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Accountant' | 'Client';
  };
  message?: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Attempting login with:', credentials.email);
      
      const response = await api.post('/auth/login', credentials);
      
      console.log('Login response:', response.data);
      
      if (response.data.success && response.data.accessToken){
        localStorage.setItem('siems_token', response.data.accessToken);
        localStorage.setItem('siems_user', JSON.stringify(response.data.user));
        
        console.log(' Token and user data stored in localStorage');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response.data);
        throw new Error(error.response.data?.message || 'Login failed');
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response from server:', error.request);
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      } else {
        // Something else happened
        console.error('Request setup error:', error.message);
        throw new Error('Login request failed');
      }
    }
  }

  async logout(): Promise<void> {
    try {
      console.log(' Logging out...');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      
      localStorage.removeItem('siems_token');
      localStorage.removeItem('siems_user');
      console.log('Cleared localStorage');
    }
  }

  getStoredUser() {
    try {
      const userData = localStorage.getItem('siems_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem('siems_token');
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export default new AuthService();

interface RegisterData{
    name:string;
    email:string;
    password:string;
    role?:string;
}

export const registerUser=async(data:RegisterData)=>{
  try{
    const res=await api.post('/auth/register',{...data,role:data.role||"Client"})
    return res.data;
  }catch(err){
    console.log(err)
  }
  
}

export const forgotPassword=async(email:string)=>{
  try{
    const res=await api.post('/auth/forgot-password',{email})
    return res.data;
  }catch(err){
    console.log(err);
  }
}

export const resetPassword=async(token:string,password:string)=>{
  try{
    const res=await api.post(`/auth/reset-password/${token}`,{password,});
    return res.data
  }catch(err){
    console.log(err);
  }
}