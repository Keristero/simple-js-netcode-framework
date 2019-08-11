const ObservableSlim = require("observable-slim")
const JoNetInstanceTest = require('./shared/JoNetInstanceTest.js')
const JSONpack = require('jsonpack');

/**
 * 
 * @param {object} root the object you want to set a value inside
 * @param {string} path the path at which you want to set the value, dot separated eg:"nested1.nested2.person.name"
 * @param {any} value the value you want to set to eg:"Dave"
 */
function setValueInTree(root,path,value){
    let props = path.split('.');
    let pointer = root
    props.forEach((propName,index)=>{
        if(index == props.length-1){
            pointer[propName] = value
            //console.log("set value of pointer to ",value)
            return
        }
        if(pointer[propName] == undefined){
            pointer[propName] = {}
            //console.log("created prop",propName)
        }
        pointer = pointer[propName]
        //console.log("Set pointer to",propName)
    })
}

class JoNetServer{
    constructor(io){
        this.io = io
        this.sockets = {}
        this.broadcastKeypresses = false

        /*
        every socket io message should specify binary(false) for increased performance
        */

        //When a new user connects
        this.io.on('connection', (socket) => {
            //create a new user and add it to the server instance
            let user = this.currentInstance.AddUser(socket.id)
            console.log('user',user)

            //serialize state
            let packedState = JSONpack.pack({state:this.currentInstance.state})

            //Send full state to new user
            socket.binary(true).emit('fullState',packedState)

            //add input handlers
            socket.on('keydown',(key)=>{
                this.currentInstance.SetUserInputValue(user.socketID,key,true)
                //Broadcast keydown event to all clients except the one that triggered it
                if(this.broadcastKeypresses){
                    socket.broadcast.binary(false).emit('keydown',{key:key,socketID:socket.id})
                }
            })
            socket.on('keyup',(key)=>{
                this.currentInstance.SetUserInputValue(user.socketID,key,false)
                //Broadcast keyup event to all clients except the one that triggered it
                if(this.broadcastKeypresses){
                    socket.broadcast.binary(false).emit('keyup',{key:key,socketID:socket.id})
                }
            })

            //add disconnection handler
            socket.on('disconnect', (reason) => {
                this.currentInstance.RemoveUser(socket.id)
                socket.removeAllListeners()
            })

        });
    }
    Start(){
        this.currentInstance = new JoNetInstanceTest();
        //Copy the constructed state, store as private variable
        this._state = JSON.parse(JSON.stringify(this.currentInstance.state));

        //Set up proxy which records state changes between each BroadcastStateUpdate
        this.changedValuesSinceLastTime = {modified:{},removed:{}}
        this.currentInstance.state = ObservableSlim.create(this._state, true, (changes)=>{
            //Whenever changes are made to this.state, record them in this.changedValuesSinceLastTime
            changes.forEach((change)=>{
                if(change.type == "update"){
                    setValueInTree(this.changedValuesSinceLastTime.modified,change.currentPath,change.newValue)
                }else if(change.type == "delete"){
                    setValueInTree(this.changedValuesSinceLastTime.removed,change.currentPath,"deleted")
                }else if(change.type == "add"){
                    setValueInTree(this.changedValuesSinceLastTime.modified,change.currentPath,change.newValue)
                }
            })
        });
        
        this.updateInterval = setInterval(()=>{
            this.currentInstance.Update()
            if(this.currentInstance.state.world.tic % 1 == 0){
                this.BroadcastStateUpdate();
            }
        },this.currentInstance.updateIntervalDelay)
    }
    BroadcastStateUpdate(){
        //Every 10 game tics broadcast server state changes.
        
        //pack state update
        let packedUpdate = JSONpack.pack({
            modified:this.changedValuesSinceLastTime.modified,
            removed:this.changedValuesSinceLastTime.removed
        })

        this.io.binary(true).emit("stateUpdate",packedUpdate)

        //console.log(this.changedValuesSinceLastTime)
        this.changedValuesSinceLastTime = {modified:{},removed:{}}
    }
}

module.exports = JoNetServer