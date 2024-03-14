const express = require("express");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const courseRoutes = require("./routes/courseRoutes.js");
const lectureRoutes = require("./routes/lectureRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const contentRoutes = require("./routes/contentRoutes.js");
const studentRoutes = require("./routes/studentRoutes.js");
const discussionRoutes = require("./routes/discussionRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");

const PORT = process.env.PORT || 3000;

const app = express();

// Connecting to the Database
connectDB();

//Express Middleware
app.use(express.json());

// connecting the Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/course", courseRoutes);
app.use("/lecture", lectureRoutes);
app.use("/user", userRoutes);
app.use("/content", contentRoutes);
app.use("/student", studentRoutes);
app.use("/discussion", discussionRoutes);
app.use("/dashboard", dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
