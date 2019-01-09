console.log("entrou na rota da autentication")
//const app = require('../server');
const router = require('express').Router();
const controllerAutentication = require('../controller/autentication.controller');
var VerifyToken = require('../controller/VerifyToken');
var VerifyRegister = require('../controller/VerifyRegister');

console.log("entrou na rota da autentication")

//app.get('/parque/', controllerParque.read);
router.post('/users', VerifyRegister, controllerAutentication.addRegisto); // Rota para registar os utilizadores
router.put('/users/:id/action/:idA', VerifyToken, controllerAutentication.editRegisto); // Rota para editar um determinado utilizador
//router.delete('/delete/:id', controllerAutentication.deleteRegisto);
router.get('/users', VerifyToken, controllerAutentication.me); // Rota que devolve os dados de um utilizador a partir do token do mesmo
router.post('/login', controllerAutentication.login); // Rota para realizar o login
router.get('/logout', controllerAutentication.logout); // Rota para realizar o logout
router.use(controllerAutentication.middleware);
//app.delete('/parque/', controllerParque.deleteCar);

module.exports = router;