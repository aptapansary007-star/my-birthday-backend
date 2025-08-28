const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const server = new WebSocket.Server({ port: PORT });

let timer = 30;
let interval;

server.on('connection', (socket) => {
    console.log('New client connected!');
    socket.send(JSON.stringify({ type: 'timer', time: timer }));

    if (!interval) {
        interval = setInterval(() => {
            timer--;
            server.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'timer', time: timer }));
                }
            });
            if (timer <= 0) {
                server.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'message', text: '🎉 Happy Birthday! 🎉', playSound: true }));
                    }
                });
                timer = 30;
            }
        }, 1000);
    }

    socket.on('close', () => console.log('Client disconnected.'));
});

console.log(`WebSocket server running on port ${PORT}`);
