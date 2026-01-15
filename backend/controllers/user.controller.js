import { db } from "../db/conn.js";
import { evidence, reports } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import cloudinary from "../config/cloudinary.js";
import PDFDocument from "pdfkit"
import axios from 'axios'
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
    const { id } = req.params

    const report = await db.query.reports.findFirst({
      where: eq(reports.id, Number(id)),
      with: {
        reportedBy: true
      }
    })

    if (!report) {
      return res.status(404).json({ message: "Report not found" })
    }

    const doc = new PDFDocument({ margin: 50 })

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      'Content-Disposition',
      `attachement; filename=report-${report.id}.pdf`
    );

    doc.pipe(res);

    /* ========== PDF CONTENT ============= */

    doc.fontSize(18).text("SMART IRONDO SECURITY REPORT", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Report ID: ${report.id}`);
    doc.text(`Report Type: ${report.reportType}`);
    doc.text(`Incident Type: ${report.incidentType || "None"}`);
    doc.text(`Status: ${report.status}`);
    doc.text(`Date: ${new Date(report.createdAt).toLocaleString()}`);

    doc.moveDown();

    doc.text("LOCATION", { underline: true });
    doc.text(
      `${report.location.district} / ${report.location.sector} / ${report.location.cell} / ${report.location.village}`
    );

    doc.moveDown();

    doc.text("DESCRIPTION", { underline: true });
    doc.text(report.description);

    doc.moveDown();

    doc.text("REPORTED BY", { underline: true });
    doc.text(`Name: ${report.reportedBy.fullName}`);
    doc.text(`Phone: ${report.reportedBy.phone}`);

    doc.end();

  } catch (error) {
    res.status(500).json({
      message: "Failed to download report",
      error: error.message,
    });
  }
}

export const downloadEvidence = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await db.query.evidence.findFirst({
      where: eq(evidence.id, Number(id)),
    });

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
      .select()
      .from(evidence)
      .orderBy(desc(evidence.createdAt));

    return res.status(200).json({
      message: "Evidence retrieved successfully",
      total: userEvidence.length,
      reports: userEvidence,
    });
  } catch (error) {
    console.error("Error fetching user Evidence:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}