import express from 'express'
import { 
    VerifyActivationCode,
    ActivateAccount,
    login
} from '../controllers/auth.controller.js'

const router = express.Router()


router.post("/verify-code", VerifyActivationCode);
router.post("/activate", ActivateAccount)

router.post("/login", login);

export default router