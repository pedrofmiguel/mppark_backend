const mongoose = require('mongoose');

const ArduinoSaida = new mongoose.Schema({
    ident: {type: Number, required: true},
    created_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('arduinoSaida', ArduinoSaida);