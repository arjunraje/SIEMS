import ejs from 'ejs';
import puppeteer from 'puppeteer';
import path from 'path';
import { Request,Response,NextFunction } from "express"
import { deleteInvoice, InvoiceService } from "../services/invoice.service"
import { AppDataSource } from '../config /db';
import { Invoice } from '../entities/Invoice';

//create invoice
export const createInvoice=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        console.log('body:',req.body)
        const invoice=await InvoiceService.createInvoice(req.body,req.user!.id);
        res.status(201).json(invoice);
    }catch(err){
        res.status(400).json({message:err.message});
    }
};

//list all invoice
export const getInvoices=async(req:Request,res:Response)=>{
    try{
        const invoices= await InvoiceService.getAllInvoice();
        res.json(invoices);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

//return inovice by id
export const getInvoiceById=async(req:Request,res:Response)=>{
    try{
        const invoiceId=Number(req.params.id);
        const invoice= await InvoiceService.getInvoiceById(invoiceId);
        res.json(invoice);
    }catch(err:any){
        res.status(404).json({message:err.message});
    }
};

//pdf
export const getInvoicePDF=async(req:Request,res:Response)=>{
    try{
        const id=Number(req.params.id);
        const invoice=await AppDataSource.getRepository(Invoice).findOne({
            where:{id},
            relations:{client:{
                user:true,
            },items:true}
        });

        if(!invoice) return res.status(404).json({message:'Invoice not found'});

        const filePath=path.join(__dirname,'../views/invoice-template.ejs');
        const html=await ejs.renderFile(filePath,{invoice});

        const browser=await puppeteer.launch();
        const page=await browser.newPage();

        await page.setContent(html,{waitUntil:'networkidle0'});
        const pdfBuffer=await page.pdf({format:'A4'});

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename=invoice-${invoice.invoice_number}.pdf`,
            'Content-Length': pdfBuffer.length
        });

        return res.send(pdfBuffer);
    }catch(err:any){
        console.error('PDF Error:', err.message);
        return res.status(500).json({ message: 'Failed to generate PDF' });
    }
};

//update status
export const updateInvoiceStatus=async(req:Request,res:Response)=>{
    try{
        const invoiceId=Number(req.params.id);
        const {status}=req.body;

        if(!['Pending','Paid','Overdue'].includes(status)){
            return res.status(400).json({message:'Invalid status'});
        }
        const updatedInvoice=await InvoiceService.updateInvoiceStatus(invoiceId,status);
        res.json(updatedInvoice);
    }catch(err:any){
        res.status(400).json({message:err.message});
    }
};

export const deleteInvoiceById=async(req:Request,res:Response)=>{
    try{
        console.log('Inide controleer');
        await deleteInvoice(Number(req.params.id),req.user!);
        res.status(200).json({message:'Invoice delete'});
    }catch(err){
        res.status(403).json({message:err.message});
        
    }
};