import { Request,Response,NextFunction } from "express";

export const authorizeRole=(...roles:('Admin'|'Accountant'|'Client')[])=>{
    return(req:Request,res:Response,next:NextFunction)=>{
        if(!req.user|| !roles.includes(req.user.role)){
            return res.status(403).json({message: 'Forbidden: insufficient role'});
        }
        next();
    };
};