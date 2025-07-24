import { Request,Response } from "express";
import { AppDataSource } from "../config /db";
import { Invoice } from "../entities/Invoice";
import { Expense } from "../entities/Expense";

export const getRevenueExpenseChart=async(req:Request,res:Response)=>{
    try{
        const invoiceRepo=AppDataSource.getRepository(Invoice);
        const expenseRepo=AppDataSource.getRepository(Expense);

        const invoices=await invoiceRepo.find({where:{status:'Paid'}});
        const expenses=await expenseRepo.find();

        const grouped:Record<string,{revenue:number,expense:number}>={};

        for(const inv of invoices){
            const key=inv.created_at.toISOString().slice(0,7);
            grouped[key]=grouped[key]||{revenue:0,expense:0};
            grouped[key].revenue+=inv.total_amount;
        }
        for(const exp of expenses){
            const key=exp.date.toISOString().slice(0,7);
            grouped[key]=grouped[key]||{revenue:0,expense:0};
            grouped[key].expense+=exp.amount;
        }

        const result=Object.entries(grouped).sort(([a],[b])=>a.localeCompare(b)).map(([month,data])=>({month,...data}));

        return res.json(result);
    }catch(err){
        return res.status(500).json({ message: "Failed to load chart data" });
    }
};