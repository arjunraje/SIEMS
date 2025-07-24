import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";
import {getAllClients, getClientInvoices, getClientProfile, updateClientProfile } from "../controllers/client.controllrt";

const router=Router()

router.get('/',authenticateToken,authorizeRole('Accountant','Admin'),getAllClients);
router.get('/my',authenticateToken,authorizeRole('Client'),getClientInvoices);
router.get('/profile',authenticateToken,authorizeRole('Client'),getClientProfile);
router.patch('/my',authenticateToken,authorizeRole('Client'),updateClientProfile);

export default router