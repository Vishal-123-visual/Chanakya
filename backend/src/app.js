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
// app.use(cors());

const allowedOrigins = [BACKEND_URL, FRONTEND_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the request origin is included in the allowedOrigins array
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());
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
app.use("/images", express.static(path.join(__dirname + "/images")));

export default app;
