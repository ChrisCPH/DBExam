const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    CustomerReviewsImportance: Number,
    ReviewLeft: String,
    ReviewReliability: String,
    ReviewHelpfulness: String
}, { collection : 'Review'})

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;