const Visit = require("../models/Visit");
const Url = require("../models/Url");
const validator = require("validator");
const { nanoid } = require("nanoid");
const UAParser = require("ua-parser-js");
const csv = require("csv-parser");
const fs = require("fs");
const createShortUrl = async (req, res) => {
    try {
        let { originalUrl, customAlias, expiresAt } = req.body;

        if (!originalUrl) {
            return res.status(400).json({
                message: "Original URL is required"
            });
        } 


        if (!validator.isURL(originalUrl)) {
            return res.status(400).json({
                message: "Please enter a valid URL"
            });
        }

        let shortCode;

        if (customAlias && customAlias.trim() !== "") {
            shortCode = customAlias.trim().toLowerCase();

            const aliasPattern = /^[a-zA-Z0-9-]+$/;

            if (!aliasPattern.test(shortCode)) {
                return res.status(400).json({
                    message: "Alias can contain only letters, numbers and hyphen"
                });
            }

            const existingAlias = await Url.findOne({ shortCode });

            if (existingAlias) {
                return res.status(400).json({
                    message: "Alias already exists"
                });
            }
        } else {
            shortCode = nanoid(6);

            let existingCode = await Url.findOne({ shortCode });

            while (existingCode) {
                shortCode = nanoid(6);
                existingCode = await Url.findOne({ shortCode });
            }
        }

        const url = await Url.create({
    user: req.user.id,
    originalUrl,
    shortCode,
    expiresAt: expiresAt || null
});

        res.status(201).json({
            message: "Short URL created successfully",
            url
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const redirectToOriginalUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;

        const url = await Url.findOne({ shortCode });

        if (!url) {
    return res.status(404).json({
        message: "Short URL not found"
    });
}
      if (url.expiresAt && new Date() > new Date(url.expiresAt)) {
    return res.redirect(`${process.env.FRONTEND_URL}/expired`);
}

        url.clicks = url.clicks + 1;
        await url.save();

       const parser = new UAParser(req.headers["user-agent"]);
const result = parser.getResult();

await Visit.create({
    url: url._id,
    browser: result.browser.name || "Unknown",
    os: result.os.name || "Unknown",
    device: result.device.type || "Desktop"
});

        res.redirect(url.originalUrl);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getUserUrls = async (req, res) => {
    try {
        const urls = await Url.find({
            user: req.user.id
        }).sort({
            createdAt: -1
        });

        res.json(urls);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteUrl = async (req, res) => {
    try {
        const url = await Url.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!url) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        await Visit.deleteMany({
            url: url._id
        });

        await Url.deleteOne({
            _id: req.params.id
        });

        res.json({
            message: "URL deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getUrlAnalytics = async (req, res) => {
    try {
        const url = await Url.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!url) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        const visits = await Visit.find({
            url: url._id
        })
            .sort({ visitedAt: -1 })
            .limit(10);

        res.json({
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            totalClicks: url.clicks,
            lastVisited: visits.length > 0 ? visits[0].visitedAt : null,
            recentVisits: visits
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const updateUrl = async (req, res) => {
    try {

        const { originalUrl } = req.body;

        const url = await Url.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!url) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        url.originalUrl = originalUrl;

        await url.save();

        res.json({
            message: "URL updated successfully",
            url
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getPublicStats = async (req, res) => {
    try {
        const { shortCode } = req.params;

        const url = await Url.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        const visits = await Visit.find({ url: url._id })
            .sort({ visitedAt: -1 })
            .limit(10);

        res.json({
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            totalClicks: url.clicks,
            createdAt: url.createdAt,
            lastVisited: visits.length > 0 ? visits[0].visitedAt : null,
            recentVisits: visits
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const bulkCreateUrls = async (req, res) => {
    try {
        const results = [];

        if (!req.file) {
            return res.status(400).json({
                message: "CSV file is required"
            });
        }

        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on("data", (data) => {
                results.push(data);
            })
            .on("end", async () => {
                const createdUrls = [];

                for (const row of results) {
                    const originalUrl = row.url;

                    if (!originalUrl || !validator.isURL(originalUrl)) {
                        continue;
                    }

                    let shortCode = nanoid(6);
                    let existingCode = await Url.findOne({ shortCode });

                    while (existingCode) {
                        shortCode = nanoid(6);
                        existingCode = await Url.findOne({ shortCode });
                    }

                    const url = await Url.create({
                        user: req.user.id,
                        originalUrl,
                        shortCode
                    });

                    createdUrls.push(url);
                }

                fs.unlinkSync(req.file.path);

                res.status(201).json({
                    message: "Bulk URLs created successfully",
                    count: createdUrls.length,
                    urls: createdUrls
                });
            });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createShortUrl,
    redirectToOriginalUrl,
    getUserUrls,
    getPublicStats,
    updateUrl,
    deleteUrl,
    getUrlAnalytics,
    bulkCreateUrls
};