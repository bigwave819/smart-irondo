import express from 'express'
import {
    createdByAdmin,
    updateTheEvidenceStatus,
    deactivateTheUser,
    getAllEvidences,
    getAllReports,
    getAllAbanyerondo
} from '../controllers/admin.controller.js'
import {
    ProtectedRoute,
    adminOnly
} from '../middlewares/auth.mddleware.js'

const router = express.Router()

// router.use(ProtectedRoute, adminOnly)

router.post('/create', createdByAdmin);
router.get('/users', getAllAbanyerondo);
router.patch("/evidence/:id/status",updateTheEvidenceStatus);
router.patch("/users/:id/deactivate", deactivateTheUser);
router.get("/evidence", getAllEvidences);
router.get("/reports", getAllReports);

export default router