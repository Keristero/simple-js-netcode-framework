# Simple JS netcode framework
The objective of this is to create the easiest to use js netcode solution, even if it may not perform the best.

Features:
* __State tree__, put all of the app state you want to share in JoNetInstance.state.world
when a client connects, they get the full tree.
* __State updates__, at a set interval every client receives all the changes in state since the last state update.
* __Binary messaging__, uses webpack to serialize and deserialize state for smaller messages and faster encode / decode than json.
* __Serverside Keyboard__, the server has the state of each client's keyboard, so it can process their inputs.
* __Code sharing__, Write the game logic once for the server and clientside simulations... in theory.

### Architecture
![Bad diagram showing architecture](./archy.png)

## How to use / things to note
1. Install dependencies with `npm install`, and start with `node main.js`
2. everything in the _client_ folder is served.
3. Both the server and client use stuff in the _shared_ folder
4. The idea is you should just make your own extension of _JoNetInstance.js_ see _JoNetInstanceTest.js_ as an example.
5. Classes are not serialzed, only the data will be intact, so if you want to use OOP, make all of your class methods static and use the heirarchy of the state tree to infer classes (_see Vehicle in JoNetInstanceTest.js for example_)



##todo
* Serverside Mouse
* Re enable state prediction, it is off currently because it without interpolation, clients with any lag will rubber band a lot.
* Actually make a game using this to see if it is any good.
* Maybe extend the syncing to allow some objects to use client side prediction, while others dont.
* Add a simple event system
* Re enable user input broadcasts (currently disabled because we are not doing client side prediction anyway)
* Use WebRTC instead of socket.io
* Add P2P networking using [WebRTC](https://webrtc.org/ "WebRTC")
* Serverside input manager to replace mouse + keyboard system and support gamepads
