import express from "express";
import Settings from "../models/Settings.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET settings
router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(
      "Get settings error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
});

// UPDATE settings
router.put("/", authMiddleware, async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findOneAndUpdate(
        {},
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    res.json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error(
      "Update settings error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
});

export default router;