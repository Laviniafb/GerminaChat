const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

const clients = new Map();
const history = [];

server.on('connection', (ws) => {
    console.log('Cliente conectado');

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'name') {
            const userInfo = { name: data.name, connectedAt: Date.now() };
            clients.set(ws, userInfo);

            if (data.showHistory) {
                history.forEach((msg) => ws.send(JSON.stringify({ message: msg, type: 'message' })));
            }

            broadcast(`${data.name} entrou no chat.`, 'enter', ws);
            updateUserList();
        } else if (data.type === 'message') {
            const senderInfo = clients.get(ws);
            const formattedMessage = `${senderInfo.name}: ${data.message}`;
            history.push(formattedMessage);
            broadcast(formattedMessage, 'message', ws);
        } else if (data.type === 'private') {
            const senderInfo = clients.get(ws);
            const targetClient = Array.from(clients.entries()).find(
                ([, userInfo]) => userInfo.name === data.target
            )?.[0];

            if (targetClient) {
                const privateMessage = `(Mensagem privada de ${senderInfo.name}): ${data.message}`;

                ws.send(JSON.stringify({ message: privateMessage, type: 'private' }));
                targetClient.send(JSON.stringify({ message: privateMessage, type: 'private' }));
            } else {
                ws.send(JSON.stringify({ message: `Usuário ${data.target} não encontrado.`, type: 'error' }));
            }
        } else if (data.type === 'typing') {
            broadcast(`${data.user} está digitando...`, 'typing', ws);
        } else if (data.type === 'stopTyping') {
            broadcast('', 'stopTyping', ws);
        }
    });

    ws.on('close', () => {
        const userInfo = clients.get(ws);
        const name = userInfo ? userInfo.name : 'Anônimo';
        clients.delete(ws);

        broadcast(`${name} saiu do chat.`, 'exit', ws);
        updateUserList();
        console.log(`${name} desconectado`);
    });
});

function broadcast(message, type, sender) {
    server.clients.forEach((client) => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ message, type }));
        }
    });
}

function updateUserList() {
    const users = Array.from(clients.values()).map((userInfo) => {
        const timeOnline = Math.floor((Date.now() - userInfo.connectedAt) / 1000);
        return {
            name: userInfo.name,
            timeOnline
        };
    });

    server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'userList', users }));
        }
    });
}
