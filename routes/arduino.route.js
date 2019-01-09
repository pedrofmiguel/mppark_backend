console.log("entrou na rota da autentication arduino")
//const app = require('../server');
const router = require('express').Router();
const controllerArduino = require('../controller/arduino.controller');
//var VerifyToken = require('../controller/VerifyToken');

console.log("entrou na rota da autentication ADMIN")
// Entrada de um carro
router.post('/arduinos', controllerArduino.addArduino); // Rota para adicionar um "Document" na "Collection" do arduino que deteta as entradas dos carros
//router.post('/arduinos/:id/parks/:idP/', controllerArduino.addArduino);
// Saída de um carro
//router.post('/arduinosSaida', controllerArduino.addArduinoSaida); // Rota para adicionar um "Document" na "Collection" do arduino que deteta as saídas dos carros

module.exports = router;