import { Router } from "express";

import { forgotPassword, login,refreshToken,register, resetPassword ,} from "../controllers/auth.controller";

const router=Router()

router.post('/register',register);
router.post('/login',login);
router.get('/refresh',refreshToken);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password/:token',resetPassword);

export default router;