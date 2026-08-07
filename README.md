# socket-link

Understanding part of TCP, there are two applications that implement a client–server architecture. The idea is to have multiple clients which send messages over a socket stream where they buffer chunks of information for two scenarios.

## Chat

The communication follows a specific structure (like protocols do) shared by both parties in order to understand the information, in this case composed of an `id`, a `message`, and a `DIVIDER` which helps to set the boundaries between the contents. The server gives the option to close the connection from the client and to broadcast any event such as a **message**, **new connection**, and **disconnection** to other clients.

## File uploader

It focuses on managing the stream of large files over TCP. When the writable stream's internal buffer reaches its **highWaterMark** value, it will apply **backpressure** to pause and resume the data flow (`pause` and `drain` events). So it ultimately represents a flow where the client selects a resource (by specifying the path) that it will upload to the server in the first argument, and the server reads that data so it can write it to its internal storage.
