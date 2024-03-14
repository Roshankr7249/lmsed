// src/routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middleware/authentication");
const User = require("../models/user");
const Course = require("../models/course");
const Lecture = require("../models/lecture");
const Discussion = require("../models/discussion");

// Student route to view personal dashboard
router.get("/personal-dashboard", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user details
    const user = await User.findById(userId).populate("courses");

    // Fetch course details for each enrolled course
    const enrolledCourses = user.courses;
    const courseDetails = await Course.find({ _id: { $in: enrolledCourses } });

    // Fetch lecture details for each enrolled course
    const lectureDetails = await Lecture.find({
      course: { $in: enrolledCourses },
    });

    // Fetch discussions participated by the user
    const discussionsParticipated = await Discussion.find({
      user: userId,
    }).populate("lecture");

    res.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      enrolledCourses: courseDetails,
      lectureDetails,
      discussionsParticipated,
    });
  } catch (error) {
    console.error("Error fetching personal dashboard:", error);
    res.status(500).json({ error: "Error fetching personal dashboard" });
  }
});

module.exports = router;
