import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();
import { User } from '../entities/User';
import { Client } from '../entities/Client';
import { Invoice } from '../entities/Invoice';
import { InvoiceItem } from '../entities/InvoiceItem';
import { Expense } from '../entities/Expense';
import { Reminder } from '../entities/Reminder';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize:true, // false in production
  logging:false,
  entities: [User,Client,Invoice,InvoiceItem,Expense,Reminder],
});

