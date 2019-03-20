//Creating a canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

canvas.width=512;
canvas.height=480;

var score=0;
var FPS=30;
var level=1;
var var1=null;
var limit=0.05;
var life=0;
var var2=null;

//player image
const playerImage = new Image();
playerImage.src = "images/player.png";

//Game loop
var1 = setInterval(function() {
	
	draw();

	update();

}, 1000/FPS );



//Update function
function update(){
	/*
	//moving left
			if(keydown.left){
				player.x-=8;
			}
			
			//moving right
			if(keydown.right)
			{
				player.x+=8;
			}
			
			//for shooting
			if(keydown.space)
			{
				player.shoot();
			}
	*/
	$(document).keydown(function(e) {
    			switch(e.which) {
				case 37: //left
					//if(player.x > 0)
					player.x -= player.speed;
					break;

		
				case 39: // right
					//if(player.x < canvas.width - player.width)
					player.x += player.speed;
					break;
			
				case 32: //space
					player.shoot();
					break;

				default: return; // exit this handler for other keys
			    }
   			 e.preventDefault(); // prevent the default action (scroll / move caret)
		});
			
	//ensuring player doesn't move beyond the boundaries of canvas
	player.x=player.x.clamp(0,canvas.width-player.width);
	
	//for updating each bullet
	playerBullets.forEach(function(bullet){
		bullet.update();
	});
		
	//for filtering out the active bullets
	playerBullets=playerBullets.filter(function(bullet){
		return bullet.active;
	});
			
	//for updating each enemy1
	enemies.forEach(function(enemy){
		enemy.update();
	});
		
	//for filtering out the active enemy1
	enemies=enemies.filter(function(enemy){
		return enemy.active;
	});
			
	//for updating each enemy2
	enemies2.forEach(function(enemy2){
		enemy2.update();
	});
			
	//for filtering out the active enemy2
	enemies2=enemies2.filter(function(enemy2){
		return enemy2.active;
	});
			
	//for inserting enemy of type 1, it's rate is increased with increases in level
	if(Math.random()<limit){
		enemies.push(Enemy());
	}
			
	//insering enemy of type 2
	if(Math.random()<0.02){
		enemies2.push(Enemy2());
	}
			
	//handle any collision if happen
	handleCollisions();
					
}

//Draw function
function draw(){

	//for filling the score and level
	ctx.fillText("Score : ",320,20);
	ctx.fillText("Level : ",320,40);
		
	//Drawing the player
	player.draw();
			
	//drawing the bullet
	playerBullets.forEach(function(bullet){
		bullet.draw();
	});
			
	//drawing the enemy
	enemies.forEach(function(enemy){
		enemy.draw();
	});

	//drawing each and every active enemy 2
	enemies2.forEach(function(enemy2){
		enemy2.draw();
	});

			
	//updating the score
	ctx.font = "20px Arial";
	ctx.fillStyle = "white	";
	ctx.fillText(score,440,20);
	ctx.fillText(level,440,40);
}

//To check the game is over or not
function myStopFunction() {
	myVar2=setTimeout(function(){  clearInterval(var1);GameOver();}, 1000/8);
}


//When the game is over
function GameOver(){

	clearTimeout(var2);

	var background = new Image();
	background.src = "images/black.png";

	ctx.drawImage(background,0,0,canvas.width,canvas.height);

	ctx.font = "80px Comic Sans MS";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	
	ctx.fillText("Game Over", canvas.width/2, (canvas.height-80)/2);
	ctx.font = "40px Comic Sans MS";
	ctx.fillText("Score : ", 400/2, 512/2);
	ctx.fillText(score,700/2,512/2);
	ctx.font = "20px Comic Sans MS";
	ctx.fillText("Refresh the page to Start Again!", canvas.width/2, 420);
	
}



// for creating the player
var player={
	color:"#00A",
	x:256,
	y:350,
	width:20,
	height:20,

	draw: function(){
		ctx.drawImage(playerImage, this.x, this.y, this.width, this.height);	
	}
};
		
//variable to store bullets
var playerBullets=[];

//for handling the bullet
function Bullet(I){
	
	I.active=true;
	I.xVelocity=0;
	I.yVelocity=-I.speed;
	I.width=3;
	I.height=3;
	I.color="yellow";

	I.inBounds= function(){
		return I.x>=0 && I.x<=canvas.width && I.y>=0 && I.y<=canvas.height;
	};
			
	//for drawing the bullet
	I.draw= function(){
		ctx.fillStyle=this.color;
		ctx.fillRect(this.x,this.y,this.width,this.height);
	};
			
	//updates the position of bullet
	I.update= function(){
		I.x+=I.xVelocity;
		I.y+=I.yVelocity;
		I.active=I.active && I.inBounds();
	};
			
	return I;
}
		
//for shooting the bullet
player.shoot=function(){

	//console.log("Pew pew");
	Sound.play("shoot");

	var bulletPosition=this.midpoint();
		
	playerBullets.push(Bullet({
		speed:5,
		x: bulletPosition.x,
		y: bulletPosition.y
	}));
};	

player.midpoint=function(){

	return{
		x: this.x+this.width/2,
		y: this.y+this.height/2
	};
};
		

//for removing the player when it dies
player.explode=function(){
	this.active=false;
};

//to store the enemy
enemies=[];
		
//for handling the Enemy
function Enemy(I){
	
	I=I || {};
	I.active=true;
	I.pos=false;
	I.age=Math.floor(Math.random()*128);
	I.color="#A2B";
	I.x=canvas.width/4 + Math.random()*canvas.width/2;
	I.x=I.x.clamp(0,canvas.width-32);
	I.y=0;
	
	I.xVelocity=0;				
	I.yVelocity=level+1;
				
	I.explodeTime=0;
	
	I.width=32;
	I.height=32;
	I.inBounds= function(){
		return I.x>=0 && I.x<=canvas.width && I.y>=0 && I.y<=canvas.height;
	};
				
	I.sprite=Sprite("enemy");
	
	//for drawing the enemy 
	I.draw= function(){
					
		//drawing enemy when it is active
		if(I.explodeTime==0){
			this.sprite.draw(ctx,this.x,this.y);
		}
		
		//for drawing the explosion when enemy dies
		else{
			ctx.fillStyle="orangered";
			ctx.beginPath();
			ctx.arc(I.x,I.y,20,0,Math.PI*2,false);
			ctx.fill();
			ctx.fillStyle="salmon";
			ctx.beginPath();
			ctx.arc(I.x,I.y,15,0,Math.PI*2,false);
			ctx.fill();
			ctx.fillStyle="pink";
			ctx.beginPath();
			ctx.arc(I.x,I.y,10,0,Math.PI*2,false);
			ctx.fill();
			I.active=false;
		}
					
	};
			
	//for updating enemy position and speed at each frame
	I.update= function(){
		I.x+=I.xVelocity;
		I.y+=I.yVelocity;
		if(I.active==true && I.pos==false && I.y>=canvas.height-110){
			life++;
			I.pos=true;
		}
	
		I.xVelocity=3*Math.sin(I.age*Math.PI/64);
		I.age++;
					
		I.active=I.active && I.inBounds();
	};
				
	//for creating the explosion sound
	I.explode=function(){
		I.explodeTime=2;
		Sound.play("explosion");
		//this.active=false;
	};
				
	//increasing the spped of enemy when level is increased
	I.speed=function(){
		I.yVelocity+=1;
	}
	
	return I;
};

enemies2=[];		

//for handling the new enemy type
function Enemy2(I){
	
	I=I || {};
		
	I.active=true;
	
	I.pos=false;
	I.age=Math.floor(Math.random()*128);
	I.color="#A2B";
	I.x=canvas.width/4 + Math.random()*canvas.width/2;
	I.x=I.x.clamp(0,canvas.width-32);
	I.y=0;
	
	I.xVelocity=0;				
	I.yVelocity=level+1;
	
	I.explodeTime=0;
				
	I.width=32;
	I.height=32;
				
	I.inBounds= function(){
		return I.x>=0 && I.x<=canvas.width && I.y>=0 && I.y<=canvas.height;
	};
				
	I.sprite=Sprite("enemy1");
	
	//for drawing the new enemy
	I.draw= function(){
					
		//drawing new enemy when it is active
		if(I.explodeTime==0){
			this.sprite.draw(ctx,this.x,this.y);
		}
	
		//for creating the explosion when new enemy dies
		else{
			ctx.fillStyle="orangered";
			ctx.beginPath();
			ctx.arc(I.x,I.y,20,0,Math.PI*2,false);
			ctx.fill();
			ctx.fillStyle="salmon";
			ctx.beginPath();
			ctx.arc(I.x,I.y,15,0,Math.PI*2,false);
			ctx.fill();
			ctx.fillStyle="pink";
			ctx.beginPath();
			ctx.arc(I.x,I.y,10,0,Math.PI*2,false);
			ctx.fill();
			I.active=false;
		}
				
	};
		
	//for updating new enemy position and speed at each frame
	I.update= function(){
		I.x+=I.xVelocity;
		I.y+=I.yVelocity;
		if(I.active==true && I.pos==false && I.y>=canvas.height-110){
			life++;
			I.pos=true;
		}

		I.xVelocity=3*Math.sin(I.age*Math.PI/64);
		I.age++;
			
		I.active=I.active && I.inBounds();
	};
				
	//for creating explosion sound
	I.explode=function(){
		I.explodeTime=2;
		Sound.play("explosion");
	};
				
	//increasing the spped of enemy when level is increased
	I.speed=function(){
		I.yVelocity+=1;
	}
	
	return I;
};
	
//for checking if enemy collides either with bullet or player
function collides(a,b){
	return a.x < b.x + b.width 
		   && a.x + a.width > b.x 
		   && a.y < b.y + b.height 
		   && a.y + a.height > b.y; 
}
		
//for handling collision
function handleCollisions(){
	
	//checking for the player life
	if(life >= 3){
		myStopFunction();
	}
			
	//checking if any bullet collides with any enemy & handling it and the scores
	playerBullets.forEach(function(bullet){
		enemies.forEach(function(enemy){
			if(collides(bullet,enemy)){
				enemy.explode();
				bullet.active=false;
						
				//increases score by 10 for normal enemy
				score+=10;
						
				//increasing level for each 100 points by increasing no. of falling enemies
				if(score%200==0){
					level+=1;
					limit+=0.02;
							
					//for each multiple of level by 2 increase the speed of each enemy by 1 unit
					if(level%2==0){
						enemies.forEach(function(enemy){
						    enemy.speed();
						    });
					
						enemies2.forEach(function(enemy2){
						    enemy2.speed();
						    });
								
					}
				}
			}
		});
	});
			
	//checking if player collides with any enemy of new type & handling it  
	enemies.forEach(function(enemy){
		if(collides(enemy,player)){
			enemy.explode();
			player.explode();
			myStopFunction();
		}
	});
			
	//checking if any bullet collides with any enemy of new type & handling it and the scores
		
	playerBullets.forEach(function(bullet){
		enemies2.forEach(function(enemy2){
			if(collides(bullet,enemy2)){
				enemy2.explode();
				bullet.active=false;
					
				//type 2 increases score by 20
				score+=20;
					
				//increasing level for each 100 points by increasing no. of falling enemies
				if(score%200==0){
					level+=1;
					limit+=0.02;
						
					//for each multiple of level by 2 increase the speed of each enemy by 1 unit
					if(level%2==0){
						enemies.forEach(function(enemy){
						    enemy.speed();
						    });
						enemies2.forEach(function(enemy2){
						    enemy2.speed();
						    });
					}
				}
			}
		});
	});
			
	//checking if player collides with any enemy of new type & handling it  
	enemies2.forEach(function(enemy2){
		if(collides(enemy2,player)){
			enemy2.explode();
			player.explode();
			myStopFunction();
				
		}
	});

}


