import { Request,Response } from "express";
import { Expense } from "../entities/Expense";
import { deleteExpense, ExpenseService, getExpenseById, getExpenses, updateExpense } from "../services/expense.service";


export const createExpense=async(req:Request,res:Response)=>{
    try{
        const {amount,category,note,date}=req.body;
        const file=req.file;
        
        if(!amount || !category || !date){
            return res.status(400).json({message:'Amount,category,and date are required!'});
        }
        const expense=await ExpenseService.createExpense({
            amount:parseFloat(amount),
            category,
            note,
            date,
            receipt_url:file? `/uploads/receipts/${file.filename}` : undefined,
            user_id:req.user!.id,
        });
        res.status(201).json({message:'Expense added',expense});
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

//get All expensess
export const getAllExpenses=async (req:Request,res:Response)=>{
    try{
        const expenses=await getExpenses(req.query);
        res.json(expenses);
    }catch(err){
       res.status(500).json({message:err.message});
    }
};

export const getExpenseByID=async(req:Request,res:Response)=>{
    try{
        const invoiceId=Number(req.params.id);
        const invoice= await getExpenseById(invoiceId);
        res.json(invoice);
    }catch(err:any){
        res.status(404).json({message:err.message});
    }
};
//update expense
export const updateExpenseById=async(req:Request,res:Response)=>{
    try{
        const update=await updateExpense(Number(req.params.id),req.body,req.user!);
        res.json({message:'Updated expense',update})
    }catch(err){
        res.status(403).json({message:err});
    }
};

//delte expense
export const deleteExpenseById=async(req:Request,res:Response)=>{
    try{
        await deleteExpense(Number(req.params.id),req.user!);
        res.json({message:'Expense delete'});
    }catch(err){
        res.status(403).json({message:err.message});
    }
};
