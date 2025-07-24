import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import authService from "../services/authService";

interface User{
    id:string;
    name:string;
    email:string;
    role:'Admin'|'Accountant'|'Client';
}

interface AuthContextType{
    user:User |null;
    login:(email:string,password:string)=>Promise<boolean>;
    logout:()=>void;
    isLoading:Boolean;
    error:string|null;
}

interface AuthProviderProps{
    children:ReactNode;
}
const AuthContext=createContext<AuthContextType | undefined>(undefined);

export const AuthProvider:React.FC<AuthProviderProps>=({children})=>{
    const [user,setUser]=useState<User|null>(null);
    const [isLoading,setIsLoading]=useState<boolean>(true);
    const [error,setError]=useState<string |null>(null);

    useEffect(()=>{
    const initializeAuth=()=>{
        try{
            const storedUser=authService.getStoredUser();
            const token=authService.getStoredToken();

            if(storedUser && token){
                setUser(storedUser);
            }else{
                console.log('No stored user');
            }
        }catch(error){
            setError('Faild to initialize authentication');
        }finally{
            setIsLoading(false)
        }
    };
    initializeAuth()
    },[]);

    const login=async(email:string,password:string):Promise<boolean>=>{
        setIsLoading(true);
        setError(null);
        try{
            const response=await authService.login({email,password});

            if(response.success && response.user){
                console.log('login successfull');
                setUser(response.user);
                return true
            }else{
                console.log('Login failed:', response.message);
                setError(response.message || 'Login failed');
                return false;
            }
        }catch(error:any){
            console.error('Login error:', error.message);
            setError(error.message);
            return false;
        }finally{
            setIsLoading(false);
        }
    }

    const logout = async () => {
        console.log(' Logout initiated');
        setIsLoading(true);
        
        try {
        await authService.logout();
        console.log('Logout successful');
        } catch (error) {
        console.error('Logout error:', error);
        } finally {
        setUser(null);
        setError(null);
        setIsLoading(false);
        }
    };

    const value:AuthContextType={
        user,
        login,
        logout,
        isLoading,
        error
    };

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth=()=>{
    const context=useContext(AuthContext);
    if(context===undefined){
        throw  new Error('useAuth must be used with an authproivder')
    }
    return context;
}



