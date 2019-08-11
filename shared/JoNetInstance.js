var serverside = (module != undefined)
if(!serverside){
    var module = {}
}

class JoNetInstance{
    constructor(){
        //Settings
        this.updateIntervalDelay = 16

        //Initial state
        this.state = {
            world:{
                tic:0
            },
            users:{}
        }
    }
    GetUserBySocketID(socketID){
        let user = this.state.users[socketID]
        if(user){
            return user
        }
        console.warn(`user with socketID ${socketID} does not exist`)
        return null
    }
    Update(){
        this.state.world.tic++
    }
    SetUserInputValue(socketID,inputName,inputValue){
        let user = this.GetUserBySocketID(socketID)
        user.inputs[inputName] = inputValue
    }
    AddUser(socketID, name = "Anonymous"){
        let newUser = {socketID:socketID,name:name,inputs:{}}
        this.state.users[socketID] = newUser
        return newUser
    }
    RemoveUser(socketID){
        delete this.state.users[socketID]
    }
}

module.exports = JoNetInstance