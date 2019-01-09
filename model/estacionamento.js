const mongoose = require('mongoose');

const Estacionamento = new mongoose.Schema({
    //numIdent: {type: Number, required: true},
    name: {type: String, required: true},
    local: {type: String, required: true},
    limit: {type: Number, required: true},
    arduino: {type: String, required: false},
    
    created_at: {type: Date, default: Date.now},
    update_at: {type: Date, default: Date.now}
})

module.exports = mongoose.model('estacionamento', Estacionamento);