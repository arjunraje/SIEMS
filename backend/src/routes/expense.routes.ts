import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/role.middleware";
import { upload } from "../middlewares/multer";
import { createExpense, deleteExpenseById, getAllExpenses, getExpenseByID, updateExpenseById } from "../controllers/expense.controller";

const router=Router()

router.post('/',authenticateToken,authorizeRole('Accountant','Admin'),upload.single('receipt'),createExpense);
router.get('/',authenticateToken,authorizeRole('Accountant','Admin'),getAllExpenses);
router.get('/:id',authenticateToken,authorizeRole('Accountant','Admin'),getExpenseByID);
router.put('/:id',authenticateToken,authorizeRole('Accountant','Admin'),upload.single('receipt'),updateExpenseById);
router.delete('/:id',authenticateToken,authorizeRole('Accountant','Admin'),deleteExpenseById);

export default router;