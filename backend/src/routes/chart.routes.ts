import { Router } from "express";
import { getRevenueExpenseChart } from "../controllers/chart.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";

const router=Router()

router.get('/revenue-expense',authenticateToken,authorizeRole('Accountant','Admin'),getRevenueExpenseChart);

export default  router;