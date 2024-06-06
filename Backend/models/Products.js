const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    ProductID: String,
    ProductName: String,
    Price: Number,
    DiscountedPrice: Number,
    DiscountPercentage: Number,
    ProductLink: String,
    ImageLink: String,
    Description: String,
    CategoryID: Number
}, { collection : 'Products' })

const Products = mongoose.model('Products', ProductSchema);

module.exports = Products;