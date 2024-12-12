const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app); // Cria o servidor HTTP

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Cria o servidor WebSocket utilizando o servidor HTTP
const wss = new WebSocket.Server({ server });

console.log('Servidor rodando em http://localhost:3000');

wss.on('connection', (ws) => {
    console.log('Novo cliente conectado.');

    // Receber mensagens do cliente
    ws.on('message', (message) => {
        const data = JSON.parse(message); // Parse da mensagem recebida
        console.log(`${data.user}: ${data.message}`);

        // Enviar a mensagem para todos os clientes conectados
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data)); // Envia para todos
            }
        });
    });

    // Evento de desconexão
    ws.on('close', () => {
        console.log('Cliente desconectado.');
    });
});

// Inicia o servidor HTTP na porta 3000
server.listen(3000, () => {
    console.log('Servidor WebSocket rodando na porta 3000');
});
