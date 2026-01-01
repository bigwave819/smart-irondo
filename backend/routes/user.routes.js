import express from 'express'
import { 
    VerifyActivationCode,
    ActivateAccount,
    login
} from '../controllers/auth.controller.js'

import {
    uploadEvidence,
    downloadEvidence,
    generateReport,
    downloadReport
} from '../controllers/user.controller.js'

import {
    ProtectedRoute
} from '../middlewares/auth.mddleware.js'

const router = express.Router()

/* ================= AUTH ================= */
router.post("/verify-code", VerifyActivationCode);
router.post("/activate", ActivateAccount)
router.post("/login", login);

router.use(ProtectedRoute)
/* ================= ACTIONS IT REQUIRES TO BE AUTHENTICATED ================= */
router.get("/reports/:id/download", downloadReport);
router.get("/evidence/:id/download", downloadEvidence);
router.get("/reports/create", generateReport);
router.get("/evidence/create", uploadEvidence);


export default router