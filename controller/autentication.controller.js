require('../model/autentication');
const mongoose = require('mongoose');
const User = mongoose.model('cliente');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../assets/config');

// Função que resgista um utilizador na base de dados
function addRegisto(req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    // Primeiro verifica se já existe alguém com o mesmo e-mail que o utilizador que pretende se registar
    User.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            return res.status(500).send('Error on the server.');
        }
        // Se existir é enviado um alerta a avisar que já existe alguém com aquele e-mail
        if (user) {
            return res.status(500).send('Já existe um utilizador com esse email! Use outro email!');
        }
        else { // Se não existir, então as informações são guardadas na base de dados
            User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword
                },
                function(err, user) {
                    if (err) {
                        return res.status(500).send("There was a problem registering the user.")
                    }

                    // É criado um token
                    var token = jwt.sign({ id: user._id }, config.secret, {
                        expiresIn: 86400 // O token expira em 24 horas
                    });

                    res.status(200).send({ auth: true, token: token });
                }
            );
        }
    })
}

// Função para obter as informações de um utilizador a partir do token do mesmo
function me(req, res, next) {
    //res.status(200).send(decoded);
    User.findById(req.userId, { password: 0 }, function(err, user) {
        if (err) {
            return res.status(500).send("There was a problem finding the user.");
        }
        if (!user) {
            return res.status(404).send("No user found.");
        }
        res.status(200).send(user);
    });
}

//add the middleware function
function middleware(user, req, res, next) {
    res.status(200).send(user);
}

// Função de login
function login(req, res) {
    //Procura se o e-mail inserido realmente existe
    User.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            return res.status(500).send('Error on the server.');
        }
        // Se não existir é enviada uma mensagem a avisar que aquele utilizador não existe
        if (!user) {
            return res.status(404).send('O utilizador em questão não existe.');
        }

        // Encripta a password
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null });
        }

        //É criado um token
        global.token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 //O token expira em 24 horas
        });

        res.status(200).send({ auth: true, token: global.token });
    });
}

// Função para editar os dados de um utilizador
function editRegisto(req, res) {

    //console.log("ID: " + req.userId);

    var tempoUpdate = new Date();

    //console.log("TEMPO : " + req.body.update_at)

    if (req.params.idA == "name") {
        User.findByIdAndUpdate(req.params.id, { name: req.body.name, update_at: tempoUpdate }, function(err, user) {
            if (err) {
                return res.status(500).send("There was a problem updating the user.")
            }
            else {
                res.status(200).send('Nome atualizado com sucesso!');
            }
        })
    }
    else if (req.params.idA == "password") {
        
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        
        User.findByIdAndUpdate(req.params.id, {password: hashedPassword, update_at: tempoUpdate }, function(err, user) {
            if (err) {
                return res.status(500).send("There was a problem updating the user.")
            }
            else {
                // create a token
                var token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 houres
                });

                res.status(200).send({ auth: true, token: token });

                //res.status(200).send('Utilizador atualizado com sucesso!');
            }
        })
    }

    // Procura pelo utilizador com o id contido no token criado
    // User.findById(req.params.id, function(err, user) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         console.log("EMAIL - " + user.email);

    //         // Se o email que o utilizador inseriu é igual ao seu e-mail, então é tudo guardado
    //         if (user.email == req.body.email) {
    //             console.log("É IGUAL");

    //             User.findByIdAndUpdate(req.params.id, { name: req.body.name, password: hashedPassword, update_at: tempoUpdate }, function(err, user) {
    //                 if (err) {
    //                     return res.status(500).send("There was a problem updating the user.")
    //                 }
    //                 else {
    //                     // create a token
    //                     var token = jwt.sign({ id: user._id }, config.secret, {
    //                         expiresIn: 86400 // expires in 24 houres
    //                     });

    //                     res.status(200).send({ auth: true, token: token });

    //                     //res.status(200).send('Utilizador atualizado com sucesso!');
    //                 }
    //             })
    //         }
    //         else { // Se o utilizador inserir um e-mail diferente
    //             // É procurado na tabela de utilizadores se aquele e-mail já existe
    //             User.findOne({ email: req.body.email }, function(err, user) {
    //                 if (err) {
    //                     return res.status(500).send('Error on the server.');
    //                 }
    //                 // Se existir é enviada uma mensagem a avisar aque aquele e-mail já existe e que a pessoa tem de usar outro
    //                 if (user) {
    //                     return res.status(500).send('Já existe um utilizador com esse email! Use outro e-mail!');
    //                 }
    //                 else { // Caso contrário, os dados do utilizador são guardados
    //                     User.findByIdAndUpdate(req.userId, { name: req.body.name, email: req.body.email, password: hashedPassword, update_at: tempoUpdate }, function(err, user) {
    //                         if (err) {
    //                             return res.status(500).send("There was a problem updating the user.")
    //                         }
    //                         else {
    //                             // create a token
    //                             var token = jwt.sign({ id: user._id }, config.secret, {
    //                                 expiresIn: 86400 // expires in 24 houres
    //                             });

    //                             res.status(200).send({ auth: true, token: token });

    //                             //res.status(200).send('Utilizador atualizado com sucesso!');
    //                         }
    //                     })
    //                 }
    //             })
    //         }
    //     }
    // })
}

// Função de logout que apaga o token existente
function logout(req, res) {
    res.status(200).send({ auth: false, token: null });
}

module.exports = {
    addRegisto: addRegisto,
    me: me,
    login: login,
    editRegisto,
    logout: logout,
    middleware: middleware
}
