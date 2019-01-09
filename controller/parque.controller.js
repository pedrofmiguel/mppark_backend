require('../model/parque');
const mongoose = require('mongoose');
const Parques = mongoose.model('parque');

require('../model/arduino');
const Arduino = mongoose.model('arduino');

require('../model/estacionamento');
const Estacionamento = mongoose.model('estacionamento');

var tempo = setInterval(addCar, 8000);

// Função que adiciona um carro ao parque de estacionamento
function addCar(req, res, parque) {
    //parque = req.body.parque;
    //console.log("entrou na função");

    //console.log("SESSAO - " + global.session.ultimaEntrada);

    var data = [];

    var macAddress = "";

    var action = "";

    // Procura pela data de criação de cada entrada na tabela dos arduinos
    Arduino.find({}, 'created_at -_id', function(err, result) {
        if (err) {
            console.log(err);
        }
        else {
            // Percorre cada entrada e guarda-as num array
            for (var x in result) {
                //console.log("resultado - " + result[x].created_at);

                data.push(result[x].created_at)
            }

            //console.log("ULTIMO - " + data[data.length - 1]);

            // Verifica se a sessão está vazia e caso esteja atribui à mesma, a data mais recente
            if (global.session.ultimaEntrada == undefined) {
                global.session.ultimaEntrada = data[data.length - 1];
            }
            // Caso a última data seja mais recente que a que está guardada na sessão, esta é substituida
            else if (global.session.ultimaEntrada < data[data.length - 1]) {
                global.session.ultimaEntrada = data[data.length - 1];

                // Procura pelo arduino que tem a data mais recente
                Arduino.find({ created_at: data[data.length - 1] }, function(err, user) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var count = 0;
                        //var count2 = 0;

                        var limite = 0;
                        //var limit2 = 0;

                        // Verifica a qual o seu mac address
                        for (var x in user) {
                            //console.log("O PARQUE É O - " + user[x].ident);
                            macAddress = user[x].macAddress;
                            action = user[x].action;
                        }

                        // Procura pelas entradas dadas no parque de estacionamento
                        Parques.find({ macAddress: macAddress }, function(err, result) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                // Percorre o resultado e conta o numero de carros que estao estacionados em cada parque, assim como o limite de cada um
                                for (var y in result) {
                                    // console.log("Resultado - " + result[y].numIdent);
                                    // if (result[y].numIdent == 1) {
                                    //     count1++;
                                    //     limit1 = result[y].limit;
                                    // }
                                    // else {
                                    //     count2++;
                                    //     limit2 = result[y].limit;
                                    // }

                                    count++;
                                    console.log("Numero de carros já estacionados - " + count);
                                }

                                //console.log("Limite 1 - " + limit1);
                                //console.log("Limite 2 - " + limit2);
                                console.log("Count1 - " + count);
                                //console.log("Count2 - " + count2);

                                Estacionamento.find({ arduino: macAddress }, function(err, arduino) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {

                                        for (var z in arduino) {
                                            limite = arduino[z].limit;
                                        }
                                        console.log("LIMITE - " + limite);

                                        if (action == "in") {
                                            // Se for o parque1 e se o número de carros estacionados for inferior ao seu limite então é guardada a inserção na base de dados
                                            if (count < limite) {
                                                const parque = new Parques({
                                                    macAddress: macAddress,
                                                })

                                                parque.save(function(err, task) {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    else {
                                                        //res.send(task);
                                                        console.log("Parque saved sucessfully!")
                                                    }
                                                })
                                            }
                                            else {
                                                // Caso contrário, significa que o parque está cheio
                                                console.log("O parque já está cheio");
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
            }
            else {
                // Caso contrário, não muda nada
                console.log("Esta foi a ultima data");
            }
            console.log("session - " + global.session.ultimaEntrada);
        }
    })
}

// Função que retorna o número de carros disponívies num determinado parque
function getCars(req, res) {
    var count = 0;

    var limite = 0;

    var conta = 0;

    var disponiveis = 0;

    // Procura na base de dados, pelo id do parque que é passado no url da rota
    Parques.find({ macAddress: req.params.macAddress }, function(err, cars) {
        if (err) {
            console.log(err)
        }
        else {
            // Se não exitirem registos de entradas nesse parque, é mostrada uma mensagem a dizer que o parque está vazio
            if (cars == 0) {
                return res.status(500).send("Não existem carros neste parque.")
            }
            else { // Caso contrário é calculado o número de lugares disponíveis no parque em questão

                Estacionamento.find({ arduino: req.params.macAddress }, function(err, arduino) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        for (var x in arduino) {
                            limite = arduino[x].limit;
                            console.log("PReto - " + limite);
                        }

                        for (var x in cars) {
                            count++;
                            console.log("cars - " + count);
                        }
                        console.log("Branco - " + limite);
                        conta = count - limite;

                        disponiveis = -conta;

                        console.log("Ocupados - " + count);
                        console.log("Disponiveis - " + disponiveis);

                        return res.status(200).send("Existem " + disponiveis + " lugares disponíveis num máximo de " + limite + ".");
                    }
                })
            }
        }
    })
}

//require('../model/arduinoSaida');
//const ArduinoSaida = mongoose.model('arduinoSaida');

var tempoSaida = setInterval(deleteCar, 8000);

// Função que apaga uma entrada feita num determinado parque quando é inserido uma linha na "Collection" referente à saída dos carros
function deleteCar(req, res) {

    var data = [];

    var macAddress = "";

    var action = "";

    // É procurado na base de dados pelas datas das saídas dos carros
    Arduino.find({}, 'created_at -_id', function(err, result) {
        if (err) {
            console.log(err);
        }
        else {
            // É guardado num array as datas encontradas
            for (var x in result) {
                //console.log("resultadoSaida - " + result[x].created_at);

                data.push(result[x].created_at)
            }

            //console.log("ULTIMOsaida - " + data[data.length - 1]);

            // Caso a variável da sessão que contém a data do último carro que saiu estiver vazia, então é lhe atribuida a data mais recente encontrada na base de dados
            if (global.session.ultimaSaida == undefined) {
                global.session.ultimaSaida = data[data.length - 1];
            }
            else if (global.session.ultimaSaida < data[data.length - 1]) { // Se houver na base de dados uma data mais recente que a guardada na sessão, então esta é substituida
                global.session.ultimaSaida = data[data.length - 1];

                // É procurado o objeto com a data mais recente na "Collection" das saídas
                Arduino.find({ created_at: data[data.length - 1] }, function(err, user) {
                    if (err) {
                        console.log(err);
                    }
                    else { // O objeto é percorrido e é guardada numa variável a indentidade do parque a que este corresponde
                        for (var x in user) {
                            //console.log("O PARQUE É O - " + user[x].ident);
                            macAddress = user[x].macAddress;
                            action = user[x].action;
                        }

                        //console.log("IDENTIDADE - " + ident);

                        if (action == "out") {
                            // Na "Collection" dos parques é procurado por um objeto que contenha a mesma identidade guardada na variável referida anteriormente e é apagado
                            Parques.findOneAndRemove({ macAddress: macAddress }, function(err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    //return res.status(500).send('Um carro saiu do parque de estacionamento!');
                                    console.log('Um carro saiu do parque de estacionamento!');
                                }
                            })
                        }
                    }
                })
            }
            else { // Se nenhuma data se alterar, a sessão mantém-se
                //console.log("Esta foi a ultima data");
            }


            //console.log("session - " + global.session.ultimaSaida);
        }
    })
}

module.exports = {
    addCar: addCar,
    getCars: getCars,
    deleteCar: deleteCar
}
