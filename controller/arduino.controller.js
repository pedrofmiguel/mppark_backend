// Este ficheiro é experimental e apenas serve para ir testando coisas enquanto o arduino não esta a guardar informações na base de dados
require('../model/arduino');
const mongoose = require('mongoose');
const Arduino = mongoose.model('arduino');

// require('../model/arduinoSaida');
// const ArduinoSaida = mongoose.model('arduinoSaida');

// Guarda uma suposta entrada de um carro na base de dados
function addArduino(req, res)
{
    console.log("Trincheira");
    const arduino = new Arduino({
        macAddress: req.body.macAddress,
        action: req.body.action
    })
    
    arduino.save(function(err, task){
        if(err)
        {
            throw err;
        }
        else
        {
            res.send(task);
            console.log("Arduino saved sucessfully!");
        }
    })
}

// Guarda uma suposta saída de um carro na base de dados (numa "Collection" diferente da usada na função anterior)
// function addArduinoSaida(req, res)
// {
//     const arduinoSaida = new ArduinoSaida({
//         ident: req.body.ident
//     })
    
//     arduinoSaida.save(function(err, task){
//         if(err)
//         {
//             throw err;
//         }
//         else
//         {
//             res.send(task);
//             console.log("ArduinoSaida saved sucessfully!");
//         }
//     })
// }

module.exports = {
    addArduino: addArduino
    //addArduinoSaida: addArduinoSaida
}