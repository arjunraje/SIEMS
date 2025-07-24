import ejs from 'ejs';
import puppeteer from 'puppeteer';
import path from 'path';

export const exportProfitLossPDF=async (data:any):Promise<Buffer>=>{
    const filePath=path.join(__dirname,"../views/profit-loss-template.ejs");
    const html:string=await ejs.renderFile(filePath,data);

    const browser =await puppeteer.launch({headless:true});
    const page=await browser.newPage();
    await page.setContent(html,{waitUntil:'networkidle0'});

    const pdfBuffer=await page.pdf({format:'A4'});
    await browser.close();

    return Buffer.from(pdfBuffer);
};