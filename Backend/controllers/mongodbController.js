const Behaviour = require("../models/Behaviour");
const Cart = require("../models/Cart")
const Data = require("../models/Data")
const Recommendations = require("../models/Recommendations")
const Review = require("../models/Review")
const Satisfaction = require("../models/Satisfaction")

exports.getPurchaseFrequencyCounts = async function (req, res) {
    try {
        const result = await Behaviour.aggregate([
            {
                $group: {
                    _id: "$PurchaseFrequency",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const purchaseFrequencyCounts = result.map(result => ({
            PurchaseFrequency: result._id,
            count: result.count
        }));

        res.json({ purchaseFrequencyCounts });

    } catch (err) {
        console.error('Error querying MongoDB:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getPurchaseCategoriesCounts = async function (req, res) {
    try {
        const result = await Behaviour.aggregate([
            {
                $group: {
                    _id: "$PurchaseCategories",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const purchaseCategoriesCounts = result.map(result => ({
            PurchaseCategories: result._id,
            count: result.count
        }));

        res.json({ purchaseCategoriesCounts });

    } catch (err) {
        console.error('Error querying MongoDB:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getPersonalizedRecommendationFrequencyCounts = async function (req, res) {
    try {
        const result = await Behaviour.aggregate([
            {
                $group: {
                    _id: "$PersonalizedRecommendationFrequency",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const personalizedRecommendationFrequencyCounts = result.map(result => ({
            PersonalizedRecommendationFrequency: result._id,
            count: result.count
        }));

        res.json({ personalizedRecommendationFrequencyCounts });

    } catch (err) {
        console.error('Error querying MongoDB:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getBrowsingFrequencyCounts = async function (req, res) {
    try {
        const result = await Behaviour.aggregate([
            {
                $group: {
                    _id: "$BrowsingFrequency",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        const browsingFrequencyCounts = result.map(result => ({
            BrowsingFrequency: result._id,
            count: result.count
        }));

        res.json({ browsingFrequencyCounts });

    } catch (err) {
        console.error('Error querying MongoDB:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}