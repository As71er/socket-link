# socket-link

Understanding part of TCP, there are two applications that implement a client–server architecture. The idea is to have multiple clients which send messages over a socket stream where they buffer chunks of information for two scenarios.

## Chat

The communication follows a specific structure (like protocols do) shared by both parties in order to understand the information, in this case composed of an `id`, a `message`, and a `DIVIDER` which helps to set the boundaries between the contents. The server gives the option to close the connection from the client and to broadcast any event such as a **message**, **new connection**, and **disconnection** to other clients.

**Client 1**
<p align="center">
  <img width="425" height="185" alt="client 1 view" src="https://github.com/user-attachments/assets/87b87bea-7f66-476d-8a96-f1f5ce2ef4d7" />
</p>

**Client 2**
<p align="center">
  <img width="425" height="185" alt="client 2 view" src="https://github.com/user-attachments/assets/9e543e77-78d3-4247-90d9-19d24c03a00e" />
</p>

## File uploader

It focuses on managing the stream of large files over TCP. When the writable stream's internal buffer reaches its **highWaterMark** value, it will apply **backpressure** to pause and resume the data flow (`pause` and `drain` events). So it ultimately represents a flow where the client selects a resource (by specifying the path) that it will upload to the server in the first argument, and the server reads that data so it can write it to its internal storage.

<p align="center">
  <img width="436" height="148" alt="uploader view" src="https://github.com/user-attachments/assets/24372343-c908-4e47-9a5e-209596d22dac" />
</p>
