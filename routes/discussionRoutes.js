// src/routes/discussionRoutes.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middleware/authentication");
const User = require("../models/user");
const Lecture = require("../models/lecture");
const Discussion = require("../models/discussion");

// Route to create a new discussion for a specific lecture
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
      console.error("Error creating discussion:", error);
      res.status(500).json({ error: "Error creating discussion" });
    }
  }
);

// Route to view all discussions for a specific lecture
router.get(
  "/lecture/:lectureId/discussions",
  authenticateToken,
  async (req, res) => {
    try {
      const lectureId = req.params.lectureId;

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

module.exports = router;
