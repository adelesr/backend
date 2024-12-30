//מכווינה את הראוטים לפעולות ומפצלת לסוגי בקשות - מה יקרה כשהמשתמש יכניס את הראוט הזה
import {Router} from 'express';
import { signUp,LogIn,verifyToken} from '../controllers/userController.js';
import {sendCodeToMail,checkVerifyCode} from '../controllers/emailDealingController.js';
const router = Router();

router.route('/signup').post(signUp);
router.route('/login').post(LogIn);
router.route('/verifyLogin').post(verifyToken);
router.route('/loginByEmail').post(sendCodeToMail);
router.route('/verifyEnteryCode').post(checkVerifyCode);
// router.route('/loginByPhone').post(sendCodeToPhone);
export default router;