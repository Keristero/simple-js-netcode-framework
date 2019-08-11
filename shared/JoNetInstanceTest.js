// @ts-nocheck
if(typeof serverside == "undefined"){
    JoNetInstance = require("./JoNetInstance.js")
}

class JoNetInstanceTest extends JoNetInstance{
    constructor(){
        super() 
        this.state.world.vehicles = {}
    }
    Update(){
        super.Update()
        for(let id in this.state.world.vehicles){
            let vehicle = this.state.world.vehicles[id]
            let user = this.GetUserBySocketID(id)
            Vehicle.Update(vehicle,user.inputs)
        }
    }
    Draw(ctx){
        ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
        for(let id in this.state.world.vehicles){
            let vehicle = this.state.world.vehicles[id]
            Vehicle.Draw(vehicle,ctx)
        }
    }
    AddUser(socketID, name = "Anonymous"){
        let user = super.AddUser(socketID,name)
        this.state.world.vehicles[socketID] = new Vehicle(socketID,100,100)
        return user
    }
    RemoveUser(socketID){
        super.RemoveUser(socketID)
        delete this.state.world.vehicles[socketID]
    }
}

class Vehicle{
    constructor(socketID,x,y){
        this.socketID = socketID
        this.width = 50;
        this.height = 100;
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.speed = 0;
    }
    static Draw(vehicle,ctx){
        let hw = (vehicle.width*0.5)
        let hh = (vehicle.height*0.5)
        let x = vehicle.x
        let y = vehicle.y

        ctx.save(); 
        ctx.translate(x, y);
        ctx.rotate(vehicle.angle);
        ctx.fillStyle = 'red'
        ctx.fillRect(-hw,-hh,vehicle.width,vehicle.height);
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2;
        ctx.strokeRect(-hw,-hh,vehicle.width,vehicle.height);
        ctx.restore();
    }
    static Update(vehicle,inputs){
        let angle = vehicle.angle - 1.5708
        let rotationSpeed = 0.1
        let accel = 2
        vehicle.speed *= 0.8
        if(inputs["w"]){
            vehicle.speed += accel
        }
        if(inputs["s"]){
            vehicle.speed -= accel
        }
        if(inputs["a"]){
            vehicle.angle -= rotationSpeed
        }
        if(inputs["d"]){
            vehicle.angle += rotationSpeed
        }
        vehicle.x += vehicle.speed * Math.cos(angle);
        vehicle.y += vehicle.speed * Math.sin(angle);
    }
}

module.exports = JoNetInstanceTest