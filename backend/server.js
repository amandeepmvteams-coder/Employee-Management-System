const express = require("express");
const app = express();
const dotEnv = require("dotenv");
const DB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const taskRoutes = require("./routes/taskRoutes");
const attendanceRoutes = require("./routes/attendanceRoute");
const leaveRoutes = require("./routes/leaveRoutes");
const cors = require("cors");
dotEnv.config({});
app.use(cors());
app.use(express.json());

DB();

app.get("/", (req, res) => {
  res.end("Welcome to Employee Managment System");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/employee", employeeRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/leave", leaveRoutes);

const Port = process.env.PORT || 8000;
app.listen(Port, () => {
  console.log(`Server is listning to the ${Port}`);
});
