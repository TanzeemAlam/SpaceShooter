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
	speed: 1,
	//sprite: Sprite("player"),
	
	
	draw_player: function(){
	
		ctx.fillSytle = this.color;
	
		ctx.fillRect(this.x,this.y,this.width,this.height);
		
		//this.sprite.draw(ctx, this.x, this.y);
		
	},

	update_player: function() {
		
		//Binding the keys using jquery

		$(document).keydown(function(e) {
    			switch(e.which) {
				case 37: //left
					//if(player.x > 0)
					player.x -= player.speed;
					break;

				//case 38: // up
				//	player.y -= player.speed;
				//	break;
		
				case 39: // right
					//if(player.x < canvas.width - player.width)
					player.x += player.speed;
					break;

				//case 40: // down
				//	player.y += player.speed;
				//	break;
				
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

//midpoint function
player.midpoint = function() {

	return {
		x: this.x + this.width/2,
		y: this.y + this.height/2
	};
};

//Shoot function
player.shoot = function() {
		
		var bulletPosition = this.midpoint();
		
		playerBullets.push(Bullet({
			speed: 5,
			x: bulletPosition.x,
			y: bulletPosition.y
		}));		

		//To set a random alert
		//window.alert("Pew pew");
		//To set the timeout interval
		//window.setTimeout(shoot,1000);
		
};

//Loading and drawing images
//player.sprite = Sprite("player");

//player.draw = function() {
//	this.sprite.draw(ctx, this.x, this.y);
//};


//Creating Bullets
function Bullet(I){
	I.active = true;
	I.xVelocity = 0;
	I.yVelocity = -I.speed;
	I.width = 3;
	I.height = 3;
	I.color = "#000";
	
	I.inBounds = function() {
		
		return I.x >= 0  && I.x <= canvas.width && I.y >= 0 && I.y <= canvas.height;
	};

	I.draw = function() {

		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};

	I.update = function() {

		I.x += I.xVelocity;
		I.y += I.yVelocity;
	
		I.active = I.active && I.inBounds();
	};	

	return I;
};


//Creating enemies
var enemies = [];

function Enemy(I) {
	I = I || {};
	I.active = true;
	I.age = Math.floor(Math.random() * 128);
	I.color = "#A2B";
	I.x = canvas.width/4 + Math.random() * canvas.width/2;
	I.y = 0;
	I.xVelocity = 0;
	I.yVelocity = 2;
	I.width = 32;
	I.heigth = 32;

	I.sprite = Sprite("enemy");
	
	I.inBounds = function() {

		return I.x >= 0 && I.x <= canvas.width && I.y >= 0 && I.y <= canvas.height;
	};

	I.draw = function() {

		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);

		this.sprite.draw(ctx, this.x, this.y);
	};

	I.update = function() {

		I.x += I.xVelocity;
		I.y += I.yVelocity;
		
		I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);

		I.age++;

		I.active = I.active && I.inBounds();
	};

	return I;
};

//For collision detection
//Player->Bullets
//Player->Enemy
function collides(a,b){
	
	return a.x < b.x + b.width && 
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y;
}


//Function to update the axis/positon
function update(){
	
	textX += 1;

	textY += 1;
	
	//Calling the update function in player
	player.update_player();

	//updating the bullets
	playerBullets.forEach(function(bullet) {
		bullet.update();
	});

	//filtering the bullets that are not collided and within canvas
	playerBullets = playerBullets.filter(function(bullet) {
		return bullet.active;
	});

	//updating the enemies
	enemies.forEach(function(enemy) {
		enemy.update();
	});

	//filtering the enemies that are not collided and within canvas
	enemies = enemies.filter(function(enemy) {
		return enemy.active;
	});

	//Pushing new enemies if almost all enemies are dead
	if(Math.random() < 0.1) {
		enemies.push(Enemy());
	}

}

//Function to draw the item
function draw(){
	
	ctx.clearRect(0,0,canvas.width,canvas.height);	//To clear the canvas

	ctx.fillStyle = "#000000"; //Set color to black

	//ctx.fillText("Sup Bro!", textX,textY);
	
	//Calling the draw function in player
	player.draw_player();

	//Drawing the bullets on shoot function
	playerBullets.forEach(function(bullet) {
		bullet.draw();
	});
	
	//Drawing the enemies
	enemies.forEach(function(enemy) {
		enemy.draw();
	});	

}





	





