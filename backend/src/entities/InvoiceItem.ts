import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Invoice } from "./Invoice";

@Entity()
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column('float')
  unit_price: number;

  @Column('int')
  quantity: number;

  @Column('float', { default: 0 })
  tax_percent: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.items, {
    onDelete: 'CASCADE',
  })
  invoice: Invoice;
}
