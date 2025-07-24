import { Request,Response } from "express";
import { generateTaxSummaryByMonth, getAdminDashboardService, getClientDashboardService, getProfitLossData } from "../services/report.service";
import { exportProfitLossPDF } from "../utils/exportProfitLossPDF";
import { exportProfitLossExcel } from "../utils/exportProfitLossExcel";
import { AppDataSource } from "../config /db";
import { Invoice } from "../entities/Invoice";

export const getProfitLossReport=async(req:Request,res:Response)=>{
    try{
        const {month,clientId,category}=req.query;
        const data= await getProfitLossData(month as string,clientId as string,category as string);
        if(!data) throw new Error('No data found');
        res.json(data);
    }catch(err){
        res.status(500).json({message:'Faild to load',error:err.message});
    }
};

export const exportProfitLossPDFController=async(req:Request,res:Response)=>{
    try{
        const {month,clientId,category}=req.query;
        const report =await getProfitLossData(month as string,clientId as string, category as string);
        
        const buffer=await exportProfitLossPDF({
            ...report,
            month,
            category,
            clientName:clientId || null,
        });
        res.set({
            "Content-Type":"application/pdf",
            "Content-Disposition":`attachment; filename=profite-loss-${Date.now()}.pdf`,
        })
        return res.send(buffer);
    }catch(err:any){
        res.status(500).json({message:"Failed to export PDF"});
    }
};

export const exportProfitLossExcelController=async(req:Request,res:Response)=>{
    try{
        const {month,clientId,category}=req.query;
        const report =await getProfitLossData(month as string,clientId as string, category as string);
        
        const buffer=await exportProfitLossExcel(report);

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=profit-loss-${Date.now()}.xlsx`);
        return res.send(buffer);
    }catch(err:any){
        return res.status(500).json({ message: "Failed to export Excel" });
    }
};

//month tax total
export const getTaxSummaryByMonth=async(req:Request,res:Response)=>{
    try{
        const invoices=await AppDataSource.getRepository(Invoice).find({where:{status:'Paid'}});
        const result=generateTaxSummaryByMonth(invoices);
        return res.json(result);
    }catch(err){
        return res.status(500).json({message:'Faild to generate tax summary'});
    }
};

//admin dashboard
export const getAdminDashboard=async(req:Request,res:Response)=>{
    try{
        const result =await getAdminDashboardService();
        return res.json(result);
    }catch(err){
        return res.status(500).json({message:"Faild to load admin dashboard"});
    }
};

interface MonthlyRevenueExpense {
  month: string;      // e.g. "2025-07"
  revenue: number;
  expense: number;
}
interface Report{
    totalRevenue :number;
    totalExpense:number;
    profit:number;
    monthlyRevenueVsExpense:MonthlyRevenueExpense[];
    monthlyTaxSummary;
}

//admin dashboard
export const getAccountantDashBoard=async(req:Request,res:Response)=>{
    try{
        const {totalRevenue,totalExpense,monthlyRevenueVsExpense}=await getAdminDashboardService();
        const invoices=await AppDataSource.getRepository(Invoice).find({where:{status:'Paid'}});
        const monthlyTaxSummary=generateTaxSummaryByMonth(invoices);
        const profit=totalRevenue-totalExpense;

        const report={
            totalRevenue,
            totalExpense,
            profit,
            monthlyRevenueVsExpense,
            monthlyTaxSummary
        }
        res.json(report);
    }catch(err){
        res.status(500).json({message:'Faild to load Accountant dashboard'});
    }
}

//get client dashboard
export const getClientDashBoard=async(req:Request,res:Response)=>{
    try{
        const clientId=req.user?.id;
        const result=await getClientDashboardService(clientId);
        return res.json(result);

    }catch(err:any){
        return res.status(500).json({message:err.message});
    }
};