import { Request,Response } from "express";
import { AuthService } from "../services/auth.service";
import jwt from 'jsonwebtoken'
import { AppDataSource } from "../config /db";
import { User } from "../entities/User";
import crypto from 'crypto';
import bycript from 'bcrypt'

import { sendMail } from "../utils/sendReminderEmail";

//Register controll
export const register=async(req:Request,res:Response)=>{
    try{
        const user=await AuthService.register(req.body);
        res.status(201).json({user});
    }catch(err:any){
        res.status(400).json({message:err.message})
    }
};

//login controll
export const login=async(req:Request,res:Response)=>{
    try{
        const {email,password}=req.body
        const {user,accessToken,refreshToken}=await AuthService.login(email,password);

        //set refresToken in cookie
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:'strict',
            maxAge:7*24*60*60*1000
        });
        res.json({user,accessToken,"success": true,});

    }catch(err:any){
        res.status(401).json({message:err.message});
    }
};

//set accessToken when it expierd
export const refreshToken=(req:Request,res:Response)=>{
    const token=req.cookies.refreshToken;
    if(!token) return res.sendStatus(401);
    console.log(token)
    try{
        const  payload=jwt.verify(token,process.env.REFRESH_SECRET!) as any;
        
        const { id, role } = payload;
        const accessToken=jwt.sign({id,role},process.env.JWT_SECRET!,{expiresIn:'15m'});

        res.json({accessToken})
    }catch(err){
        console.error('Refresh token verification failed:', err);
        res.sendStatus(403);
    }
}

//forgot password
export const forgotPassword=async(req:Request,res:Response)=>{
    
    const {email}=req.body;
    
    const userRepo= AppDataSource.getRepository(User);
    const user=await userRepo.findOne({ where: { email } })
    if(!user) return res.status(404).json({message:"User not found"});

    const token=crypto.randomBytes(32).toString('hex');
    user.reset_token=token;
    user.reset_token_expiry=new Date(Date.now()+1000*60*10);
    await userRepo.save(user);

    const resetUrl=`http://localhost:5173/reset-password/${token}`;
    const message = `You requested a password reset. Click the link to reset your password:\n${resetUrl}`;

    await sendMail(user.email,"Reset Your Password",message);

    res.json({message:"Rest link sent to your mail!"});
}

export const resetPassword=async(req:Request,res:Response)=>{
    const {password}=req.body;
    const {token}=req.params;

    const userRepo=AppDataSource.getRepository(User)
    const user=await userRepo.findOne({where:{reset_token:token}});

    if(!user || !user.reset_token_expiry || user.reset_token_expiry<new Date()){
        return res.status(400).json({message:"Invalid or expired token"});
    }
    
    const hashedPassword=await bycript.hash(password,10)
    user.password=hashedPassword;
    user.reset_token=null;
    user.reset_token_expiry=null;

    await userRepo.save(user);
    res.json({message:"Password rest successfully"});
};