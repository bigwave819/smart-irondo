import express from 'express'
import {
    createdByAdmin,
    updateTheEvidenceStatus,
    deactivateTheUser
} from '../controllers/admin.controller.js'
import {
    ProtectedRoute,
    adminOnly
} from '../middlewares/auth.mddleware.js'

const router = express.Router()

router.use(ProtectedRoute, adminOnly)

router.post('/create', createdByAdmin);
router.get('/users', createdByAdmin);
router.patch("/evidence/:id/status",updateTheEvidenceStatus);
router.patch("/users/:id/deactivate", deactivateTheUser);

export default router