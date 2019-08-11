//Basic canvas drawing functions
function drawSquare(ctx, pos, size, lineWidth, fillColour, lineColour){
    ctx.fillStyle = 'rgba('+fillColour.r+','+fillColour.g+','+fillColour.b+','+fillColour.a+')';
    ctx.fillRect(pos.x,pos.y,size.x,size.y);
    ctx.strokeStyle = 'rgba('+lineColour.r+','+lineColour.g+','+lineColour.b+','+lineColour.a+')';
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(pos.x,pos.y,size.x,size.y);
}

function drawCircle(ctx, pos, radius, lineWidth, fillColour, lineColour){
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius,0,2*Math.PI,false);
    ctx.fillStyle = 'rgba('+fillColour.r+','+fillColour.g+','+fillColour.b+','+fillColour.a+')';
    ctx.fill();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = 'rgba('+lineColour.r+','+lineColour.g+','+lineColour.b+','+lineColour.a+')';
    ctx.stroke();
}

function drawLine(ctx, start, end, width, colour){
    ctx.strokeStyle = 'rgba('+colour.r+','+colour.g+','+colour.b+','+colour.a+')';
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(start.x,start.y);
    ctx.lineTo(end.x,end.y);
    ctx.stroke();
}

function drawLineFromAngle(ctx, start, angle, length, width, colour){
    var end = {x:start.x + length * Math.cos(Math.PI*(angle)/180),y:start.y + length * Math.sin(Math.PI*(angle)/180)};
    ctx.strokeStyle = 'rgba('+colour.r+','+colour.g+','+colour.b+','+colour.a+')';
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(start.x,start.y);
    ctx.lineTo(end.x,end.y);
    ctx.stroke();
}

function drawText(ctx,text,pos,size,colour){
    ctx.font = size+"px Arial";
    ctx.fillStyle = 'rgba('+colour.r+','+colour.g+','+colour.b+','+colour.a+')';
    ctx.fillText(text,pos.x+5,pos.y+size+5);
}

function drawRotatedImage(ctx, image, pos, size, angle) { 
	ctx.save(); 
	ctx.translate(pos.x, pos.y);
	ctx.rotate(angle);
	ctx.drawImage(image, -(size.x/2), -(size.y/2), size.x, size.y);
	ctx.restore(); 
}
