import { Between, Like } from "typeorm";
import { AppDataSource } from "../config /db"
import { Expense } from "../entities/Expense";
import { Invoice } from "../entities/Invoice"
import { User } from "../entities/User";
import { Client } from "../entities/Client";

export const getProfitLossData=async(month?:string,clientId?:string,category?:string)=>{
    const invoiceRepo= AppDataSource.getRepository(Invoice);
    const expenseRepo= AppDataSource.getRepository(Expense);
    const clientRepo=AppDataSource.getRepository(Client);

    const invoiceWhere:any={status:'Paid'};
    const expenseWhere:any={};

    if(month){
        const [year,m]=month.split('-');
        const start=new Date(`${year}-${m}-01`);
        const end=new Date(start);
        end.setMonth(end.getMonth()+1); 
        invoiceWhere.created_at=Between(start,end);
        expenseWhere.date=Between(start,end);
    }

    if(clientId){
        const client= await clientRepo.findOne({where:{id:Number(clientId)}})
        console.log(client);
        if(!client) throw new Error('Invalid cliend')
        invoiceWhere.client={id:Number(clientId)};
        console.log(invoiceWhere);
    }

    if(category){
        expenseWhere.category=Like(category);

    }

    const invoices=await invoiceRepo.find({where:invoiceWhere});
    const expenses=await expenseRepo.find({where:expenseWhere});

    const totalIncome=invoices.reduce((sum,inv)=>sum+inv.total_amount,0);
    const totalExpense=expenses.reduce((sum,exp)=>sum+parseFloat(String(exp.amount)),0);

    return{
        totalIncome,
        totalExpense,
        netProfit:totalIncome-totalExpense,
        breakdown:{
            invoices,
            expenses,
        },
    };
};

export const generateTaxSummaryByMonth=(invoices:Invoice[])=>{
    const summary:Record<string,number>={};
        for(const invoice of invoices){
            const key=invoice.created_at.toISOString().slice(0,7);
            summary[key]=(summary[key]||0)+invoice.tax;
        }
        return Object.entries(summary).sort(([a],[b])=> a.localeCompare(b)).map(([month,total_tax])=>({month,total_tax}));
};

export const getAdminDashboardService=async()=>{
    const userRepo=AppDataSource.getRepository(User);
    const invoiceRepo=AppDataSource.getRepository(Invoice);
    const expenseRepo=AppDataSource.getRepository(Expense);

    const [totalClients,totalInvoices,paidInvoices,unpaidInvoices]=await Promise.all([
        userRepo.count({where:{role:'Client'}}),
        invoiceRepo.count(),
        invoiceRepo.count({where:{status:'Paid'}}),
        invoiceRepo.count({where:{status:'Pending'}}),
    ])

    const invoices=await invoiceRepo.find({where:{status:'Paid'}});
    const expenses=await expenseRepo.find();

    const totalRevenue=invoices.reduce((sum,inv)=>sum+inv.total_amount,0);
    const totalExpense=expenses.reduce((sum,exp)=>sum+exp.amount,0);
    const profit=totalRevenue-totalExpense;
    const grouped:Record<string,{revenue:number,expense:number}>={}

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

    const monthlyTaxSummary=generateTaxSummaryByMonth(invoices);
    const monthlyRevenueVsExpense=Object.entries(grouped).sort(([a],[b])=>a.localeCompare(b)).map(([month,data])=>({month,...data}));
    return {
        totalClients,
        totalInvoices,
        paidInvoices,
        unpaidInvoices,
        totalRevenue,
        totalExpense,
        profit,
        monthlyRevenueVsExpense,
        monthlyTaxSummary,
    };
};

//client dashboaard
export const getClientDashboardService=async(clientId:number)=>{
    try{
        
        const invoiceRepo=AppDataSource.getRepository(Invoice)
        const invoices=await invoiceRepo.find({
            where:{client:{id:clientId}},
            order:{created_at:'ASC'},
        })

        const totalInvoices=invoices.length;
        const paidInvoices=invoices.filter(inv=>inv.status==='Paid');
        const unpaidInvoices=invoices.filter(inv=>inv.status!=='Paid');
        
        const totalPaidAmount=paidInvoices.reduce((sum,inv)=>sum+inv.total_amount,0);
        const totalDueAmount=unpaidInvoices.reduce((sum,inv)=>sum+inv.total_amount,0);

        const monthly:Record<string,number>={}

        for(const inv of invoices){
            const month=inv.created_at.toISOString().slice(0,7);
            monthly[month]=(monthly[month]||0)+inv.total_amount;
        }
        const monthlyData=Object.entries(monthly).map(([month,expense])=>({month,expense}));

        return{
            totalInvoices,
            paidCount:paidInvoices.length,
            unpaidCount:unpaidInvoices.length,
            totalPaidAmount,
            totalDueAmount,
            monthlyData,
        };
    }catch(err){
        console.log(err);
    }
}