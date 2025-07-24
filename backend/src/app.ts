import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import invoiceRoutes from './routes/invoice.routes';
import clientRoutes from './routes/client.routes';
import expenseRoutes from './routes/expense.routes';
import reportRoutes from './routes/report.routes';
import chartRoutes from './routes/chart.routes';

dotenv.config();

export const app=express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/api/auth',authRoutes);
app.use('/api/invoices',invoiceRoutes);
app.use('/api/clients',clientRoutes);
app.use('/api/expenses',expenseRoutes);
app.use('/uploads',express.static('uploads'));
app.use('/api/reports',reportRoutes);
app.use('/api/charts',chartRoutes);
app.get('/', (_, res) => res.send('SIEMS API is running'));