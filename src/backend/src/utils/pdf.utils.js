const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

// Creates a pdf doc out of user input/information
const createPDF = async (
  reportType,
  patientFirst,
  patientLast,
  carerFirst,
  carerLast,
  shiftNotes
) => {
  const doc = new PDFDocument();
  doc
    .image(__dirname + "/../images/logopdf.png", 380, 65, {
      width: 125,
    })
  doc.font("Helvetica").fontSize(12).text(`Client: ${patientFirst} ${patientLast}`);
  doc.font("Helvetica").fontSize(12).text(`Carer: ${carerFirst} ${carerLast}`);
  doc
    .font("Helvetica")
    .text(`Date: ${new Date().toLocaleString().split(",")[0]}`);
  doc.font("Helvetica").fontSize(20).moveDown(2).text(`${reportType}`, {
    width: 410,
    align: "center",
    valign: "top",
  });
  doc.font("Helvetica").fontSize(12).moveDown(1).text(`${shiftNotes}`);
  doc.end();
  return await getStream.buffer(doc);
};

// Uploads a PDf document to Cloudinary
const cloudinaryUpload = (buffer, folder, patientID) => {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: `CareSync/${folder}/${patientID}`,
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });
};

module.exports = { createPDF, cloudinaryUpload };
