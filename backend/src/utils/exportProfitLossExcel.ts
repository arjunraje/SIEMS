import ExcelJS from 'exceljs';

export const exportProfitLossExcel=async(report:any):Promise<Buffer>=>{
    const workbook=new ExcelJS.Workbook();
    const sheet=workbook.addWorksheet("Profit&Loss");

    sheet.addRow(['Metric','Amount']);
    sheet.addRow(["Total Income",report.totalIncome]);
    sheet.addRow(["Total Expense",report.totalExpense]);
    sheet.addRow(["Net Profit",report.netProfit]);

    const uint8Array=await workbook.xlsx.writeBuffer();
    const buffer = Buffer.from(uint8Array); 
    return buffer;
}