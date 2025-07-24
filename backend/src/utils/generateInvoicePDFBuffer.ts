import ejs from 'ejs';
import puppeteer from 'puppeteer';
import path from 'path';
import { Invoice } from '../entities/Invoice';

export const generateInvoicePDFBuffer=async (invoice:Invoice):Promise<Buffer>=>{
    const filePath=path.join(__dirname,'../views/invoice-template.ejs');
    const html=await ejs.renderFile(filePath,{invoice});

    const browser = await puppeteer.launch({ headless: true }); // Headless mode
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();
    return Buffer.from(pdfBuffer);
}