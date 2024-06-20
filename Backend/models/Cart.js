const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    AddToCartBrowsing: String,
    CartCompletionFrequency: String,
    CartAbandonmentFactors: String
}, { collection : 'Cart'})

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;