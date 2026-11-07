const Canvas = "canvas";
const ctx = document.getElementById(Canvas).getContext("2d");
const TileMap = [];
const Sprites = {};
let lastTime = performance.now();
var deltaTime = deltaTime_calc();



// calculates deltaTime
function deltaTime_calc() {
  let deltatime = (performance.now() - lastTime) // convert ms → seconds
  lastTime = performance.now();

  return deltatime;
}

//resizes the canvas
function resizeCanvas(){
    document.getElementById(Canvas).width = window.innerWidth;
    document.getElementById(Canvas).height = window.innerHeight;  
}
window.addEventListener('resize',resizeCanvas(Canvas))
const CanvasWidth = document.getElementById(Canvas).width;
const CanvasHeight = document.getElementById(Canvas).height;

    
//key detection//
let keys = {ArrowRight: false ,ArrowLeft: false,ArrowUp: false,ArrowDown: false,KeyW: false, KeyS: false,KeyA: false, KeyD: false,Space: false };
// is key pressed?
document.addEventListener("keydown",
    function (event) {
    keys[event.code] = true;
})
// is not key pressed?
document.addEventListener("keyup",
    function (event) {
     keys[event.code] = false;
})


// all functions that draw something
const draw = {
        //draws a Triangle
    Triangle(x1,y1,x2,y2,x3,y3) { 
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x3,y3);
        ctx.closePath();
        ctx.fill();
    },

    //draws a Rectangle
    Rectangle(relx,y,width,height,r,g,b){
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(relx,y,width,height);
    },

    //draws an Image
    Image(image,relx,y,width,height){
            ctx.drawImage(image,relx,y,width,height);

    },

    //clears the screen
    clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
};

// loads the  sprite
const PlayerSprite = new Image();
function loadPlayerSprite(image){
    PlayerSprite.src =image;
};

const attributes = {
    
    dx: 0,
    dy: 0,
    dz: 0,

    Maxdx: 2,
    Maxdy: 2,
    Maxdz: 2,

    friction_x:0.75,
    friction_y:0.75,
    friction_z:1,

    accex: 0.3,
    accey: 0.3,
    accez: 0.6,

};


const  Player = {


    // defining the Player
    height: 96,
    width: 64,
    depth: 100,
    
    x:0,
    y:0,
    z:0,

    relx: 0,
    rely: 0,
    relz: 0,
    
    Calcx: 0,
    Calcy: 0,
    Calcz: 0,

    // defining the keys
    key_yplus: ["KeyW","ArrowUp"],
    key_yminus: ["KeyS","ArrowDown"],

    key_xplus: ["KeyD","ArrowRight"],
    key_xminus: ["KeyA","ArrowLeft"],

    key_zplus: ["Space"],
    key_zminus: ["ShiftLeft"],


    //defining movement
    xForward(){
        if (Player.key_xplus.some(key => keys[key]) && attributes.dx < attributes.Maxdx){
            if(attributes.dx < 0){
               attributes.dx = 0; 
            };

            attributes.dx += attributes.accex;
        };
    },

    xBackward() {
        if (Player.key_xminus.some(key => keys[key]) && attributes.dx > -attributes.Maxdx){
            if(attributes.dx > 0){
               attributes.dx = 0; 
            };

            attributes.dx -= attributes.accex;
        };

    },

    yForward() {
         if (Player.key_yplus.some(key => keys[key]) && attributes.dy < attributes.Maxdy){
            if(attributes.dy < 0){
               attributes.dy = 0; 
            };

            attributes.dy += attributes.accey;
        };
    },

    yBackward() {
        if (Player.key_yminus.some(key => keys[key]) && attributes.dy > -attributes.Maxdy ){
            if(attributes.dy > 0){
               attributes.dy = 0; 
            };

            attributes.dy -= attributes.accey;
        };
    },

    zForward() {
         if (Player.key_zplus.some(key => keys[key]) && attributes.dz < attributes.Maxdz ){
            if(attributes.dz < 0){
               attributes.dz = 0; 
            };

            attributes.dz += attributes.accez;
        };
    },

    zBackward() {
         if (Player.key_zminus.some(key => keys[key]) && attributes.dz > -attributes.Maxdz ){
            if(attributes.dz > 0){
               attributes.dz = 0; 
            };

            attributes.dz -= attributes.accez;
        };
    },


    movementCalc() {
        attributes.dx = attributes.dx*attributes.friction_x;
        attributes.dy = attributes.dy*attributes.friction_y;
        attributes.dz = attributes.dz*attributes.friction_z;
    },
    
    
    movement() {
        Player.xForward();
        Player.xBackward();

        Player.yForward();
        Player.yBackward();

        Player.movementCalc();

        Player.Calcx = Camera.Calcx + Camera.width/2;
        Player.Calcy = Camera.Calcy - Player.height - Camera.height/2;
        Player.Calcz += attributes.dz * deltaTime;

       Player.relx = Math.max(Camera.width % Camera.tileSize ,Math.min(Camera.TileMapSizeX * Camera.tileSize + (Camera.width % Camera.tileSize) - this.width ,Player.Calcx)) - Camera.x
       Player.rely = -(Math.max(-Camera.height,Math.min(Camera.TileMapSizeY*Camera.tileSize - Camera.height - this.height,Player.Calcy)) - Camera.y) - this.height

        if (Player.relx +Camera.x > Player.Calcx){
        Camera.Calcx = Player.relx + Camera.x - Camera.width/2
      }else if (Player.Calcx > Player.relx +Camera.x){
        Camera.Calcx = Player.relx +Camera.x - Camera.width/2
      }
      if (-Camera.height - Player.height > Player.Calcy){
        Camera.Calcy = -Camera.height/2
      }else if (Player.Calcy > Camera.TileMapSizeY*Camera.tileSize - Camera.height - Player.height){
        Camera.Calcy = Camera.TileMapSizeY*Camera.tileSize - Camera.height/2
      }

      Player.x = Camera.x+Player.relx-Player.width;
      Player.y = Camera.y-Player.rely+Camera.height - this.height/2;

    },

    Check_collision(){
        console.log(Screen.FindTile(88,48))
    },


    draw() {
        draw.Image(PlayerSprite,Player.relx,Player.rely,Player.width,Player.height);
    },
};


const Camera = {

    height : CanvasHeight,
    width : CanvasWidth,

    x: 0,
    y: 0,
    z: 0,

    Calcx: 0,
    Calcy: 0,
    Calcz: 0,

    TileMapSizeX: 500,
    TileMapSizeY: 500,

    tilescrollingAktiv: false,

    tileSize: 128,

    createTileMap() {
    TileMap.length = 0;

        for (let y = 0; y < this.TileMapSizeY; y++) {
            TileMap.push([]);
                for (let relx = 0; relx < this.TileMapSizeX; relx++) {
                    TileMap[y].push(Math.round(Math.random()));
                };
        };
        TileMap[1].length = 0;
        for (let relx = 0; relx < this.TileMapSizeX; relx++) {
                    TileMap[1].push(2);
                };
    },

    positionTiles() {

        Camera.movement();

        this.tilescrollingAktiv = true;

        for(let i = 0;i < Math.trunc((this.width)/this.tileSize+2);i++){
            for(let n = 0;n < Math.trunc((this.height)/this.tileSize+2);n++){

                const width1 = Math.trunc((this.width)/this.tileSize+1)*this.tileSize;
                const height1 = Math.trunc((this.height)/this.tileSize+1)*this.tileSize;

                const relx = -Math.round( (this.x + i*this.tileSize) % (width1+this.tileSize)-CanvasWidth);
                const rely = Math.round((this.y - n*this.tileSize + CanvasHeight) % (height1+this.tileSize)-this.tileSize);

                const Camerax = Math.abs(this.x + relx);
                const Cameray = Math.abs(this.y - rely+CanvasHeight);


                draw.Image(Sprites[Screen.FindTile(Camerax,Cameray)],relx,rely,this.tileSize,this.tileSize);
            
            }
        }
    },

    movement() {
        Player.xForward();
        Player.xBackward();

        Player.yForward();
        Player.yBackward();

        Player.movementCalc();

        Camera.Calcx += attributes.dx * deltaTime;
        Camera.Calcy += attributes.dy * deltaTime;
        Camera.Calcz += attributes.dz * deltaTime;

        Camera.x = Math.max(this.width % this.tileSize,Math.min(this.TileMapSizeX*this.tileSize + (Camera.width % Camera.tileSize) -Camera.width ,Camera.Calcx))
        Camera.y = Math.max(0,Math.min(this.TileMapSizeY*this.tileSize-this.height,Camera.Calcy))
    }
};

const Screen = {

    offsetx: -Camera.x,
    offsety: CanvasHeight-Camera.y,
    offsetz: 0,

    calcOffset() {
        this.offsetx = -Camera.x;
        this.offsety = CanvasHeight+Camera.y;
    },

    FindTile(x,y) {
        let Tx = Math.abs(Math.round(x/Camera.tileSize))%Camera.TileMapSizeX
        let Ty = Math.abs(Math.round(y/Camera.tileSize))%Camera.TileMapSizeY

        let Tile = TileMap[Ty][Tx];

        return Tile

    },
};

Player.Calcx = Camera.width/2;

Player.Calcy = -Camera.height/2;

for (let n = 0; n < 10000; n++) {
    Sprites[n] = new Image;
};


function StartUpLoop(){

    deltaTime = deltaTime_calc();
    Screen.calcOffset();

    draw.clear()

    Player.movement();
    Player.Check_collision();
    Camera.positionTiles();
    console.log(Camera.x,Player.y,Camera.width)

    Player.draw()


    requestAnimationFrame(StartUpLoop)
};

Sprites[0].src = "Images/misy jason.png"
Sprites[1].src = "Images/avocado tsundere.png"
Sprites[2].src = "Images/jason hippy.png"

loadPlayerSprite("Images/jason.jpg")


Camera.createTileMap();

StartUpLoop();