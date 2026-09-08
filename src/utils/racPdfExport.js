import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Loads an image URL (works with a bundler-imported asset path) into a
// base64 data URL so jsPDF's addImage can embed it.
const loadImageAsDataUrl = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Failed to load logo image"));
    img.src = url;
  });

// Logo + form title block shared by both pages.
// titleLines: array of 1-2 strings, e.g. ["MINUTES OF MEETING", "RESEARCH ADVISORY COMMITTEE MEETING"]
const drawHeader = (doc, logoDataUrl, titleLines) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  if (logoDataUrl) {
    const logoW = 65;
    const logoH = logoW / 2.95; // matches the real CHRIST logo aspect ratio
    doc.addImage(logoDataUrl, "PNG", (pageWidth - logoW) / 2, 10, logoW, logoH);
  }

  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.text("CENTRE FOR RESEARCH", pageWidth / 2, 34, { align: "center" });

  doc.setFontSize(11);
  doc.text(titleLines, pageWidth / 2, 41, { align: "center" });

  doc.setFont(undefined, "normal");
  return 52; // y position to continue drawing from
};

// The header info table shared by both forms — mirrors the original
// paper layout exactly (paired label/value rows, then full-width rows).
const drawInfoTable = (doc, startY, info) => {
  autoTable(doc, {
    startY,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 3, lineColor: [0, 0, 0], lineWidth: 0.2 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 45 },
      1: { cellWidth: 50 },
      2: { fontStyle: "bold", cellWidth: 45 },
      3: { cellWidth: "auto" },
    },
    body: [
      ["Date of Meeting:", info.meetingDate || "-", "Venue:", info.venue || "-"],
      [
        "Date of Registration:",
        "", // left blank on purpose — not yet linked from the student record
        "Progress Report Number:",
        info.meetingNumber ?? "-",
      ],
      [
        "Name of Scholar:",
        info.scholarName || "-",
        "Register Number:",
        info.registerNumber || "-",
      ],
      [
        { content: "Title of PhD:", styles: { fontStyle: "bold" } },
        { content: "", colSpan: 3 }, // left blank on purpose — not yet linked
      ],
      [
        { content: "Name of Supervisor:", styles: { fontStyle: "bold" } },
        { content: info.supervisorName || "-", colSpan: 3 },
      ],
      [
        { content: "Name of RAC Member:", styles: { fontStyle: "bold" } },
        { content: info.racMember1 || "-", colSpan: 3 },
      ],
      [
        { content: "Name of RAC Member:", styles: { fontStyle: "bold" } },
        { content: info.racMember2 || "-", colSpan: 3 },
      ],
    ],
  });

  return doc.lastAutoTable.finalY + 8;
};

// A labeled bordered box for free-text content (Members Present,
// Points Discussed, Supervisor's Comments, etc.)
const drawTextBox = (doc, y, label, content, boxHeight = 30) => {
  const margin = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const boxWidth = pageWidth - margin * 2;

  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.text(label, margin, y);
  doc.setFont(undefined, "normal");

  doc.rect(margin, y + 3, boxWidth, boxHeight);

  if (content) {
    const lines = doc.splitTextToSize(content, boxWidth - 8);
    doc.setFontSize(9);
    doc.text(lines, margin + 4, y + 10);
  }

  return y + boxHeight + 12;
};

// A blank signature line with a printed label underneath — no digital
// signature capture, this is purely for physical sign-off after printing.
const drawSignatureLine = (doc, y, label) => {
  const margin = 14;
  doc.setLineWidth(0.2);
  doc.line(margin, y, margin + 75, y);
  doc.setFontSize(8);
  doc.text(label, margin, y + 5);
  return y + 16;
};

/**
 * Generates and downloads a single PDF containing both:
 *   Page 1 — Minutes of Meeting
 *   Page 2 — Research Advisory Committee Meeting - Progress Review
 *
 * @param {object} meetingData - the object returned by
 *   studentService.getMeetingMinutes(meetingId) (res.data)
 * @param {string} logoUrl - bundler-resolved URL/path to the CHRIST logo asset
 */
export const exportRacDocuments = async (meetingData, logoUrl) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  let logoDataUrl = null;
  try {
    if (logoUrl) logoDataUrl = await loadImageAsDataUrl(logoUrl);
  } catch (e) {
    console.warn("Could not load logo for PDF export:", e.message);
  }

  const scholarName = meetingData.students?.profiles?.name;
  const registerNumber = meetingData.students?.register_number;
  const supervisorName = meetingData.supervisor?.name;
  const racMember1 = meetingData.rac_member_1?.name;
  const racMember2 = meetingData.rac_member_2?.name;
  const meetingDate = meetingData.meeting_date
    ? new Date(meetingData.meeting_date).toLocaleString()
    : "";

  const minutes = Array.isArray(meetingData.rah_meeting_minutes)
    ? meetingData.rah_meeting_minutes[0]
    : meetingData.rah_meeting_minutes;

  const sharedInfo = {
    meetingDate,
    venue: meetingData.meeting_location,
    scholarName,
    registerNumber,
    supervisorName,
    racMember1,
    racMember2,
    meetingNumber: meetingData.meeting_number,
  };

  // ---- PAGE 1: Minutes of Meeting ----
  let y = drawHeader(doc, logoDataUrl, [
    "MINUTES OF MEETING",
    "RESEARCH ADVISORY COMMITTEE MEETING",
  ]);
  y = drawInfoTable(doc, y, sharedInfo);
  y = drawTextBox(doc, y, "Members Present", minutes?.members_present);
  y = drawTextBox(doc, y, "Points Discussed", minutes?.points_discussed);
  y = drawTextBox(doc, y, "Decisions Reached", minutes?.decisions_reached);

  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.text("Signature of the Supervisor and RAC Members", 14, y);
  doc.setFont(undefined, "normal");
  y += 10;
  y = drawSignatureLine(doc, y, "Supervisor");
  y = drawSignatureLine(doc, y, "RAC Member 1");
  y = drawSignatureLine(doc, y, "RAC Member 2");

  // ---- PAGE 2: Progress Review ----
  doc.addPage();
  y = drawHeader(doc, logoDataUrl, [
    "RESEARCH ADVISORY COMMITTEE MEETING",
    "PROGRESS REVIEW",
  ]);
  y = drawInfoTable(doc, y, sharedInfo);

  // NOTE: supervisor/RAC member comments + their sign-off aren't wired up
  // to the backend yet (that's the next phase). Supervisor's existing
  // rac_comments field is used where available; RAC member boxes print
  // blank for now, exactly like the original paper form.
  y = drawTextBox(doc, y, "Supervisor's Comments:", meetingData.rac_comments);
  y = drawSignatureLine(doc, y, "Supervisor Signature");

  y += 4;
  y = drawTextBox(doc, y, "RAC Member's Comments:", null);
  y = drawSignatureLine(doc, y, `${racMember1 || "RAC Member 1"} Signature`);

  y += 4;
  y = drawTextBox(doc, y, "RAC Member's Comments:", null);
  y = drawSignatureLine(doc, y, `${racMember2 || "RAC Member 2"} Signature`);

  const fileName = `RAC_Meeting_${meetingData.meeting_number}_${
    scholarName || "Scholar"
  }.pdf`.replace(/\s+/g, "_");

  doc.save(fileName);
};