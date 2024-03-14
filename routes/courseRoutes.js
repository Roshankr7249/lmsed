const express = require("express");
const router = express.Router();
const { cacheMiddleware, setInCache } = require("../../middleware/cache");
const Course = require("../models/course");

// Route to get course list with caching
router.get("/courses", cacheMiddleware("courseList"), async (req, res) => {
  try {
    const courses = await Course.find();

    // Set the data in Redis cache for future requests
    await setInCache("courseList", courses);

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Error fetching courses" });
  }
});

// Route to get a specific course by ID with caching
router.get(
  "/courses/:id",
  cacheMiddleware("courseDetails"),
  async (req, res) => {
    try {
      const courseId = req.params.id;
      const course = await Course.findById(courseId);

      // Set the data in Redis cache for future requests
      await setInCache(`courseDetails-${courseId}`, course);

      res.json(course);
    } catch (error) {
      console.error("Error fetching course details:", error);
      res.status(500).json({ error: "Error fetching course details" });
    }
  }
);

// Route to create a new course
router.post("/courses", async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);

    // Invalidate the course list cache after creating a new course
    // await setInCache('courseList', null);

    res.json(newCourse);
  } catch (error) {
    console.error("Error creating a new course:", error);
    res.status(500).json({ error: "Error creating a new course" });
  }
});

// Route to update a course by ID
router.put("/courses/:id", async (req, res) => {
  try {
    const courseId = req.params.id;
    const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, {
      new: true,
    });

    // Invalidate the course details and course list caches after updating a course
    await setInCache(`courseDetails-${courseId}`, null);
    await setInCache("courseList", null);

    res.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course details:", error);
    res.status(500).json({ error: "Error updating course details" });
  }
});

// Route to delete a course by ID
router.delete("/courses/:id", async (req, res) => {
  try {
    const courseId = req.params.id;
    const deletedCourse = await Course.findByIdAndRemove(courseId);

    // Invalidate the course details and course list caches after deleting a course
    await setInCache(`courseDetails-${courseId}`, null);
    await setInCache("courseList", null);

    res.json(deletedCourse);
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Error deleting course" });
  }
});

module.exports = router;
