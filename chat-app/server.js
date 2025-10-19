const net = require("net");

const PORT = 8000;
const HOST = "127.0.0.1"
const DIVIDER = "--"

const server = net.createServer();

const clients = [];

function broadcast(message) {
    clients.forEach((client) => client.socket.write(message));
}

function deleteSocket(socket) {
    const index = clients.findIndex((client) => client.socket === socket);
    if (index !== -1) clients.splice(index, 1);
}

//  Each socket has a single endpoint
server.on("connection", (socket) => {
    const now = new Date().toLocaleString();

    console.log(`[${now}] New connection detected.`);

    const clientId = clients.length + 1;

    broadcast(`[SERVER] User ${clientId} joined!`);

    socket.write(`id-${clientId}`);

    socket.on("data", (data) => {
        const dataStr = data.toString("utf-8");
        const dividerIndex = dataStr.indexOf(DIVIDER);
        const id = dataStr.substring(0, dividerIndex);
        const message = dataStr.substring(dividerIndex + DIVIDER.length);

        //console.log(message);

        // Clean exit from the client
        if (message === "/exit") {
            console.log(`[${now}] User ${id} requested disconnection.`);
            deleteSocket(socket);

            socket.end(() => {
                console.log(`[${now}] User ${id} have been disconnected.`);
            });

            return;
        }

        broadcast(` User ${id} > ${message}`);
    })

    socket.on("end", () => {
        broadcast(`[SERVER] User ${clientId} left.`);
    })

    socket.on("error", (error) => {
        //console.error(`\n\n[${now}] An error has occurred: error\n\n`);
        broadcast(`An error has occurred. User ${clientId}'s been disconnected`);
        deleteSocket(socket);
    });

    // New socket (client)
    clients.push({id: clientId.toString(), socket});
})

server.listen(PORT, HOST, () => {
    //console.log(`Server started at http://${HOST}:${PORT}...`);
    console.log("Server started at", server.address());

})