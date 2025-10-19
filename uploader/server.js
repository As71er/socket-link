const net = require("net");
const fs = require("fs/promises");

const PORT = 8080;
const HOST = "::";

const server = net.createServer();

server.on("connection", (socket) => {
    let fileHandler, fileStream;

    socket.on("data", async (data) => {        
        //console.log("Data received", data.toString());

        // Initial set up
        if (!fileHandler) {
            // Pause receiving data from client to set up writing stream
            socket.pause();

            const fileName = data.toString("utf-8");

            fileHandler = await fs.open(`./storage/${fileName}`, "w");
            fileStream = fileHandler.createWriteStream();

            // Now that it finished to write, resume the communication with socket
            socket.resume();

            // Define once the event that starts after buffer is emptied
            fileStream.on("drain", () => {
                socket.resume();
            });

            return;
        }

        const isBufferFull = !fileStream.write(data);

        // It's related to backpressure
        if(isBufferFull) {
            socket.pause();
        }
    });

    socket.on("end", () => {
        console.log("Task done. Closing handler server...");
        if (fileHandler) fileHandler.close();

        fileHandler = undefined;
        fileStream = undefined;

        console.log("Connection ended.");
    });
});

server.listen(PORT, HOST, () => {
    console.log("Uploader server listening on", server.address());
})
