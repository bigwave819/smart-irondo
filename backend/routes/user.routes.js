import express from 'express'
import { 
    createdByAdmin,
    VerifyActivationCode,
    ActivateAccount,
    login
} from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/create/', createdByAdmin);


router.post("/verify-code", VerifyActivationCode);
router.post("/activate", ActivateAccount)

router.post("/login", login);

export default router