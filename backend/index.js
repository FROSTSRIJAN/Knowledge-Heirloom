import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Mock AI Q&A endpoint
app.post("/api/ask", (req, res) => {
  const { question } = req.body;
  // For now, return a canned response
  res.json({
    answer: `This is a mock answer for: "${question}". (Replace with real AI logic later.)`,
    sources: [
      { title: "Sample Policy Document", url: "#" },
      { title: "Company Handbook", url: "#" }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Internal Docs Q&A backend running on port ${PORT}`);
});
