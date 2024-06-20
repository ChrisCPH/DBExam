const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    CategoryID: Number,
    Category: String
}, { collection : 'Categories'})

const Categories = mongoose.model('Categories', CategorySchema);

module.exports = Categories;