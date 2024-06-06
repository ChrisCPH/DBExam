const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    RatingID: Number,
    Rating: Number,
    RatingCount: Number,
    ProductID: String
}, { collection : 'Ratings' })

const Ratings = mongoose.model('Ratings', RatingSchema);

module.exports = Ratings;