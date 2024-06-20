const mongoose = require('mongoose');

const BehaviourSchema = new mongoose.Schema({
    PurchaseFrequency: String,
    PurchaseCategories: String,
    PersonalizedRecommendationFrequency: String,
    BrowsingFrequency: String,
    ProductSearchMethod: String,
    SearchResultExploration: String,
    SaveforlaterFrequency: String
}, { collection : 'Behaviour'})

const Behaviour = mongoose.model('Behaviour', BehaviourSchema);

module.exports = Behaviour;