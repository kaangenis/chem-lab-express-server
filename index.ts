import express from "express";
import mongoose from "mongoose";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import adminRouter from "./routes/admin_route";
import organizationRouter from "./routes/organization_route";

dotenv.config();

const app = express();

app.set('trust proxy', 1);
const blockedIPs = new Map();


const limiter = rateLimit({
  windowMs: 10 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    const ip = req.ip;
    const blockDuration = 60 * 1000;

    blockedIPs.set(ip, Date.now() + blockDuration);

    res.status(429).json({
      message: 'Çok fazla istek gönderildi. Lütfen 1 dakika bekleyin.',
    });
  },
  skipFailedRequests: false,
});


app.use((req, res, next) => {
  const ip = req.ip;
  const blockEndTime = blockedIPs.get(ip);

  if (blockEndTime) {
    if (Date.now() < blockEndTime) {
      return res.status(429).json({
        message: 'IP adresiniz geçici olarak engellendi. Lütfen bekleyin.',
      });
    } else {
      blockedIPs.delete(ip);
    }
  }
  next();
});


app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use(limiter);
const port = 5226;

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


console.log("Mongo Config Started");
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chem_lab_mongo_db';
const MONGO_URI = "mongodb://mongodb:27017/chem-lab-db";

mongoose
  .connect(MONGO_URI, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo Config Done");
    console.log("Connected to MongoDB");
  })
  .catch((err: string) => {
    console.log("Mongo Config Stopped - Error");
    console.error("CRITICAL_DB_ERROR:", err);
  });

console.log("Mongo Config Completed");

app.use(bodyParser.json());

app.use((req: any, res: any, next: any) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const veryRandomID =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  req.currentTime = currentTime;
  req.veryRandomID = veryRandomID;
  next();
});

app.use("/api", (req: any, res: any, next: any) => {
  next();
});

app.get("/", (req: any, res: any) => {
  res.status(200).json({ status: true, msg: "Hello World.. From Chemlab Server!" });
});


app.use("/api/admin", adminRouter);
app.use("/api/organization", organizationRouter);


server.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor...`);
});
