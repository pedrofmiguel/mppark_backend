//const app = require('../server');
const router = require('express').Router();
const controllerParque = require('../controller/parque.controller');

console.log("entrou na rota")

//app.get('/parque/', controllerParque.read);
router.post('/parques', controllerParque.addCar); // Rota para adicionar um "Document" na "Collection" que contém os carros que estão em cada parque
router.get('/parques/:macAddress', controllerParque.getCars) // Rota para obter os carros que estão estacinados num determinado parque
//router.delete('/parques', controllerParque.deleteCar); // Rota para eliminar um "Document" na "Collection" que contém os carros que estão em cada parque, quando um sai
//app.delete('/parque/', controllerParque.deleteCar);

module.exports = router;