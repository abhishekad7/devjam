var active_troop=50;
var allies=[];
var enemies=[];
var RT=[];
var BT=[];
var exiler=30;
var bullets=[];
var frameno=0;

function startGame() {

    exiler=30;
    active_troop=50;
    frameno=0;

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    document.body.insertBefore(canvas, document.body.childNodes[0]);
    canvas.addEventListener("click", input, false);
    canvas.addEventListener("touchstart", handleStart, false);  
    
    canvas.height=window.innerHeight-40;
    canvas.width=window.innerWidth-20;
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    h_ratio=canvas.height/700;
    w_ratio=canvas.width/400; 
    tank_width=Math.floor(w_ratio*40);
    tank_height=Math.floor(h_ratio*60);
    sp=canvas.width/100;
    
    var img = document.getElementById("clash")
    var pat = ctx.createPattern(img, "repeat");
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = pat;
    ctx.fill();
    

    BT[1] = new units(tank_width, tank_height, "img/blue_tank2.png",Math.floor(w_ratio*(200-30-80)-sp*2),Math.floor(h_ratio*640)-sp/4, "image",1);
    BT[2] = new units(tank_width, tank_height, "img/blue_tank4.png",Math.floor(w_ratio*(200-30-40)-sp*1),Math.floor(h_ratio*640)-sp/4, "image",2);
    BT[3] = new units(tank_width, tank_height, "img/blue_tank3.png",Math.floor(w_ratio*(200+30)+sp*1),Math.floor(h_ratio*640)-sp/4, "image",3);
    BT[4] = new units(tank_width, tank_height, "img/blue_tank1.png",Math.floor(w_ratio*(200+30+40)+sp*3),Math.floor(h_ratio*640)-sp/4, "image",4);


    RT[1] = new units(tank_width, tank_height, "img/red_tank2.png",Math.floor(w_ratio*(200-30-80)-sp*2),Math.floor(h_ratio*640)-sp/4, "image",1);
    RT[2] = new units(tank_width, tank_height, "img/red_tank4.png",Math.floor(w_ratio*(200-30-40)-sp*1),Math.floor(h_ratio*640)-sp/4, "image",2);
    RT[3] = new units(tank_width, tank_height, "img/red_tank3.png",Math.floor(w_ratio*(200+30)+sp*1),Math.floor(h_ratio*640)-sp/4, "image",3);
    RT[4] = new units(tank_width, tank_height, "img/red_tank1.png",Math.floor(w_ratio*(200+30+40)+sp*3),Math.floor(h_ratio*640)-sp/4, "image",4);

    BC = new castle(Math.floor(w_ratio*60),Math.floor(h_ratio*70), "img/blue_castle.png",Math.floor(w_ratio*(170)),Math.floor(h_ratio*630));
    RC = new castle(Math.floor(w_ratio*60),Math.floor(h_ratio*70), "img/red_castle.png",Math.floor(w_ratio*170),Math.floor(h_ratio*0));

    myScore = new component(20*h_ratio+"px", "Consolas", "#349", w_ratio*0, h_ratio*660);
    myScore.text="SCORE:-";
    myexiler = new component(20*h_ratio+"px", "Consolas", "#92A", w_ratio*330, h_ratio*660);
    myexiler.text="GEMS:-";
//    enemies.push(new units(BT[2].width,BT[2].height,RT[2].image.src,300-tank_width/2,400-tank_height/2,"image",2));
            
    interval = setInterval(main_game , 20);
    
}

function main_game() {
if(RC.health<0)
    end_game();
    update_all();
    draw_all();    
}

function end_game() {
    clearInterval(interval);
    draw_all();

}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
        }            
}


function draw_all() {
    frameno++;
if (active_troop!=50) {
if (BT[active_troop].cost>exiler) {
    active_troop=50;
}
}
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    var img = document.getElementById("clash")
    var pat = ctx.createPattern(img, "repeat");
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = pat;
    ctx.fill();
    
    myScore.text="SCORE "+Math.floor(frameno/25);
    myScore.update();

    myexiler.text="GEMS "+exiler;
    myexiler.update();

    BT[1].update();
    BT[2].update();
    BT[3].update();
    BT[4].update();

    if(active_troop!=50) {
        ctx.strokeStyle = '#456';
        ctx.lineWidth = sp/2;
        ctx.strokeRect(BT[active_troop].x, BT[active_troop].y-sp/4,BT[active_troop].width+sp/2, BT[active_troop].height+sp/2);    
        ctx.lineWidth = 2;
    }
    
    BC.update();
    if (RC.health>0) 
    RC.update();

    if (active_troop!=50) {                                                                        //blue line
        ctx.beginPath();
        ctx.moveTo(0,Math.floor(h_ratio*550));
        ctx.lineTo(canvas.width,Math.floor(h_ratio*550));
        ctx.strokeStyle="#00F";
        ctx.stroke();
    }
                                                                                                    // red line            
    ctx.beginPath();
    ctx.moveTo(0,Math.floor(h_ratio*80));
    ctx.lineTo(canvas.width,Math.floor(h_ratio*80));
    ctx.strokeStyle="#FF0000";
    ctx.stroke();
                                                                                                    // deploy line                                                                                        
    ctx.beginPath();    
    ctx.moveTo(0,Math.floor(h_ratio*630));
    ctx.lineTo(canvas.width,Math.floor(h_ratio*630));
    ctx.strokeStyle="#66D";
    ctx.stroke();

    for (var i = allies.length - 1; i >= 0; i--) {
        allies[i].update();
    }

    for (var i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
    }

    for (var i = 0; i < bullets.length; i++) {
        bullets[i].update();
    }
}


// components

function castle(width, height, name, x, y) {
    this.image = new Image();
    this.image.src = name;
    this.image.style.opacity="0.1";
    this.width = width;
    this.height = height;
    this.cx=x+width/2;
    this.cy=y+height/2;
    this.x = x;
    this.y = y;    
    this.update = function() {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
    }
    this.health=50000;
    this.max_health=50000;
}



function units(width, height, color, x, y, type,speciality) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
        this.image.style.opacity="0.1";
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.cx = x + width/2;
    this.cy = y + height/2;   
    this.update = function() {
        if (type == "image") {

                // save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    ctx.save();

    // move to the center of the canvas
    ctx.translate(this.cx,this.cy);

    // rotate the canvas to the specified degrees
    ctx.rotate(-1*(this.angle-90)*Math.PI/180);

    // draw the image
    // since the context is rotated, the image will be rotated also
    ctx.drawImage(this.image,-this.width/2,-this.height/2,this.width,this.height);

    // we’re done with the rotating so restore the unrotated context
    ctx.restore();
                
                /*ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);*/
        } 
        else if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.angle=90;
    this.sp=speciality;
    if(speciality==1)                               // attacker
    {
        this.attack=30;
        this.defense=10;
        this.speed=0.8*h_ratio;
        this.max_health=3000;
        this.health=3000;
        this.range=70;
        this.type=1;
        this.rotational_speed=2;
        this.cost=2;
        this.attack_speed=2;
    }
    if(speciality==2)                               // Defense
    {
        this.attack=10;
        this.defense=20;
        this.speed=0.5*h_ratio;
        this.max_health=7000;
        this.range=100;
        this.health=60000;
        this.type=2;
        this.rotational_speed=2;
        this.cost=2;
        this.attack_speed=1;
    }
    if(speciality==3)                               // Speeder
    {
        this.attack=10;
        this.defense=10;
        this.speed=1.5*h_ratio;
        this.health=5000;
        this.max_health=5000;
        this.range=50;
        this.type=4;
        this.rotational_speed=4;
        this.cost=1;
        this.attack_speed=6;
    }
    if(speciality==4)                               // normal
    {
        this.attack=15;
        this.defense=10;
        this.speed=0.8*h_ratio;
        this.health=4000;
        this.max_health=4000;
        this.range=60;
        this.type=4;
        this.rotational_speed=2;
        this.cost=1;
        this.attack_speed=1;
    }
}

function bullet(inx, iny, fnx, fny, len,ang,color,source,destination,type,user) {
    this.user = user;
    this.inx = inx;
    this.iny = iny;
    this.fnx = fnx;
    this.fny = fny;
    this.len = 3*w_ratio;
    this.color = color;    
    this.angle=ang;
    this.update = function() {
        ctx.beginPath();
        ctx.moveTo(inx,iny);
        ctx.lineTo(len*Math.cos(ang*Math.PI/180)+inx,len*Math.sin(ang*Math.PI/180)*-1+iny);
        ctx.strokeStyle=color;
        ctx.stroke();    
    }
    this.speed=1;
    this.type=type
    this.source=source;
    this.destination=destination;
    this.move= function() {
        this.inx+=this.speed*Math.cos(this.angle*Math.PI/180)*w_ratio;
        this.iny-=this.speed*Math.sin(this.angle*Math.PI/180)*h_ratio;  
    }
}

// input handel

function input(event)
{
    var x = event.x;
    var y = event.y;
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    if (y>h_ratio*640) {
        if ((x<(tank_width+Math.floor(w_ratio*(200-30-80)-sp*2)))&&(x>Math.floor(w_ratio*(200-30-80)-sp*2))) {
            if (active_troop!=1) {
                active_troop=1;
            }
            else{
                active_troop=50;
                }
            }
        else if ((x<(tank_width+Math.floor(w_ratio*(200-30-40)-sp*1)))&&(x>Math.floor(w_ratio*(200-30-40)-sp*1))) {
            if (active_troop!=2) {
                active_troop=2;
            }
            else {
                active_troop=50;
            }

        }
        else if ((x<Math.floor(w_ratio*(200+30)+sp*1)+tank_width)&&(x>Math.floor(w_ratio*(200+30)+sp*1))) {
            if (active_troop!=3) {
                active_troop=3;
                BT[3].image.style.border = "2px solid #126";
            }
            else{
                active_troop=50;
                BT[3].image.style.border = "0px solid #126";
            }
        }
        else if ((Math.floor(w_ratio*(200+30+40)+sp*3)+tank_width)&&(x>Math.floor(w_ratio*(200+30+40)+sp*3))) {
            if (active_troop!=4) {
                active_troop=4;
                BT[4].image.style.border = "2px solid #126";
            }
            else{
                active_troop=50;
                BT[4].image.style.border = "0px solid #126";
            }
        }
    }
    if (active_troop!=50)
    if (y>h_ratio*550&&y<h_ratio*630) {
        if ((x<canvas.width-tank_width/2&&x>tank_width/2)&&exiler>=BT[active_troop].cost){
            allies.push(new units(BT[active_troop].width,BT[active_troop].height,BT[active_troop].image.src,x-tank_width/2,y-tank_height/2,"image",active_troop));
            exiler-=BT[active_troop].cost;
        }
    }
}

function handleStart(evt) {
    tf=Date.now();
    if(tf-ti>200)
{
    var touches = evt.changedTouches[0];
    var x = touches.pageX;
    var y = touches.pageY;
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    if (y>h_ratio*640) {
        if ((x<(tank_width+Math.floor(w_ratio*(200-30-80)-sp*2)))&&(x>Math.floor(w_ratio*(200-30-80)-sp*2))) {
            if (active_troop!=1) {
                active_troop=1;
                BT[1].image.style.border = "2px solid #126";
            }
            else{
                active_troop=50;
                    BT[4].image.style.border = "0px solid #126";
                }
            }
        else if ((x<(tank_width+Math.floor(w_ratio*(200-30-40)-sp*1)))&&(x>Math.floor(w_ratio*(200-30-40)-sp*1))) {
            if (active_troop!=2) {
                active_troop=2;
                BT[2].image.style.border = "2px solid #126";
            }
            else {
                active_troop=50;
                BT[2].image.style.border = "0px solid #126";
            }

        }
        else if ((x<Math.floor(w_ratio*(200+30)+sp*1)+tank_width)&&(x>Math.floor(w_ratio*(200+30)+sp*1))) {
            if (active_troop!=3) {
                active_troop=3;
                BT[3].image.style.border = "2px solid #126";
            }
            else{
                active_troop=50;
                BT[3].image.style.border = "0px solid #126";
            }
        }
        else if ((Math.floor(w_ratio*(200+30+40)+sp*3)+tank_width)&&(x>Math.floor(w_ratio*(200+30+40)+sp*3))) {
            if (active_troop!=4) {
                active_troop=4;
                BT[4].image.style.border = "2px solid #126";
            }
            else{
                active_troop=50;
                BT[4].image.style.border = "0px solid #126";
            }
        }
    }
    if(active_troop!=50)
    if (y>h_ratio*550&&y<h_ratio*630) {
        if ((x<canvas.width-tank_width/2&&x>tank_width/2)&&exiler>=BT[active_troop].cost){
            allies.push(new units(BT[active_troop].width,BT[active_troop].height,BT[active_troop].image.src,x-tank_width/2,y-tank_height/2,"image",active_troop));
            exiler-=BT[active_troop].cost;
            ti=Date.now();
        }
    }
}
}

// update all positions

function update_all()
{
/*    //var l=50,ka=0,ke=0;
    for (var i = allies.length - 1; i >= 0; i--) {
        var l=allies[i].range,ka=-1,ke=-1;
        for (var j = enemies.length - 1; j >= 0; j--) {
            if(Math.pow(Math.pow(enemies[j].x-allies[i].x,2)+Math.pow(enemies[j].y-allies[i].y,2),0.5)<l)
            {
                ka=i;
                ke=j;
            }
        }
        if (ke!=-1) {
            var temp;
            if (allies[i].x<enemies[ke].x) {
               if (allies[i].y<enemies[ke].y) {
                temp=((enemies[ke].y-allies[i].y)/(enemies[ke].x-allies[i].x));
                    if ((allies[i].angle-temp<=allies[i].rotational_speed&&temp<=allies[i].angle)||(temp-allies[i].angle<=allies[i].rotational_speed&&temp>=allies[i].angle)) {
                        bullets.push(new bullet());
                    }
                    else{
                        if (frameno%2==0) {
                            allies.angle+=rotational_speed;                
                        }
                    }
               } 
            }        
        }
    }

*/
/*
(Math.pow(Math.pow(,2)+Math.pow(,2),0.5))

var 
*/

for (var i = allies.length - 1; i >= 0; i--) {
    var l=-1;
        for (var j = enemies.length - 1; j >= 0; j--) {
            if(Math.pow(Math.pow(enemies[j].cx-allies[i].cx,2)+Math.pow(enemies[j].cy-allies[i].cy,2),0.5)<allies[i].range)
            {
                l=j;
            }
        }
    if (l!=-1) {
        attack_enemy(i,l);
    }
    else if (Math.pow(Math.pow(RC.cx-allies[i].cx,2)+Math.pow(RC.cy-allies[i].cy,2),0.5)<allies[i].range||allies[i].y<Math.floor(h_ratio*80)) {
        //    console.log("H1");
        attack_castle(i);
    }
    else 
    {
         move_on(i);
        

    }   
}//+bullets[0].len*Math.cos(bullets[0].ang)-enemies[bullets[0].destination].cx)<tank_width


    if(bullets.length)
    console.log(Math.abs(bullets[0].inx));

for (var i = 0; i < bullets.length; i++) {
    bullets[i].move();
    if (bullets[i].destination==-1) {
        if (bullets[i].user==1) {
            if(Math.abs(bullets[i].inx-RC.cx)<RC.width)
                RC.health-=BT[bullets[i].type].attack;
        }
        else {
            if(Math.abs(bullets[i].inx-BC.cx)<BC.width)
                BC.health-=BT[bullets[i].type].attack;   
        }
    }
        else if (bullets[i].user==1){ 
        if(Math.abs(bullets[i].inx+bullets[i].len*Math.cos(bullets[i].ang)-enemies[bullets[i].destination].cx)<tank_width) {
        if(BT[bullets[i].type].attack-enemies[bullets[i].destination].defense>0)
        enemies[bullets[i].destination].health-=BT[bullets[i].type].attack-enemies[bullets[i].destination].defense;
        else
        enemies[bullets[i].destination].health-=5;
        console.log(hi);
        }
            bullets.splice(i,1);
    
    }
    else if(Math.abs(bullets[i].inx+bullets[i].len*Math.cos(bullets[i].ang)-allies[bullets[i].destination].cx)<tank_width) {
        if(BC[bullets[i].type].attack-allies[bullets[i].destination].defense>0)
        allies[bullets[i].destination].health-=BT[bullets[i].type].attack-enemies[bullets[i].destination].defense;
        else
        allies[bullets[i].destination].health-=5;
        bullets.splice(i,1);
        }
        if(i<bullets.length)
        if ((bullets[i].inx>canvas.width||bullets[i].inx<0)||(bullets[i].iny>canvas.length||bullets[i].iny<0)) {
            bullets.splice(i,1);
        }
    }    
}


function move_on(i) {
    if (Math.abs(allies[i].angle-90)<allies[i].rotational_speed) {
        allies[i].y-=allies[i].speed;
        allies[i].cy-=allies[i].speed;
    }
    else if (allies[i].angle-90>0) {
        allies[i].angle-=allies[i].rotational_speed/10;
    }
    else {
        allies[i].angle+=allies[i].rotational_speed/10;
    }
}

function attack_enemy(i,j) {
    console.log(enemies[0].health);
//    console.log(Math.abs(q));
    var q;
    if (Math.abs(allies[i].cx-enemies[j].cx)<4) {
        if (allies[i].angle<94&&allies[i].angle>86) 
        {
            if(frameno%10==0)
            bullets.push(new bullet(allies[i].cx,allies[i].cy,enemies[j].cx,enemies[j].cy,sp,allies[i].angle,"#345",i,j,allies[i].sp,1));
        }
    }
    else{
        q=Math.atan((allies[i].cy-enemies[j].cy)/(allies[i].cx-enemies[j].cx))*180/3.1415926;

        if (q>0) {

            if ((allies[i].cx-RC.cx)>0) {
           //     console.log("hel");
                q=180-q;
            }
            else
                q=360-q;
        }
        else{
            if(((allies[i].cx-RC.cx)>0)) {
                q=270+q;
            }
            else
                q=-q;
        }
        
        if (Math.abs(q-allies[i].angle)<=allies[i].rotational_speed) {
            if(frameno%10==0)
            bullets.push(new bullet(allies[i].cx,allies[i].cy,enemies[j].cx,enemies[j].cy,sp,allies[i].angle,"#345",i,j,allies[i].sp,1));
//            console.log("hi");
        }
        else if (q>allies[i].angle) {
            allies[i].angle+=allies[i].rotational_speed;
        }
        else {
            allies[i].angle-=allies[i].rotational_speed;
        }
    }
}


function attack_castle(i) {
    var q,w,e,r;
    if (Math.abs(allies[i].cx-RC.cx)<allies[i].rotational_speed) {
        {

            if (frameno%10==0) 
            bullets.push(new bullet(allies[i].cx,allies[i].cy,RC.cx,RC.cy,sp,allies[i].angle,"#345",i,-1,allies[i].sp,1));
        }
    }
    else{

        q=Math.atan((allies[i].cy-RC.cy)/(allies[i].cx-RC.cx))*180/3.1415926;
        //console.log((allies[i].cx-RC.cx));
        if (q>0) {

            if ((allies[i].cx-RC.cx)>0) {
           //     console.log("hel");
                q=180-q;
            }
            else
                q=360-q;
        }
        else{
            if(((allies[i].cx-RC.cx)>0)) {
                q=270+q;
            }
            else
                q=-q;
        }
        
        if (Math.abs(q-allies[i].angle)<allies[i].rotational_speed) {
            if (frameno%10==0) 
            bullets.push(new bullet(allies[i].cx,allies[i].cy,RC.cx,RC.cy,sp*6,allies[i].angle,"#345",i,-1,allies[i].sp,1));
        }
        else if (q>allies[i].angle) {
            allies[i].angle+=allies[i].rotational_speed/10;
        }
        else {
            allies[i].angle-=allies[i].rotational_speed/10;
        }
//        console.log(allies[i].angle);
    }
}
