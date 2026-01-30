import { desc, eq, sql, and, gte, count } from "drizzle-orm"
import { evidence, reports } from "../db/schema.js";
import { user } from "../db/schema.js";
import { db } from '../db/conn.js'
import crypto from 'crypto'

export const createdByAdmin = async (req, res) => {
  try {
    const { fullName, phone, location } = req.body;

    if (
      !fullName ||
      !phone ||
      !location?.district ||
      !location?.sector ||
      !location?.cell ||
      !location?.village
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.phone, phone))
      .limit(1);


    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const activationCode = crypto.randomInt(100000, 999999).toString();

    await db.insert(user).values({
      fullName,
      phone,
      role: "user",
      isActive: false,
      activationCode,
      location,
    });

    // TODO: send activationCode via SMS

    res.status(201).json({
      message: "User created. Activation code sent.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateTheEvidenceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // 1. Find evidence
        const foundEvidence = await db.query.evidence.findFirst({
            where: eq(evidence.id, Number(id)),
        });

        if (!foundEvidence) {
            return res.status(404).json({ message: "No such evidence found" });
        }

        await db
            .update(evidence)
            .set({ status })
            .where(eq(evidence.id, Number(id)));

        return res.json({
            message: "Evidence status updated successfully",
        });


    } catch (error) {
        res.status(500).json({ message: `the server error due ${error}` })
    }
}

export const deactivateTheUser = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Find user
        const users = await db.query.user.findFirst({
            where: eq(user.id, Number(id)),
        });

        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }

        await db
            .update(user)
            .set({ isActive: false })
            .where(eq(user.id, Number(id)));

        return res.json({
            message: "User deactivated successfully",
        });

    } catch (error) {
        res.status(500).json({ message: `the server error due ${error}` })
    }
}

export const getAllAbanyerondo = async (_, res) => {
    try {
        const users = await db.select().from(user)

        if (users.length === 0) {
            return res.status(404).json({ message: "0 users found" })
        }

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: `the server error due ${error}` })
    }
}

export const getAllReports = async (_, res) => {
    try {
        const data = await db
                            .select()
                            .from(reports)
                            .orderBy(desc(reports.createdAt))

        return res.status(200).json({
            message: "Reports retrieved successfully",
            total: data.length,
            reports: data,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch reports",
            error: error.message,
        });
    }
}

export const getAllEvidences = async (_, res) => {
    try {
        const data = await db
                            .select({
                                reportId: evidence.reportId,
                                uploadedBy: evidence.uploadedBy,
                                uploaderName: user.fullName,
                                type: evidence.type,
                                createdAt: evidence.createdAt,
                                url: evidence.url
                            })
                            .from(evidence)
                            .leftJoin(user, eq(evidence.uploadedBy, user.id))
                            .orderBy(desc(evidence.createdAt))
        return res.status(200).json({
            message: "Evidence retrieved successfully",
            total: data.length,
            evidence: data,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch reports",
            error: error.message,
        });
    }
}

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Get total users count
    const totalUsersResult = await db
      .select({ count: count() })
      .from(user);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // 2. Get active users count
    const activeUsersResult = await db
      .select({ count: count() })
      .from(user)
      .where(eq(user.isActive, true));
    const activeUsers = activeUsersResult[0]?.count || 0;

    // 3. Get inactive users count
    const inactiveUsers = totalUsers - activeUsers;

    // 4. Get total reports count
    const totalReportsResult = await db
      .select({ count: count() })
      .from(reports);
    const totalReports = totalReportsResult[0]?.count || 0;

    // 5. Get reports by status
    const reportsByStatus = await db
      .select({
        status: reports.status,
        count: count(),
      })
      .from(reports)
      .groupBy(reports.status);

    // 6. Get total evidence count
    const totalEvidenceResult = await db
      .select({ count: count() })
      .from(evidence);
    const totalEvidence = totalEvidenceResult[0]?.count || 0;

    // 7. Get evidence by type
    const evidenceByType = await db
      .select({
        type: evidence.type,
        count: count(),
      })
      .from(evidence)
      .groupBy(evidence.type);

    // 8. Get reports by incident type
    const reportsByIncidentType = await db
      .select({
        incidentType: reports.incidentType,
        count: count(),
      })
      .from(reports)
      .groupBy(reports.incidentType);

    // 9. Get recent reports (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentReportsResult = await db
      .select({ count: count() })
      .from(reports)
      .where(gte(reports.createdAt, sevenDaysAgo));
    const recentReports = recentReportsResult[0]?.count || 0;

    // 10. Get recent evidence (last 7 days)
    const recentEvidenceResult = await db
      .select({ count: count() })
      .from(evidence)
      .where(gte(evidence.createdAt, sevenDaysAgo));
    const recentEvidence = recentEvidenceResult[0]?.count || 0;

    // 11. Get reports by location (district)
    const reportsByLocation = await db
      .select({
        district: sql`location->>'district'`,
        count: count(),
      })
      .from(reports)
      .groupBy(sql`location->>'district'`)
      .orderBy(sql`count(*) DESC`)
      .limit(10);

    // // 12. Get recent notifications count
    // const recentNotificationsResult = await db
    //   .select({ count: count() })
    //   .from(notifications)
    //   .where(gte(notifications.createdAt, sevenDaysAgo));
    // const recentNotifications = recentNotificationsResult[0]?.count || 0;

    // 13. Get users by role
    const usersByRole = await db
      .select({
        role: user.role,
        count: count(),
      })
      .from(user)
      .groupBy(user.role);

    // 14. Calculate percentages
    const activeUserPercentage = totalUsers > 0 
      ? ((activeUsers / totalUsers) * 100).toFixed(1) 
      : 0;

    // Construct response
    const dashboardData = {
      overview: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        activeUserPercentage: parseFloat(activeUserPercentage),
        totalReports,
        totalEvidence,
        recentReports,
        recentEvidence,
        // recentNotifications,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        byRole: usersByRole.map(item => ({
          role: item.role,
          count: Number(item.count),
        })),
      },
      reports: {
        total: totalReports,
        recent: recentReports,
        byStatus: reportsByStatus.map(item => ({
          status: item.status,
          count: Number(item.count),
        })),
        byIncidentType: reportsByIncidentType.map(item => ({
          incidentType: item.incidentType,
          count: Number(item.count),
        })),
        byLocation: reportsByLocation.map(item => ({
          district: item.district,
          count: Number(item.count),
        })),
      },
      evidence: {
        total: totalEvidence,
        recent: recentEvidence,
        byType: evidenceByType.map(item => ({
          type: item.type,
          count: Number(item.count),
        })),
      },
    };

    return res.status(200).json({
      message: "Dashboard statistics retrieved successfully",
      data: dashboardData,
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

/**
 * Get monthly trends for reports and evidence
 * Returns data for the last 12 months
 */
export const getMonthlyTrends = async (req, res) => {
  try {
    // Get reports grouped by month
    const reportsTrend = await db
      .select({
        month: sql`TO_CHAR(created_at, 'YYYY-MM')`,
        count: count(),
      })
      .from(reports)
      .where(gte(reports.createdAt, sql`NOW() - INTERVAL '12 months'`))
      .groupBy(sql`TO_CHAR(created_at, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(created_at, 'YYYY-MM')`);

    // Get evidence grouped by month
    const evidenceTrend = await db
      .select({
        month: sql`TO_CHAR(created_at, 'YYYY-MM')`,
        count: count(),
      })
      .from(evidence)
      .where(gte(evidence.createdAt, sql`NOW() - INTERVAL '12 months'`))
      .groupBy(sql`TO_CHAR(created_at, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(created_at, 'YYYY-MM')`);

    return res.status(200).json({
      message: "Monthly trends retrieved successfully",
      data: {
        reports: reportsTrend.map(item => ({
          month: item.month,
          count: Number(item.count),
        })),
        evidence: evidenceTrend.map(item => ({
          month: item.month,
          count: Number(item.count),
        })),
      },
    });

  } catch (error) {
    console.error("Monthly trends error:", error);
    return res.status(500).json({
      message: "Failed to fetch monthly trends",
      error: error.message,
    });
  }
};

/**
 * Get recent activity (latest reports and evidence)
 */
export const getRecentActivity = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get recent reports with user info
    const recentReports = await db
      .select({
        id: reports.id,
        title: reports.title,
        status: reports.status,
        incidentType: reports.incidentType,
        reportedBy: user.fullName,
        createdAt: reports.createdAt,
        type: sql`'report'`,
      })
      .from(reports)
      .leftJoin(user, eq(reports.reportedBy, user.id))
      .orderBy(sql`${reports.createdAt} DESC`)
      .limit(Number(limit));

    // Get recent evidence with user info
    const recentEvidence = await db
      .select({
        id: evidence.id,
        type: evidence.type,
        reportId: evidence.reportId,
        uploadedBy: user.fullName,
        createdAt: evidence.createdAt,
        activityType: sql`'evidence'`,
      })
      .from(evidence)
      .leftJoin(user, eq(evidence.uploadedBy, user.id))
      .orderBy(sql`${evidence.createdAt} DESC`)
      .limit(Number(limit));

    return res.status(200).json({
      message: "Recent activity retrieved successfully",
      data: {
        recentReports,
        recentEvidence,
      },
    });

  } catch (error) {
    console.error("Recent activity error:", error);
    return res.status(500).json({
      message: "Failed to fetch recent activity",
      error: error.message,
    });
  }
};

/**
 * Get critical alerts (pending reports, inactive users awaiting activation)
 */
export const getCriticalAlerts = async (req, res) => {
  try {
    // Get pending/submitted reports count
    const pendingReportsResult = await db
      .select({ count: count() })
      .from(reports)
      .where(eq(reports.status, "Submitted"));
    const pendingReports = pendingReportsResult[0]?.count || 0;

    // Get users awaiting activation
    const awaitingActivationResult = await db
      .select({ count: count() })
      .from(user)
      .where(eq(user.isActive, false));
    const awaitingActivation = awaitingActivationResult[0]?.count || 0;

    return res.status(200).json({
      message: "Critical alerts retrieved successfully",
      data: {
        pendingReports: Number(pendingReports),
        usersAwaitingActivation: Number(awaitingActivation),
      },
    });

  } catch (error) {
    console.error("Critical alerts error:", error);
    return res.status(500).json({
      message: "Failed to fetch critical alerts",
      error: error.message,
    });
  }
};
