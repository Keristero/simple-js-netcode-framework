class JoNetClient{
    constructor(){
        this.clientSizePrediction = false
        this.latency = 0
        // @ts-ignore
        this.currentInstance = new JoNetInstanceTest();
        this.joInput = new JoInputManager(this);
        // @ts-ignore
        this.socket = io();

        this.socket.on('connect', () => {
            console.log(`socket.io connected as ${this.socket.id}`)
            this.Start()
        });

        /*to trigger this pong event, on server
        var io = require('socket.io')(server, {pingInterval: 5000});
        */
        this.socket.on('pong', function(ms) {
            this.latency = ms;
            console.log(`ping ${this.latency}`);
        });

        //Processing of other client's input events
        this.socket.on('keydown',(data)=>{
            console.log(data)
            this.currentInstance.SetUserInputValue(data.socketID,data.key,true)
        })
        this.socket.on('keyup',(data)=>{
            console.log(data)
            this.currentInstance.SetUserInputValue(data.socketID,data.key,false)
        })

        this.socket.on('fullState', (data)=>{
            //unpack state
            let unpackedData = jsonpack.unpack(data)
            this.currentInstance.state = unpackedData.state
            console.log(data.state);
        });

        this.socket.on('stateUpdate',(data)=>{
            //unpack state
            let unpackedData = jsonpack.unpack(data)
            //console.log(data.state)
            mergeDeep(this.currentInstance.state,unpackedData.modified)
            removePropertiesFromTree(this.currentInstance.state,unpackedData.removed)
        });
    }
    Start(){
        if(this.clientSizePrediction){
            this.updateInterval = setInterval(()=>{
                this.currentInstance.Update()
            },this.currentInstance.updateIntervalDelay)
        }
    }
}

class JoInputManager{
    constructor(joNetClient){
        this.client = joNetClient
        this.keyDownListener = window.addEventListener('keydown',(event)=>{
            let key = event.key
            //If this user is connected
            if(this.client.socket.id != null){
                let user = this.client.currentInstance.GetUserBySocketID(this.client.socket.id)
                if(user.inputs[key] != true){
                    this.client.currentInstance.SetUserInputValue(this.client.socket.id,key,true)
                    this.client.socket.binary(false).emit('keydown',event.key)
                }
            }
        })
        this.keyUpListener = window.addEventListener('keyup',(event)=>{
            let key = event.key
            //If this user is connected
            if(this.client.socket.id != null){
                let user = this.client.currentInstance.GetUserBySocketID(this.client.socket.id)
                if(user.inputs[key] != false){
                    this.client.currentInstance.SetUserInputValue(this.client.socket.id,key,false)
                    this.client.socket.binary(false).emit('keyup',event.key)
                }
            }
        })
    }
    HandleKeyEvent(event,down){

    }
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]){
                    target[key] = {};
                }
                mergeDeep(target[key], source[key]);
            } else {
                target[key] = source[key]
            }
        }
    }
    return mergeDeep(target, ...sources);
}

function removePropertiesFromTree(target,delTree){
    for(let delPropName in delTree){
        if(target[delPropName]){
            if(delTree[delPropName] == "deleted"){
                delete target[delPropName]
            }else{
                removePropertiesFromTree(target[delPropName],delTree[delPropName])
            }
        }
    }
}