import cron from 'node-cron'
import { AppDataSource } from '../config /db'
import { Invoice } from '../entities/Invoice'
import { Reminder } from '../entities/Reminder'
import { sendReminderEmail } from '../utils/sendReminderEmail'

export const startReminderJob=()=>{
    cron.schedule('0 11 * * *',async()=>{
        const invoiceRepo=AppDataSource.getRepository(Invoice);
        const reminderRepo=AppDataSource.getRepository(Reminder);
        const today=new Date();
        
        const REMINDER_BEFORE_DAYS =3;

        const targetDate=new Date();
        targetDate.setHours(0, 0, 0, 0);
        targetDate.setDate(today.getDate()+REMINDER_BEFORE_DAYS);
        
        const upcomingInvoice=await invoiceRepo.find({
            where:{due_date:targetDate,status:'Pending'},
            relations:['client','reminders','client.user'],
        });

        for (const invoice of upcomingInvoice){
            const alreadySent=invoice.reminders?.some(rem=>rem.reminderDate.toDateString()===today.toDateString());

            if(!alreadySent && invoice.client?.user?.email){
                try{
                    await sendReminderEmail(invoice,invoice.client.user.email);

                    const reminder=reminderRepo.create({
                        invoice,
                        reminderDate:today,
                        status:'Sent',
                    });
                    await reminderRepo.save(reminder);
                }catch(err){
                    console.log(`Failed to send reminder for invoice ${invoice.id}`, err);
                }
            }
        }
    });
};