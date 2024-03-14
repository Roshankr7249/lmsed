const express = require("express");
const router = express.Router();
const { cacheMiddleware, setInCache } = require("../../middleware/cache");
const Lecture = require("../models/lecture");

// Route to get lecture list with caching
router.get("/lectures", cacheMiddleware("lectureList"), async (req, res) => {
  try {
    const lectures = await Lecture.find();

    // Set the data in Redis cache for future requests
    await setInCache("lectureList", lectures);

    res.json(lectures);
  } catch (error) {
    console.error("Error fetching lectures:", error);
    res.status(500).json({ error: "Error fetching lectures" });
  }
});

// Route to get a specific lecture by ID with caching
router.get(
  "/lectures/:id",
  cacheMiddleware("lectureDetails"),
  async (req, res) => {
    try {
      const lectureId = req.params.id;
      const lecture = await Lecture.findById(lectureId);

      // Set the data in Redis cache for future requests
      await setInCache(`lectureDetails-${lectureId}`, lecture);

      res.json(lecture);
    } catch (error) {
      console.error("Error fetching lecture details:", error);
      res.status(500).json({ error: "Error fetching lecture details" });
    }
  }
);

// Route to create a new lecture
router.post("/lectures", async (req, res) => {
  try {
    const newLecture = await Lecture.create(req.body);

    // Invalidate the lecture list cache after creating a new lecture
    await setInCache("lectureList", null);

    res.json(newLecture);
  } catch (error) {
    console.error("Error creating a new lecture:", error);
    res.status(500).json({ error: "Error creating a new lecture" });
  }
});

// Route to update a lecture by ID
router.put("/lectures/:id", async (req, res) => {
  try {
    const lectureId = req.params.id;
    const updatedLecture = await Lecture.findByIdAndUpdate(
      lectureId,
      req.body,
      { new: true }
    );

    // Invalidate the lecture details and lecture list caches after updating a lecture
    await setInCache(`lectureDetails-${lectureId}`, null);
    await setInCache("lectureList", null);

    res.json(updatedLecture);
  } catch (error) {
    console.error("Error updating lecture details:", error);
    res.status(500).json({ error: "Error updating lecture details" });
  }
});

// Route to delete a lecture by ID
router.delete("/lectures/:id", async (req, res) => {
  try {
    const lectureId = req.params.id;
    const deletedLecture = await Lecture.findByIdAndRemove(lectureId);

    // Invalidate the lecture details and lecture list caches after deleting a lecture
    await setInCache(`lectureDetails-${lectureId}`, null);
    await setInCache("lectureList", null);

    res.json(deletedLecture);
  } catch (error) {
    console.error("Error deleting lecture:", error);
    res.status(500).json({ error: "Error deleting lecture" });
  }
});

module.exports = router;
