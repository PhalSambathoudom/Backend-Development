import express, { json } from "express";
import cors from "cors";
import articleRouter from "./routes/articleRoutes.js";
import helmet from "helmet";
const app = express();


// Enable CORS for all routes and origins
app.use(cors());

// Enable json serialization
app.use(json());

app.get("/", (req, res) => {
  res.send("Backend is running. Use /api/articles for article data.");
});

app.use("/api/articles", articleRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});