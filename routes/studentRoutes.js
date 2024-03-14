// src/routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middleware/authentication");
const Course = require("../models/course");
const Lecture = require("../models/lecture");
const Discussion = require("../models/discussion");
const User = require("../models/user");

// Student route to view their progress and enrolled courses
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user details with populated courses
    const user = await User.findById(userId).populate("courses");

    res.json({ user });
  } catch (error) {
    console.error("Error fetching student dashboard:", error);
    res.status(500).json({ error: "Error fetching student dashboard" });
  }
});

// Student route to update their profile
router.put("/profile/update", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    // Validate input fields
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({ error: "Error updating student profile" });
  }
});

// Student route to view all available courses
router.get("/courses", authenticateToken, async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ courses });
  } catch (error) {
    console.error("Error fetching available courses:", error);
    res.status(500).json({ error: "Error fetching available courses" });
  }
});

// Student route to enroll in a course
router.post("/enroll/:courseId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;

    // Check if the user is already enrolled in the course
    const user = await User.findById(userId);
    if (user.courses.includes(courseId)) {
      return res
        .status(400)
        .json({ error: "User is already enrolled in the course" });
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Enroll the user in the course
    user.courses.push(courseId);
    await user.save();

    res.json({ message: "Enrolled successfully", user });
  } catch (error) {
    console.error("Error enrolling in a course:", error);
    res.status(500).json({ error: "Error enrolling in a course" });
  }
});

// Student route to view lectures for enrolled courses
router.get("/lectures", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user details with populated courses and lectures
    const user = await User.findById(userId).populate({
      path: "courses",
      populate: { path: "lectures" },
    });

    // Extract lectures from enrolled courses
    const lectures = user.courses.reduce((acc, course) => {
      acc.push(...course.lectures);
      return acc;
    }, []);

    res.json({ lectures });
  } catch (error) {
    console.error("Error fetching lectures for enrolled courses:", error);
    res
      .status(500)
      .json({ error: "Error fetching lectures for enrolled courses" });
  }
});

// Student route to view discussions for a specific lecture
router.get(
  "/lecture/:lectureId/discussions",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const lectureId = req.params.lectureId;

      // Check if the user is enrolled in the lecture's course
      const user = await User.findById(userId).populate({
        path: "courses",
        populate: { path: "lectures" },
      });

      const lecture = await Lecture.findById(lectureId);
      if (
        !lecture ||
        !user.courses.find((course) => course.lectures.includes(lectureId))
      ) {
        return res.status(403).json({
          error:
            "User does not have permission to view discussions for this lecture",
        });
      }

      // Fetch discussions for the specified lecture
      const discussions = await Discussion.find({
        lecture: lectureId,
      }).populate("user");

      res.json({ discussions });
    } catch (error) {
      console.error("Error fetching discussions for a lecture:", error);
      res
        .status(500)
        .json({ error: "Error fetching discussions for a lecture" });
    }
  }
);

// Student route to participate in discussions for a specific lecture
router.post(
  "/lecture/:lectureId/discussion",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const lectureId = req.params.lectureId;
      const { comment } = req.body;

      // Check if the user is enrolled in the lecture's course
      const user = await User.findById(userId).populate({
        path: "courses",
        populate: { path: "lectures" },
      });

      const lecture = await Lecture.findById(lectureId);
      if (
        !lecture ||
        !user.courses.find((course) => course.lectures.includes(lectureId))
      ) {
        return res.status(403).json({
          error:
            "User does not have permission to participate in discussions for this lecture",
        });
      }

      // Create a new discussion
      const newDiscussion = new Discussion({
        user: userId,
        lecture: lectureId,
        comment,
      });

      const savedDiscussion = await newDiscussion.save();

      res.json({
        message: "Discussion created successfully",
        discussion: savedDiscussion,
      });
    } catch (error) {
      console.error("Error participating in a discussion:", error);
      res.status(500).json({ error: "Error participating in a discussion" });
    }
  }
);

module.exports = router;
