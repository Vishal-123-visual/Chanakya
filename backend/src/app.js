import express from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/users.routes.js";
import addMissionFormRoutes from "./routes/addMissionForm.routes.js";
import studentsRoutes from "./routes/students.routes.js";
import courseRoutes from "./routes/course.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import courseFeesRoutes from "./routes/courseFees.routes.js";
import paymentOptionsRoutes from "./routes/paymentOptions.routes.js";
import companyRoutes from "./routes/company.routes.js";
import { BACKEND_URL, FRONTEND_URL } from "./config/config.js";

const app = express();

// Define allowed origins
const allowedOrigins = [FRONTEND_URL, BACKEND_URL];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRoutes);
app.use("/api/addmission_form", addMissionFormRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/courseFees", courseFeesRoutes);
app.use("/api/paymentOptions", paymentOptionsRoutes);
app.use("/api/company", companyRoutes);
const __dirname = path.resolve();
app.use("/api/images", express.static(path.join(__dirname + "/images")));

export default app;
