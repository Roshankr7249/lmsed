// src/routes/contentRoutes.js
const express = require("express");
const router = express.Router();
const isAdminOrInstructor = require("../../middleware/authorization");
const authenticateToken = require("../../middleware/authentication");
const Content = require("../models/content");

// Admin or Instructor route to create educational content
router.post(
  "/content/create",
  authenticateToken,
  isAdminOrInstructor,
  async (req, res) => {
    try {
      const { title, description, type, content } = req.body;

      // Validate input fields (you can add more validation as needed)
      if (!title || !description || !type || !content) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Assuming you have a Content model with a schema
      const newContent = new Content({
        title,
        description,
        type,
        content,
      });

      // Save the content to the database
      const savedContent = await newContent.save();

      res.json({
        message: "Content created successfully",
        content: savedContent,
      });
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(500).json({ error: "Error creating content" });
    }
  }
);

// Route to get all educational content
router.get("/content/all", authenticateToken, async (req, res) => {
  try {
    const allContent = await Content.find();
    res.json({ content: allContent });
  } catch (error) {
    console.error("Error fetching all content:", error);
    res.status(500).json({ error: "Error fetching all content" });
  }
});

module.exports = router;
