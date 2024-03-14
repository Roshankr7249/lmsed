const express = require("express");
const router = express.Router();
const { cacheMiddleware, setInCache } = require("../../middleware/cache");
const User = require("../models/user");

// Route to get user list with caching
router.get("/users", cacheMiddleware("userList"), async (req, res) => {
  try {
    const users = await User.find();

    // Set the data in Redis cache for future requests
    await setInCache("userList", users);
    res.send("api running");

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Route to get a specific user by ID with caching
router.get("/users/:id", cacheMiddleware("userDetails"), async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    // Set the data in Redis cache for future requests
    await setInCache(`userDetails-${userId}`, user);

    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Error fetching user details" });
  }
});

// Route to create a new user
router.post("/users", async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    // Invalidate the user list cache after creating a new user
    // await setInCache('userList', null);

    res.json(newUser);
  } catch (error) {
    console.error("Error creating a new user:", error);
    res.status(500).json({ error: "Error creating a new user" });
  }
});

// Route to update a user by ID
router.put("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    // Invalidate the user details and user list caches after updating a user
    await setInCache(`userDetails-${userId}`, null);
    await setInCache("userList", null);

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: "Error updating user details" });
  }
});

// Route to delete a user by ID
router.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndRemove(userId);

    // Invalidate the user details and user list caches after deleting a user
    await setInCache(`userDetails-${userId}`, null);
    await setInCache("userList", null);

    res.json(deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
});

module.exports = router;
