const net = require("net");
const readline = require("readline/promises");
const { moveCursor, clearLine } = require("../utils/terminal");

const PORT = 8000;
const HOST = "127.0.0.1";
const DIVIDER = "--";

// Initiates the interface to get the data from console to node process
const rl = readline.createInterface({input: process.stdin, output: process.stdout});

let id;

const socket = net.createConnection({port: PORT, host: HOST}, () => {
    console.log("Connection initiated...");

    const ask = async () => {
        const message = await rl.question(">> ");
        
        // Avoid blank messages (spaces still can be sent)
        if (message !== '') {
            await moveCursor(0, -1);
            await clearLine(0);

            socket.write(`${id}${DIVIDER}${message}`);
        } else {
            ask();
        }
    }
    
    ask();

    socket.on("data", async (data) => {
        const dataStr = data.toString("utf-8");
        const headerId = dataStr.substring(0, 2)

        console.log(); // Make the clean line work as intended
        await moveCursor(0, -1);
        await clearLine(0);

        if(headerId === "id") {
            id = dataStr.substring(3);

            console.log(`Connected with ID: ${id}. Use '/exit' to disconnect.`);
        } else{
            // Client hour
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');

            console.log(`(${hours}:${minutes}) ${dataStr}`); 
        }

        ask();
    })

});

socket.on("end", () => {
    console.log("Connection ended or interrupted.");
    process.exit(0);
})