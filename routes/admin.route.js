console.log("entrou na rota da autentication admin")
//const app = require('../server');
const router = require('express').Router();
const controllerAdmin = require('../controller/admin.controller');
//var VerifyToken = require('../controller/VerifyToken');

console.log("entrou na rota da autentication ADMIN")

// utilizadores
router.get('/utilizadores', controllerAdmin.listUsers); // Rota para listar todos os utilizadores
router.get('/utilizadores/:id', controllerAdmin.listOneUser); // Rota para listar um utilizador específico
router.put('/utilizadores/:id', controllerAdmin.editUser); // Rota para editar um utilizador
router.delete('/utilizadores/:id', controllerAdmin.deleteUser); // Rota para apagar um utilizador específico
// estacionamento
router.get('/estacionamento', controllerAdmin.getEstacionamento); // Rota para listar todos os estacionamentos
router.post('/estacionamento', controllerAdmin.addEstacionamento); // Rota para criar um estacionamento
router.put('/estacionamento/:id', controllerAdmin.editEstacionamento); // Rota para editar um estacionamento
router.delete('/estacionamento/:id', controllerAdmin.deleteEstacionamento); // Rota para apagar um estacionamento específico

module.exports = router;