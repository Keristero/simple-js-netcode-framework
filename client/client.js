let joNetClient = new JoNetClient
let canvas = document.getElementById('can_main')
let ctx = canvas.getContext('2d');

function Draw(){
    joNetClient.currentInstance.Draw(ctx)
    window.requestAnimationFrame(Draw)
}

window.requestAnimationFrame(Draw)

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth;
}

window.onresize = resizeCanvas
resizeCanvas()