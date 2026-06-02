const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createShortUrl,
    redirectToOriginalUrl,
    getUserUrls,
    deleteUrl,
    getUrlAnalytics,
    updateUrl,
    getPublicStats,
    bulkCreateUrls
} = require("../controllers/urlController");

router.post("/create", protect, createShortUrl);
router.get("/my-urls", protect, getUserUrls);
router.get("/analytics/:id", protect, getUrlAnalytics);
router.put("/:id", protect, updateUrl);
router.delete("/:id", protect, deleteUrl);
router.post("/bulk", protect, upload.single("file"), bulkCreateUrls);
router.get("/public/:shortCode", getPublicStats);
router.get("/:shortCode", redirectToOriginalUrl);


module.exports = router;
