//Creating a canvas

var canvas = document.getElementById("myCanvas");

var ctx = canvas.getContext("2d");

canvas.width = 500;

canvas.height = 500;


//Creating an interval
var FPS = 30;

setInterval(function() {

	update();

	draw();

}, 1000/FPS);

//Creating variables to hold axis/position
var textX = 50;
var textY = 50;

//Creating array to store bullets
var playerBullets = [];

//Creating a player
var player ={
	
	color:"#00A",
	x: 250,
	y: 500,
	width: 32,
	height: 32,
	
	draw_player: function(){
	
		ctx.fillSytle = this.color;
	
		ctx.fillRect(this.x,this.y,this.width,this.height);
	},

	update_player: function() {
		
		//Binding the keys using jquery

		$(document).keydown(function(e) {
    			switch(e.which) {
				case 37: //left
					player.x -= 1;
					break;

				case 38: // up
					player.y -= 1;
					break;
		
				case 39: // right
					player.x += 1;
					break;

				case 40: // down
					player.y += 1;
					break;
				
				case 32: //space
					player.shoot();
					break;

				default: return; // exit this handler for other keys
			    }
   			 e.preventDefault(); // prevent the default action (scroll / move caret)
		});
		
		//putting the player within canvas boundaries

		player.x = player.x.clamp(0, canvas.width - player.width);

		player.y = player.y.clamp(0, canvas.height - player.height);

		
	}	
	
	
};

//Function to update the axis/positon
function update(){
	
	textX += 1;

	textY += 1;
	
	//Calling the update function in player
	player.update_player();

}

//Function to draw the item
function draw(){
	
	ctx.clearRect(0,0,canvas.width,canvas.height);	//To clear the canvas

	ctx.fillStyle = "#000000"; //Set color to black

	ctx.fillText("Sup Bro!", textX,textY);
	
	//Calling the draw function in player
	player.draw_player();

	

}

//Shoot function

player.shoot = function() {
		
		//To set a random alert
		window.alert("Pew pew");
		//To set the timeout interval
		window.setTimeout(shoot,1000);
		
};

	





