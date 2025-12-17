import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import OpenAI from "openai";
import cors from "cors";   // ✅ ADD THIS

dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });

// ✅ ENABLE CORS
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/generate", upload.single("photo"), async (req, res) => {
  const { username, interest } = req.body;

  const prompt = `
Create a full-body action figure in its original window box packaging.
Top text: "${username}"
Below it: "${interest}"
Bottom text: "Action Figure"
Accessories: pen, mouse, eraser
Style: 3D animation toy store product
Soft lighting, blurred toy store background
`;

  try {
    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024"
    });

    res.json({ url: image.data[0].url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image generation failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running");
});
