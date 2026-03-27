import express from "express";
import LostItem from "../models/LostItem.js";
import { protect, teacherOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/lost-items/active
router.get("/active", async (req, res) => {
  try {
    const items = await LostItem.find({ status: "active" })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// GET /api/lost-items/collected
router.get("/collected", async (req, res) => {
  try {
    const items = await LostItem.find({ status: "collected" })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// GET /api/lost-items/archived
router.get("/archived", async (req, res) => {
  try {
    const items = await LostItem.find({ status: "archived" })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// GET /api/lost-items/my-items  (teacher only)
router.get("/my-items", protect, teacherOnly, async (req, res) => {
  try {
    const items = await LostItem.find({ uploadedBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// GET /api/lost-items/stats/monthly
router.get("/stats/monthly", async (req, res) => {
  try {
    const stats = await LostItem.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const formatted = stats.map((s) => ({
      month: `${s._id.year}-${String(s._id.month).padStart(2, "0")}`,
      count: s.count,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// POST /api/lost-items  (teacher only)
router.post("/", protect, teacherOnly, async (req, res) => {
  try {
    const { description, foundLocation, collectLocation, imageUrl, imageFilename } =
      req.body;

    const item = await LostItem.create({
      description,
      foundLocation,
      collectLocation,
      imageUrl,
      imageFilename,
      uploadedBy: req.user._id,
      status: "active",
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Create item error:", error);
    res.status(500).json({ message: "Failed to create item" });
  }
});

// PATCH /api/lost-items/:id/collect  (teacher only)
router.patch("/:id/collect", protect, teacherOnly, async (req, res) => {
  try {
    const item = await LostItem.findByIdAndUpdate(
      req.params.id,
      { status: "collected", collectedAt: new Date() },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to update item" });
  }
});

export default router;