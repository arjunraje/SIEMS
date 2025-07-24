import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';

export const authenticateToken=(req:Request,res:Response,next:NextFunction)=>{
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).json({message:'Access Token missing!'});

    try{
        const payload=jwt.verify(token,process.env.JWT_SECRET!) as any;
        req.user={id:payload.id,role:payload.role};
        next();
    }catch(err){
        return res.status(403).json({message:'Invalid or Expired Token'});
    }
};