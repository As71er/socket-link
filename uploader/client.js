const net = require("net");
const fs = require("fs/promises");
const path = require("path");
const { moveCursor, clearLine } = require("../utils/terminal");

const PORT = 8080;
const HOST = "::";

const socket = net.createConnection({port: PORT, host: HOST}, async () => {
    const filePath = process.argv[2];
    const fileName = path.basename(filePath);
    const fileHandler = await fs.open(filePath, "r");
    const fileStream = fileHandler.createReadStream();

    const fileSize = (await fileHandler.stat()).size;

    let uploadedPercentage = 0;
    let bytesUploaded = 0;

 
    const MB = 1024 * 1024;
    //console.log(fileName);
    console.log("File size:", (fileSize / MB).toFixed(2), "MB");
    console.log(); // Just to avoid clearing the command line for the %

    socket.write(fileName);

    fileStream.on("data", async (data) => {
        const isBufferFull = !socket.write(data);
            
        if (isBufferFull) {
            fileStream.pause();
        }

        // Size of the buffer
        bytesUploaded += data.length;
        let newPercentage = Math.floor((bytesUploaded / fileSize) * 100);

        if (newPercentage !== uploadedPercentage && newPercentage % 5 == 0) {
            uploadedPercentage = newPercentage;
            
            await moveCursor(0, -1);
            await clearLine(0);

            console.log(`Uploading... ${uploadedPercentage}%`);
        }
    });

    // When the internal buffer of the socket is drained when the OS does it (thanks to libuv)
    // it's safe to resume
    socket.on("drain", () => {
        fileStream.resume();
    });

    fileStream.on("end", () => {
        console.log("File successfully uploaded :)");
        socket.end();
    });
});