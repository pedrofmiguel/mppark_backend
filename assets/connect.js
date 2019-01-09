const mongoose= require("mongoose")
mongoose.Promise = global.Promise
mongoose.connect('mongodb://parque.estacionamento:parque1819estacionamento@ds157799.mlab.com:57799/parque_estacionamento' , { useNewUrlParser: true });