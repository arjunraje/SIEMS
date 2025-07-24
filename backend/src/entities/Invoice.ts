import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Client } from "./Client";
import { User } from "./User";
import { InvoiceItem } from "./InvoiceItem";
import { Reminder } from "./Reminder";

export type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  invoice_number: string;

  @ManyToOne(() => Client, { eager: true })
  client: Client;

  @ManyToOne(() => User, { eager: true })
  created_by: User;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, {
    cascade: true,
    eager: true,
  })
  items: InvoiceItem[];

  @Column('float', { default: 0 })
  tax: number;

  @Column('float', { default: 0 })
  total_amount: number;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Paid', 'Overdue'],
    default: 'Pending',
  })
  status: InvoiceStatus;

  @OneToMany(() => Reminder, (reminder) => reminder.invoice)
  reminders: Reminder[];

  @Column({ type: 'date' })
  due_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
