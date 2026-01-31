import { db } from "../db/conn.js";
import { evidence, notifications, reports, user } from "../db/schema.js";
import { eq, desc, ne } from "drizzle-orm";
import cloudinary from "../config/cloudinary.js";
import PDFDocument from "pdfkit"
import axios from 'axios'
import fetch from "node-fetch";
import streamifier from "streamifier";

/* ===========================
   CLOUDINARY BUFFER UPLOAD
=========================== */
// Upload a single file to Cloudinary
const uploadToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const resourceType = file.mimetype.startsWith("video") ? "video" : "image";
    const stream = cloudinary.uploader.upload_stream(
      { folder: "evidences", resource_type: resourceType },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });

export const uploadEvidence = async (req, res) => {
  try {
    const { reportId } = req.body;
    const uploadedBy = req.user.id;

    if (!req.file) return res.status(400).json({ message: "Evidence file is required" });

    const reportData = await db.select().from(reports).where(eq(reports.id, Number(reportId))).limit(1);
    const report = reportData[0];
    if (!report) return res.status(404).json({ message: "Report not found" });
    if (report.status === "Resolved")
      return res.status(400).json({ message: "Cannot add evidence to resolved report" });

    const result = await uploadToCloudinary(req.file);

    const savedEvidence = await db.insert(evidence).values({
      reportId: report.id,
      uploadedBy,
      url: result.secure_url,
      type: result.resource_type.slice(0, 10),
    }).returning();

    res.status(201).json({ message: "Evidence uploaded successfully", evidence: savedEvidence });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while uploading evidence", error: err.message });
  }
};

export const generateReport = async (req, res) => {
  try {
    const reportedBy = req.user.id;
    const { reportType, incidentType, title, description, location, reportDate } = req.body;

    if (!reportType || !title || !description || !location || !reportDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // FIX: Ensure location is an object and reportDate is a proper Date object
    const [newReport] = await db
      .insert(reports)
      .values({
        reportedBy,
        reportType,
        incidentType: incidentType || "None",
        title,
        description,
        location, // Drizzle handles JSONB objects automatically
        reportDate: new Date(reportDate), // Convert ISO string to JS Date
        status: (reportType === "Crime" || reportType === "Emergency") ? "Pending" : "Submitted",
      })
      .returning();

    return res.status(201).json({ message: "Report created successfully", report: newReport });
  } catch (error) {
    console.error("🔥 DB Insert Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const downloadReport = async (req, res) => {
  try {
    const { id } = req.params;

    const [report] = await db
      .select()
      .from(reports)
      .where(eq(reports.id, Number(id)))
      .limit(1);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      bufferPages: false,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report-${report.id}.pdf`
    );

    doc.pipe(res);

    /* ========== COLORS (RWANDA STYLE) ========== */
    const colors = {
      primary: "#003A8F",   // Government blue
      text: "#111827",
      muted: "#6B7280",
      border: "#D1D5DB",
    };

    /* ========== HEADER ========== */
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor(colors.primary)
      .text("SMART IRONDO SECURITY SYSTEM", { align: "center" });

    doc
      .fontSize(11)
      .fillColor(colors.text)
      .text("SECURITY INCIDENT REPORT", { align: "center" });

    doc
      .moveDown(0.5)
      .strokeColor(colors.border)
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke();

    /* ========== META INFO ========== */
    let y = doc.y + 15;

    doc.fontSize(10).font("Helvetica");
    doc.text(`Report Number: ${report.id}`, 50, y);
    doc.text(`Date: ${new Date(report.createdAt).toLocaleDateString()}`, 350, y);

    y += 25;

    /* ========== SECTION TITLE HELPER ========== */
    const sectionTitle = (title) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor(colors.primary)
        .text(title, 50, y);
      y += 12;

      doc
        .strokeColor(colors.border)
        .moveTo(50, y)
        .lineTo(doc.page.width - 50, y)
        .stroke();

      y += 10;
    };

    const field = (label, value) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(colors.text)
        .text(label, 50, y);

      doc
        .font("Helvetica")
        .text(value || "N/A", 200, y);

      y += 18;
    };

    /* ========== REPORT DETAILS ========== */
    sectionTitle("1. REPORT DETAILS");

    field("Report Type", report.reportType);
    field("Incident Type", report.incidentType);
    field("Status", report.status);
    field("Title", report.title);

    y += 5;

    /* ========== LOCATION ========== */
    sectionTitle("2. LOCATION INFORMATION");

    field("District", report.location?.district);
    field("Sector", report.location?.sector);
    field("Cell", report.location?.cell);
    field("Village", report.location?.village);

    y += 5;

    /* ========== DESCRIPTION ========== */
    sectionTitle("3. INCIDENT DESCRIPTION");

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(colors.text)
      .text(report.description || "No description provided.", 50, y, {
        width: doc.page.width - 100,
        align: "justify",
      });

    y = doc.y + 10;

    /* ========== REPORTER ========== */
    sectionTitle("4. REPORTER INFORMATION");

    field("Full Name", report.reportedBy?.fullName || "Anonymous");
    field("Phone Number", report.reportedBy?.phone);

    /* ========== FOOTER ========== */
    doc
      .strokeColor(colors.border)
      .moveTo(50, doc.page.height - 90)
      .lineTo(doc.page.width - 50, doc.page.height - 90)
      .stroke();

    doc
      .fontSize(8)
      .fillColor(colors.muted)
      .text(
        "This document is officially generated by Smart Irondo Security System.",
        50,
        doc.page.height - 75,
        { align: "center", width: doc.page.width - 100 }
      );

    doc
      .fontSize(8)
      .text(
        "© 2025 Smart Irondo Security System | Republic of Rwanda",
        50,
        doc.page.height - 60,
        { align: "center", width: doc.page.width - 100 }
      );

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};

export const downloadEvidence = async (req, res) => {
  try {
    const { id } = req.params;

    const [file] = await db
      .select()
      .from(reports)
      .where(eq(evidence.id, Number(id)))
      .limit(1)

    if (!file) {
      return res.status(404).json({ message: "Evidence not found" });
    }

    const response = await axios({
      method: "GET",
      url: file.url,
      responseType: "stream",
    });

    es.setHeader(
      "Content-Disposition",
      `attachment; filename=evidence-${file.id}.${fileType}`
    );
    res.setHeader("Content-Type", response.headers["content-type"]);

    response.data.pipe(res);

  } catch (error) {
    res.status(500).json({
      message: "Failed to download evidence",
      error: error.message,
    });
  }
}

export const getReportsUploadedByCertainUser = async (req, res) => {
  try {

    const userReports = await db
      .select()
      .from(reports)
      .orderBy(desc(reports.createdAt));

    return res.status(200).json({
      message: "Reports retrieved successfully",
      total: userReports.length,
      reports: userReports,
    });
  } catch (error) {
    console.error("Error fetching user reports:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getEvidenceUploadedByCertainUser = async (req, res) => {
  try {
    const userEvidence = await db
      .select({
        evidenceId: evidence.id,
        reportId: evidence.reportId,
        evidenceUrl: evidence.url,
        evidenceType: evidence.type,
        uploadedAt: evidence.createdAt,
        reportTitle: reports.title,
        reportType: reports.reportType,
        userName: user.fullName,
        userPhone: user.phone,
        type: evidence.type
      })
      .from(evidence)
      .leftJoin(reports, eq(evidence.reportId, reports.id))
      .leftJoin(user, eq(evidence.uploadedBy, user.id))
      .orderBy(desc(evidence.createdAt));

    res.status(200).json(userEvidence);
  } catch (error) {
    console.error('Error fetching user Evidence:', error);
    res.status(500).json({ message: 'Failed to fetch user evidence', error: error.message });
  }
};

export const sendSupportNotifications = async (req, res) => {
  try {
    const senderId = req.user.id
    const { message } = req.body

    if (!senderId) {
      return res.status(401).json({ message: 'Unauthorized to perform this activity' })
    }

    if (!message) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const receivers = await db
      .select()
      .from(user)
      .where(
        ne(user.role, "admin")
      );

    const filtered = receivers.filter(
      u => u.id !== senderId && u.pushToken
    );

    const tokens = filtered.map(u => u.pushToken);

    await db.insert(notifications)
      .values({
        title: 'Ask for Support',
        message,
        senderId
      })

    const payload = tokens.map(token => ({
      to: token,
      title: "🚨 Support Request",
      body: message
    }));

    await fetch("exp://10.143.165.154:8081/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: `error due to ${error.message}` })
  }
}

export const getNotifications = async (req, res) => {
  try {
    const data = await db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.createdAt));

    if (data.length === 0) {
      return res.status(404).json({
        message: "No notifications found"
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      message: `Internal server error: ${error.message}`
    });
  }
};
