import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Expense{
    @PrimaryGeneratedColumn()
    id:number;

    @Column('float',{default:0})
    amount:number;

    @Column()
    category:string

    @Column({nullable:true})
    note:string

    @Column()
    date:Date;

    @Column()
    receipt_url:string;

    @CreateDateColumn()
    created_at:Date;

    @ManyToOne(()=>User)
    created_by:User;
}