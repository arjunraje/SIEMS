import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";
import { exportProfitLossExcelController, exportProfitLossPDFController, getAccountantDashBoard, getAdminDashboard, getClientDashBoard, getProfitLossReport, getTaxSummaryByMonth } from "../controllers/report.controller";

const router=Router();

router.get('/profit-loss',authenticateToken,authorizeRole('Accountant','Admin'),getProfitLossReport);
router.get('/profit-loss/pdf',authenticateToken,authorizeRole('Accountant','Admin'),exportProfitLossPDFController);
router.get('/profit-loss/excel',authenticateToken,authorizeRole('Accountant','Admin'),exportProfitLossExcelController);
router.get('/tax-summary',authenticateToken,authorizeRole('Accountant','Admin'),getTaxSummaryByMonth);
router.get('/admin-dashboard',authenticateToken,authorizeRole('Admin'),getAdminDashboard);
router.get('/accountant-dash',authenticateToken,authorizeRole('Accountant'),getAccountantDashBoard);
router.get('/client-dash',authenticateToken,authorizeRole('Client'),getClientDashBoard);

export default router;