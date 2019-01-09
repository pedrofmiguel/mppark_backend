require('../model/autentication');
const mongoose = require('mongoose');
const User = mongoose.model('cliente');
//var bcrypt = require('bcryptjs');
//var jwt = require('jsonwebtoken');
//var config = require('../assets/config');
require('../model/estacionamento');
const Estacionamento = mongoose.model('estacionamento');

// Função que retorna todos os utilizadores existentes na plataforma
function listUsers(req, res) {
    var tabela = "";

    // São procurados todos os utilizadores existentes na base de dados
    User.find({}, function(err, users) {
        if (err) {
            console.log(err);
        }
        else {
            // Se não exitir utilizadores é enviado um alerta a dizer que não existem utilizadores
            if (users == 0) {
                return res.status(500).send('Não existem utilizadores');
            }
            else { // Caso existam, é criada uma tabela com o nome e e-mail de cada utilizador
                tabela += "<!DOCTYPE html>"

                tabela += "<table class='table'><tbody>";

                for (var i = 0; i < users.length; i++) {

                    tabela += "<tr><td>" + users[i].name + "</td>" + "<td>" + users[i].email + "</td></tr>";
                }

                tabela += "</tbody></table>";


                console.log("TABLE - " + tabela)

                res.send(users);
            }
        }
    })
}

// Função que retorna um utilzador específico
function listOneUser(req, res) {
    var tabela = "";

    // É procurado na base de dados por um utilizador com um id específico
    User.find({ _id: req.params.id }, function(err, user) {
        if (err) {
            console.log(err);
        }
        else {
            // Se não exitir nenhum utilizador com aquele id, é retornada uma mensagem avisar que o utilizador procurado não existe
            if (user == 0) {
                return res.status(500).send('Esse utilizador não existe');
            }
            else { // Caso contrário é criada uma tabela com o nome e e-mail do utilizador
                tabela += "<!DOCTYPE html>"

                tabela += "<table class='table'><tbody>";

                for (var i = 0; i < user.length; i++) {

                    tabela += "<tr><td>" + user[i].name + "</td>" + "<td>" + user[i].email + "</td></tr>";
                }

                tabela += "</tbody></table>";

                res.send(tabela);
            }
        }
    })
}

// Função que edita um utilizador específico
function editUser(req, res) {

    var tempoUpdate = new Date();

    User.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            return res.status(500).send('Error on the server.');
        }
        // Se existir é enviada uma mensagem a avisar aque aquele e-mail já existe e que a pessoa tem de usar outro
        if (user) {
            return res.status(500).send('Já existe um utilizador com esse email! Use outro e-mail!');
        }
        else { // Caso contrário, os dados do utilizador são guardados
            User.findByIdAndUpdate(req.params.id, { email: req.body.email, update_at: tempoUpdate }, function(err, user) {
                if (err) {
                    return res.status(500).send("There was a problem updating the user.")
                }
                else {
                    res.status(200).send('E-mail do utilizador atualizado com sucesso!');
                }
            })
        }
    })
}

// Função que apaga um utilizador específico
function deleteUser(req, res) {
    // Procura pelo utilizador que possui o id passado e elimina-o
    User.findOneAndRemove({ _id: req.params.id }, function(err) {
        if (err) {
            console.log(err)
        }
        else {
            return res.status(200).send('Utilizador apagado!');
        }
    })
}

// Função que lista os estacionamentos
function getEstacionamento(req, res) {
    var tabela = "";

    // São procurados todos os estacionamentos existentes na base de dados
    Estacionamento.find({}, function(err, result) {
        if (err) {
            console.log(err);
        }
        else {
            // Se não exitir estacionamentos é enviado um alerta a dizer que não existem estacionamentos
            if (result == 0) {
                return res.status(500).send('Não existem estacionamentos');
            }
            else { // Caso existam, é criada uma tabela com o nome, local e limite de cada estacionamento
                tabela += "<!DOCTYPE html>"

                tabela += "<table class='table'><tbody>";

                for (var i = 0; i < result.length; i++) {

                    tabela += "<tr><td>" + result[i].name + "</td>" + "<td>" + result[i].local + "</td>" + "<td>" + result[i].limit + "</td>" + "<td>" + result[i].arduino + "</td></tr>";
                }

                tabela += "</tbody></table>";

                res.send(tabela);
            }
        }
    })
}

// Função que adiciona um estacionamento específico
function addEstacionamento(req, res) {
    //var data = [];


    Estacionamento.findOne({ name: req.body.name }, function(err, result) {
        if (err) {
            return res.status(500).send('Error on the server.');
        }
        // Se existir é enviado um alerta a avisar que já existe um estacionamento com aquele nome
        if (result) {
            return res.status(500).send('Já existe um estacionamento com esse nome! Use outro nome!');
        }
        else { // Se não existir, é verificado se a caixa de texto do arduino está vazia
            console.log("ARDUINO - " + result);
            // Se estiver vazia guarda
            if (req.body.arduino == "") {
                Estacionamento.create({ name: req.body.name, local: req.body.local, limit: req.body.limit, arduino: req.body.arduino }, function(err, estacionamento) {
                    if (err) {
                        return res.status(500).send("Houve um problema ao registar o estacionamento 111111111.");
                        //return res.status(500).send(err);
                    }
                    else {
                        res.status(200).send("Estacionamento resgistado com sucesso 11111111111");
                    }
                })
            }
            else { // Se estiver preenchida é procurado por esse arduino
                Estacionamento.findOne({ arduino: req.body.arduino }, function(err, arduino) {
                    if (err) {
                        console.log(err);
                    }
                    // Se esse arduino já existir é enviada uma mensagem de alerta
                    if (arduino) {
                        return res.status(500).send("Esse arduino já está resgistado num parque de estacionamento! Use outro!");
                    }
                    else { // Se não existir é guardado
                        Estacionamento.create({ name: req.body.name, local: req.body.local, limit: req.body.limit, arduino: req.body.arduino }, function(err, estacionamento) {
                            if (err) {
                                return res.status(500).send("Houve um problema ao registar o estacionamento.");
                            }
                            else {
                                res.status(200).send("Estacionamento resgistado com sucesso");
                            }
                        })
                    }
                })
            }

        }
    })
}

// Função que edita um estacionamento específico
function editEstacionamento(req, res) {
    var tempoUpdate = new Date();

    Estacionamento.findOne({ _id: req.params.id }, function(err, result) {
        if (err) {
            console.log(err);
        }
        else {
            // Se o nome que está na caixa de texto não mudar nem o arduino então é guardado
            if ((result.name == req.body.name) && ((result.arduino == req.body.arduino) || (req.body.arduino == ""))) {

                Estacionamento.findByIdAndUpdate(req.params.id, { local: req.body.local, arduino: req.body.arduino, update_at: tempoUpdate }, function(err, estacionamento) {
                    if (err) {
                        return res.status(500).send("Houve um problema ao editar o estacionamento. 1");
                    }
                    else {
                        res.status(200).send('Estacionamento atualizado com sucesso! 1');
                    }
                })
            }
            else if ((result.name == req.body.name) && (req.body.arduino != "")) { // Se o nome não mudar e o arduino mudar

                Estacionamento.findOne({ arduino: req.body.arduino }, function(err, arduino) {
                    if (err) {
                        console.log(err);
                    }
                    // Se esse arduino já existir é enviada uma mensagem de alerta
                    if (arduino) {
                        return res.status(500).send("Esse arduino já está resgistado num parque de estacionamento! Use outro! 2");
                    }
                    else { // Se não existir é guardado
                        Estacionamento.findByIdAndUpdate(req.params.id, { local: req.body.local, arduino: req.body.arduino }, function(err, estacionamento) {
                            if (err) {
                                return res.status(500).send("Houve um problema ao registar o estacionamento. 2");
                            }
                            else {
                                res.status(200).send("Estacionamento resgistado com sucesso. 2");
                            }
                        })
                    }
                })
            }
            else if ((result.name != req.body.name) && ((result.arduino == req.body.arduino) || (req.body.arduino == ""))) {

                Estacionamento.findOne({ name: req.body.name }, function(err, result2) {
                    if (err) {
                        return res.status(500).send('Error on the server.');
                    }
                    // Se existir é enviada uma mensagem a avisar que aquele nome já existe e que o administrador tem de usar outro
                    if (result2) {
                        return res.status(500).send('Já existe um estacionamento com esse nome! Use outro nome! 3');
                    }
                    else { // Caso contrário, os dados do estacionamento são guardados
                        Estacionamento.findByIdAndUpdate(req.params.id, { name: req.body.name, local: req.body.local, arduino: req.body.arduino, update_at: tempoUpdate }, function(err, estacionamento) {
                            if (err) {
                                return res.status(500).send("There was a problem updating the user.")
                            }
                            else {
                                res.status(200).send('Estacionamento atualizado com sucesso! 3');
                            }
                        })
                    }
                })
            }
            else if ((result.name != req.body.name) && ((result.arduino != req.body.arduino) && (req.body.arduino != ""))) { // Se o administrador inserir um nome diferente
                // É procurado na collection de estacionamentos se aquele nome já existe
                Estacionamento.findOne({ name: req.body.name }, function(err, result2) {
                    if (err) {
                        return res.status(500).send('Error on the server.');
                    }
                    // Se existir é enviada uma mensagem a avisar que aquele nome já existe e que o administrador tem de usar outro
                    if (result2) {
                        return res.status(500).send('Já existe um estacionamento com esse nome! Use outro nome! 4');
                    }
                    else { // Caso contrário, os dados do estacionamento são guardados

                        Estacionamento.findOne({ arduino: req.body.arduino }, function(err, arduino) {
                            if (err) {
                                console.log(err);
                            }
                            // Se esse arduino já existir é enviada uma mensagem de alerta
                            if (arduino) {
                                return res.status(500).send("Esse arduino já está resgistado num parque de estacionamento! Use outro! 4");
                            }
                            else { // Se não existir é guardado
                                Estacionamento.findByIdAndUpdate(req.params.id, { name: req.body.name, local: req.body.local, arduino: req.body.arduino, update_at: tempoUpdate }, function(err, estacionamento) {
                                    if (err) {
                                        return res.status(500).send("Houve um problema ao registar o estacionamento.");
                                    }
                                    else {
                                        res.status(200).send("Estacionamento resgistado com sucesso. 4");
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
    })
}

// Função que apaga um estacionamento específico
function deleteEstacionamento(req, res) {
    // Procura pelo estacionamento que possui o id passado e elimina-o
    Estacionamento.findOneAndRemove({ _id: req.params.id }, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            return res.status(200).send('Estacionamento apagado!');
        }
    })
}

module.exports = {
    listUsers: listUsers,
    listOneUser: listOneUser,
    editUser: editUser,
    deleteUser: deleteUser,
    getEstacionamento: getEstacionamento,
    addEstacionamento: addEstacionamento,
    editEstacionamento: editEstacionamento,
    deleteEstacionamento: deleteEstacionamento
}
