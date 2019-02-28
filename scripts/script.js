//Creating a canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

var backgroundImage = new Image();
backgroundImage.src = "images/backgroundCanvas.png";


backgroundImage.onload = function() {
	ctx.drawImage(backgroundImage,0,0);
	ctx.font = "40pt Calibri";
	ctx.fillStyle = "white";
	ctx.fillText("Welcome",175,250);	
}


//explode image
const explodeImage = new Image();
explodeImage.src = "images/explodeImage.png";

//player image
const playerImage = new Image();
playerImage.src = "images/player.png";

//enemy image
const enemyImage = new Image();
enemyImage.src = "images/enemy.png";

//Math variable to increse number of enemies is score increases
var math = 0.04;

//Creating an interval
var FPS = 30;
setInterval(function() {

	ctx.drawImage(backgroundImage,0,0);
	
	//if(player.lives>0)
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
	lives:30,
	score:0,
	//sprite: Sprite("player"),
	
	
	draw_player: function(){
	
		//ctx.fillSytle = this.color;	
		//ctx.fillRect(this.x,this.y,this.width,this.height);		
		//this.sprite.draw(ctx, this.x, this.y);

		ctx.drawImage(playerImage, this.x, this.y, this.width, this.height);
		
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
		
		Sound.play("shoot");
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

//Creating Bullets
function Bullet(I){
	I.active = true;
	I.xVelocity = 0;
	I.yVelocity = -I.speed;
	I.width = 3;
	I.height = 3;
	I.color = "#FFF";
	
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
		
		//ctx.drawImage(enemyImage, this.x, this.y, this.width, this.height);
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

	I.explode = function() {
		Sound.play("explosion");
		setInterval(function() {
			ctx.drawImage(explodeImage,this.x,this.y, this.width, this.height);},3000);
		this.active = false;
	};

	return I;
};

player.explode = function() {

	console.log("In player explode function");
	//this.live--;

	alert("You just lost a life!");
};

//For collision detection
//Player->Bullets
//Player->Enemy
function collides(a,b){
	
	var x_axis = (a.x < (b.x + b.width)) && ((a.x + a.width) > b.x)		//Math.abs(a.x - b.x) <= Math.max(a.x, b.x);
	var y_axis = (a.y < (b.y + b.height)) && ((a.y + a.height) > b.y);	//Math.abs(a.y - b.y) <= Math.max(a.y,b.y);	
 
	return x_axis || y_axis;
}

//Function to handle collisions
function handleCollisions() {

	playerBullets.forEach(function(bullet) {
			
		enemies.forEach(function(enemy) {
			
			if(collides(bullet,enemy)) {
				player.score++;
				console.log("Score" + player.score);
				enemy.explode();
				bullet.active = false;
			}
		});
	});

	enemies.forEach(function(enemy) {

		if(collides(enemy,player)) {
			//To decrease the life of player whenever he collides with the enemy
			player.lives -= 1;			
			enemy.explode();
			player.explode();
		}
	});
}

//player explode function
player.explode = function() {
	this.active = false;
};

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

	//handling the collisions
	handleCollisions();

	//filtering the enemies that are not collided and within canvas
	enemies = enemies.filter(function(enemy) {
		return enemy.active;
	});

	//Pushing new enemies if almost all enemies are dead
	if(Math.random() < math) {
		enemies.push(Enemy());
	}
	
	if(player.lives < 0){
		alert("Game Over");
		window.location.reload();
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
	
	//Drawing the stages based on the score
	ctx.font = "20pt Calibri";
   	ctx.fillStyle = "white";
	if(player.score < 1000){
		ctx.fillText("Stage 1", 200, 25);
	}
	if(player.score > 1000 && player.score < 2000){
		ctx.fillText("Stage 2", 200, 25);
		math += 0.01;
	}
	else if(player.score > 2000 && player.score < 3000){
		ctx.fillText("Stage 3", 200, 25);
		math += 0.01;
	}
	else if(player.score > 3000 && player.score < 4000){
		ctx.fillText("Stage 4", 200, 25);
		math += 0.01;
	}
	else if(player.score > 4000 && player.score < 5000){
		ctx.fillText("Stage 5", 200, 25);
		math += 0.01;
	}
	else if(player.score > 5000){
		ctx.fillText("Higher Stages", 200, 25);
		math += 0.01;
	}
	
	//Keeping lives
	// keeping score
	ctx.font = "20pt Calibri";
	ctx.fillStyle = "white";
	ctx.fillText("Lives: ",10,25);
  	ctx.font = "20pt Calibri";
  	ctx.fillStyle = "white";
  	ctx.fillText(player.lives,80, 25);

	// keeping score
	ctx.font = "20pt Calibri";
	ctx.fillStyle = "white";
	ctx.fillText("Score: ",375,25);
  	ctx.font = "20pt Calibri";
  	ctx.fillStyle = "white";
  	ctx.fillText(player.score, 450, 25); 

}

