var ctx=document.getElementById("ctx").getContext("2d"); 
ctx.font= "20px Calibri";
var HEIGHT= "500";
var WIDTH="500";
var numOfTiles;
var score;
var tileList;
var intervalVar;
var hittCount;
ctx.fillText("Click me to start the game",150,250);


var ball = {
    x:0,    // boll will go one place to another, so, we dont have to initial the x and y values 
    y:0,
    radius:5,   // boll is circle
    color:'blue',
    spdX:-5,
    spdY:-5

};
var base = {                 // the slider that will try to hit the boll
    x:0,                     // 
    y:400,
    height:20,              
    width:100,
    color:"Red",
    pressingLeft:false,   // start with defining the values to false, so it doesn't move when we start the game 
   pressingRight:false,
   lives:3
            
};

var tile = {
height:20,
width:40,
color:"orange"
}




///---------------------------------------------------------- DRAW FUNCTIONS--------------------------------------------------------------------------//

drawBall = function () {
    ctx.save();
    ctx.fillStyle = ball.color;
    ctx.beginPath();                               // beginPath when using arc  
                                                  // The arc() method creates an arc/curve (used to create circles, or parts of circles).
                                                  //Tip: To create a circle with arc(): Set start angle to 0 and end angle to 2*Math.PI.
                                                 //Tip: Use the stroke() or the fill() method to actually draw the arc on the canvas.
    ctx.arc(ball.x, ball.y, ball.radius,0,2*Math.PI);    // 0 where we start, 2 * pi =360 degres
    ctx.fill();
    ctx.restore();
}


drawBase = function() {
    ctx.save();
    ctx.fillStyle=base.color;
    ctx.fillRect(base.x, base.y, base.width, base.height);     // The fillRect() method draws a filled rectangle whose starting point is at (x, y) 
                                                            //and whose size is specified by width and height. 
                                                           //The fill style is determined by the current fillStyle attribute.
   
    ctx.restore();
}


drawTile = function (t,i) {


    ctx.save();
    ctx.fillStyle=tile.color;
    ctx.fillRect(t.x, t.y, tile.width, tile.height);  
                                                            
                                                           
   
    ctx.restore();

}


///------------------------------------------------------^^^^^^^^^^^^DRAW FUNCTIONS^^^^^^^^^^^^^^^^^^--------------------------------------------------------------------------//

// left= keycode 37
// right = keycode 39


///---------------------------------------------------------- User input--------------------------------------------------------------------------//


document.getElementById("ctx").onmousedown = function (){
    clearInterval(intervalVar);
    startGame();
}

document.onkeydown=function(event) {
    if(event.keyCode==37){
        base.pressingLeft=true;
        base.pressingRight=false;
    }
    else if (event.keyCode=39){
        base.pressingLeft=false;
        base.pressingRight=true;
    }
}


document.onkeyup=function(event){   // if key is not pressed this function start, to prevent the base to move when no key pressed down
    if(event.keyCode==37){
        base.pressingLeft=false;
    }
    else if(event.keyCode==39){
        base.pressingRight=false;
    }
}
///------------------------------------------------------^^^^^^^^^^^^user input^^^^^^^^^^^^^^^^^^--------------------------------------------------------------------------//


///---------------------------------------------------------- UpdateBaseposition and BOLL position--------------------------------------------------------------------------//


updateBasePosition = function (){

    if(base.pressingLeft) {
        base.x=base.x-5;

    }
    else if (base.pressingRight){
        base.x=base.x+5;
    }
    if(base.x<0){    // if base is gong to much right
        base.x=0;    // prevent it from continue
    }
    if(base.x>WIDTH-base.width){     // WIDTH=500 -100(base.width)=400, so if the center of base x come to 400 then we are at the edge
        base.x=WIDTH-base.width;        // set base.x to edge
    }
}
updateBallPosition = function ()  {
    ball.x += ball.spdX;
    ball.y +=ball.spdY;

    if(ball.x>WIDTH || ball.x<0){
        hittCount++;
        if(hittCount%10==0){
            if(ball.spdX<0)
                ball.spdX= (Math.abs(ball.spdX)+1);
                else 
                ball.spdX+=1;
                
            

        }
        ball.spdX = -ball.spdX
    }
    if (ball.y<0){
     
        hittCount++;

        if(hittCount%10==0){
            if(ball.spdY<0)
                ball.spdY= (Math.abs(ball.spdY)+1);
                else 
                ball.spdY+=1;
                
            

        }
        ball.spdY = -ball.spdY
    }
    if (ball.y>HEIGHT){

        hittCount++;

if(hittCount%10==0){
    if(ball.spdY<0)
        ball.spdY= (Math.abs(ball.spdY)+1);
        else 
        ball.spdY+=1;
        
    

}
        ball.spdY = -ball.spdY
        base.lives--;
      
    }
}

///------------------------------------------------------^^^^^^^^^^^^UpdateBaseposition and BOLL position^^^^^^^^^^^^^^^^^^--------------------------------------------------------------------------//

///----------------------------------------------------------  TestCollision  --------------------------------------------------------------------------//


testCollision = function (base,ball){
    return ((base.x<ball.x + 2*ball.radius) &&
           (ball.x<base.x+base.width) &&
           (base.y<ball.y+2*ball.radius)&&
           (ball.y<base.y+base.height)

    );
}

testCollisionTile = function (t,ball ){   // argument t= tilelist and ball argument is the ball 
    return ((t.x<ball.x + 2*ball.radius) &&
           (ball.x<t.x+tile.width) &&
           (t.y<ball.y+2*ball.radius)&&
           (ball.y<t.y+tile.height)

    );

}



///------------------------------------------------------^^^^^^^^^^^^TestCollision^^^^^^^^^^^^^^^^^^--------------------------------------------------------------------------//


isGameOver = function (){
    if(base.lives<0 || score==330){
        clearInterval(intervalVar);
        hittCount=0;
        ctx.fillText("Game over! Click to restart", 150,200)
        
    }
}

update=function (){
    ctx.clearRect(0,0,WIDTH,HEIGHT)    // The clearRect() method clears the specified pixels within a given rectangle.
    tileList.forEach(drawTile);
    drawBall();
    drawBase();
    if(testCollision(base,ball)){
        ball.spdY=-ball.spdY;
    }

    for(key in tileList){
      if(testCollisionTile(tileList[key],ball)){
          delete tileList[key];
          ball.spdY=-ball.spdY
          score +=5;
      }
    }

    ctx.fillText("Score "+ score,5,490);
    ctx.fillText("Lives " + base.lives,430,490);
    isGameOver();
    updateBasePosition();
    updateBallPosition();

 
}



startGame = function (){   // START THE GAME FUNCTION
    base.x=150;           // set the base for x 
    ball.x=base.x+100;    // set the ball x
    ball.y=base.y-100;    // set the y for the ball
    numOfTiles=0;
    var tileX= 5;
    var tileY=5;
    tileList=[];
    score=0;
    base.lives= 3;
    hittCount=0;

    for (var i=1;i<=6;i++) {
          tileX = 5;
          for(var j=1;j<=11;j++) {
            tileList[numOfTiles] = {x:tileX,y:tileY};
            numOfTiles++;
            tileX += 45;
          }
         tileY += 25;
        }




              
              intervalVar= setInterval(update,15);   // call the function update every 15ms 
}














