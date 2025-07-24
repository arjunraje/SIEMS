import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";
import { createInvoice, deleteInvoiceById, getInvoiceById, getInvoicePDF, getInvoices, updateInvoiceStatus } from "../controllers/invoice.controller";


const router=Router()

router.post('/',authenticateToken,authorizeRole('Admin','Accountant'),createInvoice);
router.get('/',authenticateToken,authorizeRole('Admin','Accountant'),getInvoices);
router.get('/:id',authenticateToken,authorizeRole('Admin','Accountant','Client'),getInvoiceById);
router.get('/:id/pdf',authenticateToken,authorizeRole('Admin','Accountant','Client'),getInvoicePDF);
router.patch('/:id',authenticateToken,authorizeRole('Admin','Accountant'),updateInvoiceStatus);
router.delete('/:id',authenticateToken,authorizeRole('Accountant','Admin'),deleteInvoiceById);

export default router;