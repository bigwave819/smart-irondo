import express from 'express'
import {
    createdByAdmin,
    updateTheEvidenceStatus,
    deactivateTheUser,
    getAllEvidences,
    getAllReports,
    getAllAbanyerondo,
    getDashboardStats,
    getMonthlyTrends,
    getRecentActivity,
    getCriticalAlerts
} from '../controllers/admin.controller.js'
import {
    ProtectedRoute,
    adminOnly
} from '../middlewares/auth.mddleware.js'

const router = express.Router()

router.use(ProtectedRoute, adminOnly)

router.post('/create', createdByAdmin);
router.get('/users', getAllAbanyerondo);
router.patch("/evidence/:id/status",updateTheEvidenceStatus);
router.patch("/users/:id/deactivate", deactivateTheUser);
router.get("/evidence", getAllEvidences);
router.get("/reports", getAllReports);
router.get('/stats', getDashboardStats);

// @route   GET /api/dashboard/trends
// @desc    Get monthly trends for reports and evidence
// @access  Private (Admin)
router.get('/trends', getMonthlyTrends);

// @route   GET /api/dashboard/alerts
// @desc    Get critical alerts (pending reports, inactive users)
// @access  Private (Admin)
router.get('/alerts', getCriticalAlerts);

export default router