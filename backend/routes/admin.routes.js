import express from 'express'
import {
    createdByAdmin,
    updateTheEvidenceStatus,
    deactivateTheUser
} from '../controllers/admin.controller.js'

const router = express.Router()

router.post('/create/', createdByAdmin);

router.patch(
    "/evidence/:id/status",
    updateTheEvidenceStatus
);

router.patch(
    "/users/:id/deactivate",
    deactivateTheUser
);

export default router