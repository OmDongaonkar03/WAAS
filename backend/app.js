import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(","),
    credentials: true,
  }),
);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

export default app;