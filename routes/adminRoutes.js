// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { cacheMiddleware, setInCache } = require("../../middleware/cache");
const Admin = require("../models/admin");

// Route to get admin list with caching
router.get("/admins", cacheMiddleware("adminList"), async (req, res) => {
  try {
    const admins = await Admin.find();

    // Set the data in Redis cache for future requests
    await setInCache("adminList", admins);

    res.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Error fetching admins" });
  }
});

// Route to get a specific admin by ID with caching
router.get("/admins/:id", cacheMiddleware("adminDetails"), async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await Admin.findById(adminId);

    // Set the data in Redis cache for future requests
    await setInCache(`adminDetails-${adminId}`, admin);

    res.json(admin);
  } catch (error) {
    console.error("Error fetching admin details:", error);
    res.status(500).json({ error: "Error fetching admin details" });
  }
});

// Route to create a new admin
router.post("/admins", async (req, res) => {
  try {
    const newAdmin = await Admin.create(req.body);

    // Invalidate the admin list cache after creating a new admin
    await setInCache("adminList", null);

    res.json(newAdmin);
  } catch (error) {
    console.error("Error creating a new admin:", error);
    res.status(500).json({ error: "Error creating a new admin" });
  }
});

// Route to update an admin by ID
router.put("/admins/:id", async (req, res) => {
  try {
    const adminId = req.params.id;
    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, req.body, {
      new: true,
    });

    // Invalidate the admin details and admin list caches after updating an admin
    await setInCache(`adminDetails-${adminId}`, null);
    await setInCache("adminList", null);

    res.json(updatedAdmin);
  } catch (error) {
    console.error("Error updating admin details:", error);
    res.status(500).json({ error: "Error updating admin details" });
  }
});

// Route to delete an admin by ID
router.delete("/admins/:id", async (req, res) => {
  try {
    const adminId = req.params.id;
    const deletedAdmin = await Admin.findByIdAndRemove(adminId);

    // Invalidate the admin details and admin list caches after deleting an admin
    await setInCache(`adminDetails-${adminId}`, null);
    await setInCache("adminList", null);

    res.json(deletedAdmin);
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ error: "Error deleting admin" });
  }
});

module.exports = router;
