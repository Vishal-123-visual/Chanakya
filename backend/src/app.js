import express from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/users.routes.js";
import addMissionFormRoutes from "./routes/addMissionForm.routes.js";
import studentsRoutes from "./routes/students.routes.js";
import courseRoutes from "./routes/course.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import courseFeesRoutes from "./routes/courseFees.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRoutes);
app.use("/api/addmission_form", addMissionFormRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/courseFees", courseFeesRoutes);
const __dirname = path.resolve();
app.use("/images", express.static(path.join(__dirname + "/images")));

export default app;
