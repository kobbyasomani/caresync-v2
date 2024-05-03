const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

// Creates a pdf doc out of user input/information
const createPDF = async (
  reportType,
  clientFirst,
  clientLast,
  carerFirst,
  carerLast,
  shiftNotes
) => {
  const doc = new PDFDocument();
  doc
    .image(__dirname + "/../images/logopdf.png", 380, 65, {
      width: 125,
    })
  doc.font("Helvetica").fontSize(12).text(`Client: ${clientFirst} ${clientLast}`);
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
const cloudinaryUpload = (buffer, folder, clientID) => {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: `CareSync/${folder}/${clientID}`,
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

/**
 * Deletes a list of given resources from Cloudinary by public_id
 * @param {Array<String>} public_ids An array of public_id strings for resources to delete
 * @param {Object} options `{ resource_type: "image" (default) | "raw" | "video" }`
 * @returns {Promise<Response>}
 */
const cloudinaryDelete = async (public_ids, delete_options) => {
  const options = delete_options || { resource_type: "image" };
  return cloudinary.api.delete_resources(public_ids, options).then((response) => response);
};

/**
 * Deletes the folder at the given path.
 * @param {String} path The directory path ending in the folder to be deleted. The top-level
 * path segment provided must be a folder in the Cloudinary root (`Home`) directory. The folder
 * to be deleted must be empty.
 * @returns {Promise<Response>}
 */
const cloudinaryDeleteFolder = async (path) => {
  return cloudinary.api.delete_folder(path).then((response) => response);
}

module.exports = { createPDF, cloudinaryUpload, cloudinaryDelete, cloudinaryDeleteFolder };
