# socket-link

With the objective of understanding the very basics of TCP prior to understanding HTTP from the ground up, there are two simple application with two files each that implement a client–server architecture. Thanks to the `net` module from Node.js, multiple clients can send messages over the socket stream where they buffer chunks of information.

## Chat

### Client 1
<img width="595" height="259" alt="socket-1" src="https://github.com/user-attachments/assets/fc527818-bc23-4acf-b3ff-1007c6211292" />

### Client 2
<img width="595" height="259" alt="socket-2" src="https://github.com/user-attachments/assets/2962a941-79c9-4bb2-90a7-609ed22168eb" />

For the **chat**, the communication follows a **specific structure** (like protocols do) shared by both parties in order to understand the information, in this case is something as simple as an `id`, a `message`, and a `DIVIDER` which will help to set the boundaries between the contents. The server will respond with a complete message in this case, letting the client manage only the local time. Thes server also gives the option to close the connection from the client and a basic broadcast for any event such a message, new connection, and disconnection.

## File uploader

### Client 
<img width="595" height="259" alt="Screenshot From 2025-10-19 02-35-17" src="https://github.com/user-attachments/assets/ebaf4af8-5ab0-4475-ab27-4fd98f57a140" />

For the **file uploader**, it focuses on managing the stream of large files over TCP. When the writable stream's internal buffer reaches its **highWaterMark** value, it will apply **backpressure** to pause and resume the data flow dynamically (`pause` and `drain` events). This explores the coordination for both parties within TCP communication since it needs to manage the state from 4 streams flows: reading from the client, writing on the socket's stream, reading from the socket's stream, and then writing the data from the buffers to the internal server's storage. All of them happen at the same time. The client will need to specify the path of the resource that it will upload to the server in the first argument.

## Initialization

To run this project locally:

1. **Clone the repository**

```bash
git clone https://github.com/As71er/socket-link.git
```

2. **Navigate to the project directory**

```bash
cd socket-link
```

3. **Initiate server and client(s) with Node.js**

Navigate to either the **chat-app** or **uploader** folder. The initialization process is the same for both:

```bash
node server.js
```
```bash
node client.js
```

For the **uploader**, you need to specify the path of the resource when initiating the client:

```bash
node client.js [path]
```
