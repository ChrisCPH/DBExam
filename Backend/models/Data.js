const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    Timestamp: String,
    Age: Number,
    Gender: String
}, { collection : 'Data'})

const Data = mongoose.model('Data', DataSchema);

module.exports = Data;