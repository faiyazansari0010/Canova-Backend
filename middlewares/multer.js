const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const type = req.query.type;
    console.log("req.query - ", req.query)

    const folder = "canova_uploads";

    const resourceType =
      type === "video"
        ? "video"
        : type === "audio"
        ? "audio"
        : type === "image"
        ? "image"
        : "raw";

    const allowedExtensions = {
      image: ["jpg", "jpeg", "png"],
      video: ["mp4", "mov", "avi"],
      pdf: ["pdf"],
      zip: ["zip"],
      audio: ["mp3", "wav", "ogg"],
      ppt: ["ppt", "pptx"],
      spreadsheet: ["xls", "xlsx"],
      document: ["doc", "docx", "txt"],
    };

    const ext = file.originalname.split(".").pop().toLowerCase();
    const allowed = allowedExtensions[type];
    console.log("type:", type); // should be "image"
    console.log("ext:", ext); // should be "jpg"
    console.log("allowed:", allowed); // should be ["jpg", "jpeg", "png"]

    if (!allowed || !allowed.includes(ext)) {
      throw new Error("Invalid file type");
    }

    return {
      folder,
      public_id: file.originalname.split(".")[0],
      resource_type: resourceType,
    };
  },
});

const upload = multer({ storage });
module.exports = upload;
