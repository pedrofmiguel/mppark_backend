const mongoose = require('mongoose');

const Parque = new mongoose.Schema({
    macAddress: {type: String, required: true},
    
    created_at: {type: Date, default: Date.now}
})

module.exports = mongoose.model('parque', Parque);