const mongoose = require('mongoose');

const SatisfactionSchema = new mongoose.Schema({
    RatingAccuracy: Number,
    ShoppingSatisfaction: Number,
    ServiceAppreciation: String,
    ImprovementAreas: String
}, { collection : 'Satisfaction'})

const Satisfaction = mongoose.model('Satisfaction', SatisfactionSchema);

module.exports = Satisfaction;