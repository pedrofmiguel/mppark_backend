const mongoose = require('mongoose');

const Arduino = new mongoose.Schema({
    macAddress: {type: String, required: true},
    action: {type: String, required: true},
    created_at: {type: Date, default: Date.now}
});

module.exports = mongoose.model('arduino', Arduino);



// -- CÓDIGO A SER USADO -- // 
// const Arduino = new mongoose.Schema({
//     ident: {type: Number, required: true},
//     created_at: {type: Date, default: Date.now}
// });

// module.exports = mongoose.model('Record', Arduino);


