const mongoose = require('mongoose');

const RecommendationsSchema = new mongoose.Schema({
    PersonalizedRecommendationFrequency: Number,
    RecommendationHelpfulness: String
}, { collection : 'Recommendations'})

const Recommendations = mongoose.model('Recommendations', RecommendationsSchema);

module.exports = Recommendations;