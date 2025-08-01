import nodemailer from 'nodemailer';
import { Invoice } from '../entities/Invoice';
import { generateInvoicePDFBuffer } from './generateInvoicePDFBuffer';
import fs from 'fs';
import path from 'path';

export const sendReminderEmail=async (invoice:Invoice,recipientEmail:string)=>{
    const transporter=nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        },
    });

    const pdfBuffer = await generateInvoicePDFBuffer(invoice);
    await  transporter.sendMail({
        from:`"SIEMS" <${process.env.EMAIL_USER}>`,
        to:recipientEmail,
        subject:`Invoice Reminder: Invoice #${invoice.id} is Due soon`,
        text:`Hello, your invoice is due on ${invoice.due_date}.Please make payment befor due date to avoid over due!`,
        attachments:[
            {
                filename:`invoice-${invoice.invoice_number}.pdf`,
                content:pdfBuffer,
                contentType:'application/pdf',
            },
        ],
    });
};



export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  
) => {

  const transporter = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        },
    });

  await transporter.sendMail({
    from: `"SIEMS" <${process.env.EMAIL_USER}>`, 
    to,
    subject,
    text,
    
  });
};

