import express from "express";
import { v2 as cloudinary } from "cloudinary";
const router = express.Router();
import multer from "multer";
import sharp from "sharp";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/uploadimage", upload.single("myimage"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ ok: false, error: "No image file provided" });
  }

  sharp(file.buffer)
    .resize({ width: 800 })
    .toBuffer(async (err, data, info) => {
      if (err) {
        console.error("Image processing error:", err);
        return res
          .status(500)
          .json({ ok: false, error: "Error processing image" });
      }

      cloudinary.uploader
        .upload_stream({ resource_type: "auto" }, async (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return res.status(500).json({
              ok: false,
              error: "Error uploading image to Cloudinary",
            });
          }

          res.json({
            ok: true,
            imageUrl: result.url,
            message: "Image uploaded successfully",
          });
        })
        .end(data);
    });
});
export default router;
