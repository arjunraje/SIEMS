import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Invoice } from "./Invoice";

@Entity()
export class Reminder{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Invoice,(invoice)=>invoice.reminders,{onDelete:'CASCADE'})
    invoice:Invoice;

    @Column()
    reminderDate:Date;

    @Column({default:'Sent'})
    status:string;

    @CreateDateColumn()
    created_at:Date;
}