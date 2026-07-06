import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON parsing with large limit for Base64 images
  app.use(express.json({ limit: "50mb" }));

  // API Route to upload the photo from browser localStorage
  app.post("/api/upload-photo", (req, res) => {
    try {
      const { image } = req.body;
      if (!image || !image.startsWith("data:image/")) {
        return res.status(400).json({ error: "Invalid image format" });
      }

      // Extract base64 data
      const matches = image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Invalid base64 string" });
      }

      const buffer = Buffer.from(matches[2], "base64");

      // Define target directory
      const dirPath = path.join(process.cwd(), "src/assets/images");
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Save as alice_photo.png
      const targetPath = path.join(dirPath, "alice_photo.png");
      fs.writeFileSync(targetPath, buffer);
      console.log(`Saved photo to ${targetPath}`);

      // Also copy to dist directory if we are in production or if build exists
      const distDir = path.join(process.cwd(), "dist/src/assets/images");
      if (fs.existsSync(path.join(process.cwd(), "dist"))) {
        fs.mkdirSync(distDir, { recursive: true });
        fs.writeFileSync(path.join(distDir, "alice_photo.png"), buffer);
        console.log(`Saved photo to dist ${path.join(distDir, "alice_photo.png")}`);
      }

      res.json({ success: true, url: "/src/assets/images/alice_photo.png" });
    } catch (err: any) {
      console.error("Upload error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Serve Vite app or built static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
