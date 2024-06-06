const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    ReviewID: String,
    ReviewTitle: String,
    ReviewContent: String,
    UserID: String,
    ProductID: String
}, { collection : 'Reviews' })

const Reviews = mongoose.model('Reviews', ReviewSchema);

module.exports = Reviews;