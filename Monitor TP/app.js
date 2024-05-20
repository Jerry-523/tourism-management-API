// Importação de módulos
const express = require('express')
const valid = require('card-validator')
const http = require('http')
const axios = require('axios')
var validator = require('email-validator')
const {phone} = require('phone')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json()) // configura o aplicativo para usar body-parser para processar JSON.

app.post('/transaction', (req, res) => {
    console.log(req.body) // Recebe uma requisição para processar uma transação.

    // Valida os campos enviados no corpo da requisição
    Object.keys(req.body).forEach(key => { // faz iteração nos campos
        if (typeof req.body[key] === "string" && req.body[key].trim() === "") {
            res.statusCode = 406 //Not Acceptable
            return res.json({"text": "missing fields"})
        }
        if (key === "name") {
            var hasNumber = /\d/
            if(hasNumber.test(req.body[key])) { // retorna true se o nome conter numeros
                res.statusCode = 406
                return res.json({"text": "error: invalid name"})
            }
        }
        if (key === "email") {
            if(!validator.validate(req.body[key])) {
                res.statusCode = 406
                return res.send("error: invalid email")
            }
        }
        if (key === "phone_number") {
            let phoneData = phone(req.body[key])
            if (!phoneData.isValid) {
                res.statusCode = 406
                return res.send("error: invalid phone number")
            }
        }
    })

    if (req.body.card) {
        Object.keys(req.body.card).forEach(key => {
            if (key === "date") {
                if (req.body.card[key].includes('/')) {
                    const validation = req.body.card[key].split('/')
                    for (let i = 0; i < validation.length; i++) {
                        let value = parseInt(validation[i])
                        if (typeof value === "number") {
                            if (validation.length < 2 || validation.length > 2) {
                                res.statusCode = 406
                                return res.send("error: wrong validation date")
                            }
                        } else {
                            res.statusCode = 406
                            return res.send("error: wrong validation date")
                        }
                    }
                } else {
                    res.statusCode = 403
                    return res.send("error: invalid operation")
                }
            }
            if (key === "number") {
                const numericInput = req.body.card[key].replace(/\D/g, '') // remove todos os caracteres nao numericos do input string
                const int = parseInt(numericInput)

                var numberValid = valid.number(int)
                if (!numberValid.isValid) {
                    res.statusCode = 406
                    return res.send("error: card invalid")
                }
            }
            if (key === "security") {
                const securityCode = req.body.card[key]
                var isDigit = /^\d+$/

                if (typeof securityCode  === "string" && securityCode.length === 3) {
                    if (!isDigit.test(securityCode)) {
                        res.statusCode = 406
                        return res.send("error: invalid security code")
                    }
                } else {
                    res.statusCode = 406
                    return res.send("error: invalid security code")
                }    
            }
            if (key === "name") {
                var hasNumber = /\d/
                if(hasNumber.test(req.body.card[key])) { // retorna true se a string conter numero
                    res.statusCode = 406
                    return res.send("error: invalid card name")
                }
            }
        }) 
    }
    
    // Se a escolha de reserva for "Hotel", envia uma solicitação POST para um servidor remoto para criar uma reserva.
    var post_data
    Object.keys(req.body).forEach(async key => {
        if (key === "reservationChoice" && req.body[key] === "Hotel") {
            let status = req.body.status = "ativa"
            post_data = {
                nome_cliente: req.body.name,
                email_cliente: req.body.email,
                telefone_cliente: req.body.phone_number,
                tipo_quarto: req.body.room,
                check_in: req.body.check_in,
                check_out: req.body.check_out,
                status: status
            }
            const options1 = {
                host: "0.0.0.0",
                port: "8000",
                path: "/reserva/",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json' 
                }
            }
            const options2 = {
                host: "0.0.0.0",
                port: "8000",
                path: "/reservas/",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json' 
                }
            }

            const postData = `${JSON.stringify(post_data)}`

            async function makeRequestReservas() { 
                return new Promise((resolve, reject) => {
                    const post_req = http.request(options1, (response) => {
                        let statusCoder;
                        console.log(`Status code Reserva: ${response.statusCode}`);
                        statusCoder = response.statusCode;
                        resolve(statusCoder); // Resolve the promise with status code
                    });
            
                    post_req.on('error', (error) => { // in case of an error
                        console.log(`Error sending request: ${error.message}`);
                        reject(error); // Reject the promise with error
                    });
            
                    post_req.write(postData);
                    post_req.end();
                });
            }
            
            try {
                const statusCoder = await makeRequestReservas(); // Await the completion of makeRequestReservas
                if (statusCoder === 200) {
                    const post_req = http.request(options2, (response) => {
                        console.log(`Status code Reservas: ${response.statusCode}`);
            
                        let responseData = '';
                        response.on('data', (data) => { // listen on data
                            responseData += data;
                        });
            
                        response.on('end', () => {
                            if (response.statusCode === 200) {
                                res.send(responseData);
                            }
                        });
                    });
            
                    post_req.on('error', (error) => { // in case of an error
                        console.log(`Error sending request: ${error.message}`);
                    });
            
                    post_req.write(postData);
                    post_req.end();
                }
            } catch (error) {
                console.log(`Error in request: ${error.message}`);
            }
        } else if (key === "reservationChoice" && req.body[key] != "Hotel") {
            let profile = req.body.name.split(" ")
            post_data = {
                nome: profile[0],
                sobrenome: profile[profile.length - 1],
                email: req.body.email,
                telefone: req.body.phone_number
            }
           
            async function post() {
                // send HTTP POST request to Python Flask Server 
                const response = await axios.post('http://localhost:5000/adicionar_passageiro', post_data)
                    
                if (response.status === 200) {
                    res.send(response.data)
                } else {
                    console.log(response.status)
                    res.status(500).send('Internal Server Error')
                }
            }
            post()
        }
    })
})

app.get('/reservateroom', (req, res) => {
    const options = {
        host: "0.0.0.0",
        port: "8000",
        path: "/quartos-disponiveis/",
        method: "GET",
    }

    // get a HTTP GET request from Database Server 
    const get_req = http.request(options, (response) => {
        console.log(`\nStatus code: ${response.statusCode}`)

        response.on('data', (data) => { // collect the data from the response
            res.send(data)
        })
    })
    get_req.on('error', (error) => {
        console.log(`Error making HTTP request to other server: ${error.message}`)
    })
    get_req.end() // End the request to the other server
})

app.get('/showReservation', (req, res) => {
    const options = {
        host: "0.0.0.0",
        port: "8000",
        path: "/reservas/",
        method: "GET",
    }

    // get a HTTP GET request from Database Server 
    const get_req = http.request(options, (response) => {
        console.log(`\nStatus code: ${response.statusCode}`)

        response.on('data', (data) => { // collect the data from the response
            res.send(data)
        })
    })
    get_req.on('error', (error) => {
        console.log(`Error making HTTP request to other server: ${error.message}`)
    })
    get_req.end() // End the request to the other server
})

app.get('/showReservationtravel', (req, res) => {
    const options = {
        host: "127.0.0.1",
        port: "5000",
        path: "/listar_passageiros",
        method: "GET",
    }

    // get a HTTP GET request from Database Server 
    const get_req = http.request(options, (response) => {
        console.log(`\nStatus code: ${response.statusCode}`)

        response.on('data', (data) => { // collect the data from the response
            res.send(data)
        })
    })
    get_req.on('error', (error) => {
        console.log(`Error making HTTP request to other server: ${error.message}`)
    })
    get_req.end() // End the request to the other server
})

const server = http.createServer(app)
let port = 3001
const host = '127.0.0.1'

server.listen(port, host, () => {
    console.log(`Servidor a rodar em http://${host}:${port}/`)
})