import { db } from "../db/conn.js";
import { evidence, reports } from "../db/schema.js";
import { eq } from "drizzle-orm";
import cloudinary from "../config/cloudinary.js";
import PDFDocument from "pdfkit"
import axios from 'axios'

export const uploadEvidence = async (req, res) => {
  try {
    const { reportId } = req.params;
    const uploadedBy = req.user.id;

    const report = await db.query.reports.findFirst({
      where: eq(reports.id, Number(reportId)),
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Evidence files are required" });
    }
    const uploadResults = await Promise.all(
      req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "evidences",
          resource_type: "auto",
        })
      )
    );

    const savedEvidence = [];

    for (const result of uploadResults) {
      const type = result.resource_type;

      const [saved] = await db
        .insert(evidence)
        .values({
          reportId: report.id,
          uploadedBy,
          url: result.secure_url,
          type,
          status: "pending",
        })
        .returning();

      savedEvidence.push(saved);
    }

    return res.status(201).json({
      message: "Evidence uploaded successfully",
      evidence: savedEvidence,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error while uploading evidence",
      error: error.message,
    });
  }
};

export const generateReport = async (req, res) => {
  try {
    const reportedBy = req.user.id;
    const {
      reportType,
      noCrime,
      incidentType,
      title,
      description,
      location,
      patrolStartTime,
      patrolEndTime,
    } = req.body;

    if (!reportType || !description || !location || !title ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Default logic for no-crime
    const finalIncidentType = noCrime ? "None" : incidentType;

    const [newReport] = await db
      .insert(reports)
      .values({
        reportedBy,
        reportType,
        noCrime,
        incidentType: finalIncidentType,
        title,
        description,
        location,
        patrolStartTime,
        patrolEndTime,
        status: noCrime ? "Submitted" : "Pending",
      })
      .returning();

    return res.status(201).json({
      message: "Report created successfully",
      report: newReport,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while creating report",
      error: error.message,
    });
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

