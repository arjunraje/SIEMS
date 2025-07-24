import { AppDataSource } from "../config /db"
import { Client } from "../entities/Client"
import { User } from "../entities/User";
import { InvoiceItem } from "../entities/InvoiceItem";
import { Invoice } from "../entities/Invoice";

export const InvoiceService={
    // careate invoicess
    async createInvoice(data:any,creatorId:number){
        const client= await AppDataSource.getRepository(Client).findOneBy({id:data.client_id});
        if(!client) throw new Error('Client not Found');

        const creator=await AppDataSource.getRepository(User).findOneBy({id:creatorId});
        if(!creator) throw new Error('Creator user not Found!');

        const items=data.items.map((item:any)=>{
            const invoiceItem= new InvoiceItem();
            invoiceItem.description=item.description;
            invoiceItem.unit_price=item.unit_price;
            invoiceItem.quantity=item.quantity;
            invoiceItem.tax_percent=item.tax_percent || 0;
            return invoiceItem;
        });

        const total = items.reduce((sum,item)=>{
            const itemTotal=item.unit_price * item.quantity;
            const tax=(item.tax_percent/100)*itemTotal;
            return sum+itemTotal+tax;
        },0);

        const invoice=new Invoice();
        invoice.invoice_number=`INV-${Date.now()}`;
        invoice.client=client;
        invoice.created_by=creator;
        invoice.due_date=data.due_date;
        invoice.status='Pending';
        invoice.total_amount=total;
        invoice.tax=items.reduce((t,i)=>t+(i.unit_price * i.quantity * i.tax_percent/100),0);
        invoice.items=items;

        return await AppDataSource.getRepository(Invoice).save(invoice);
    },

    // list all invoices
    async getAllInvoice(){
        return await AppDataSource.getRepository(Invoice).find({
            relations:{
                client:{user:true},
                items:true,
                created_by:true,
            },
            order:{
                created_at:'DESC',
            },
        });
    },

    // return invoice by id
    async getInvoiceById(id:number){
        const invoice= await AppDataSource.getRepository(Invoice).findOne({
            where:{id},
            relations:{
                client:{user:true},
                items:true,
                created_by:true,
        
            },
        });

        if(!invoice){
            throw new Error("Invoice not found");
        }
        return invoice;
    },

    // update status of invoice
    async updateInvoiceStatus(id:number,status:'Pending'|'Paid'|'Overdue'){
        const invoiceRepo = AppDataSource.getRepository(Invoice);
        const invoice=await invoiceRepo.findOneBy({id})

        if(!invoice) throw new Error('Invoice not found');

        invoice.status=status;
        //invoice.updated_at=new Date();

        await invoiceRepo.save(invoice);
        return invoice
    }
};

export const deleteInvoice=async (id:number,user: Pick<User, "id" | "role">)=>{
    const repo =AppDataSource.getRepository(Invoice);
    const invoice=await repo.findOne({
        where:{id},
        relations:['created_by'],
    });

    if(!invoice){
        throw new Error('invoice is not found');
    }
    
    const isAdmin=user.role==='Admin';
    const isOwner=invoice.created_by.id===user.id;

    if(!isAdmin && !isOwner){
        console.log('Not authorized');
        throw new Error('Not authorized to delete the expense');
        
    }
    await repo.remove(invoice);
}