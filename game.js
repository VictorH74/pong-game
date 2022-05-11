const btnStart=$("#btStart"),btnConfig=$("#btn-settings"),btnBack=$("#btn-back"),btnDefinitions=$("#btn-defs"),btnConfigSave=$("#btn-save-configs"),btnPause=$("#btn-pause");var ballElement=$("#ball"),player1Element=$("#player1"),player2Element=$("#player2"),buffElement=$("#buff"),timer=$("#timer"),player1PointsElement=$("#player1-points"),player2PointsElement=$("#player2-points"),player1SideEmoje=$("#player1-side"),player2SideEmoje=$("#player2-side"),p1Pointes=0,p2Pointes=0;btnStart.on("click",startGame),btnDefinitions.on("click",setDefinitions),btnConfig.on("click",()=>{$("#container").css("display","none"),$("#configs").css("display","block")}),btnConfigSave.on("click",saveConfigurations),btnBack.on("click",goBack),btnPause.on("click",pauseGame);var frames,pauseMemory={onPause:!1,player1Speed:null,player2Speed:null,ballSpeed:null};const arenaHeight=Math.ceil($("#game").height())-3,arenaWidth=Math.ceil($("#game").width())-3,defaultSpeed=7,defaultTime=3,colors=["rgb(0, 81, 255)","rgb(250, 66, 66)","rgb(104, 49, 255)","rgb(221, 0, 147)","rgb(0, 165, 206)","rgb(255, 131, 30)","rgb(187, 185, 43)","rgb(7, 212, 0)","rgb(56, 209, 158)","rgb(103, 87, 196)"],defaultVolume=.4,collisionPlayerAudio=new Audio("audios/collisionPlayer.mp3");collisionPlayerAudio.volume=defaultVolume;const collisionDownAudio=new Audio("audios/collisionDown.mp3");collisionDownAudio.volume=defaultVolume;const collisionUpAudio=new Audio("audios/collisionUp.mp3");collisionUpAudio.volume=defaultVolume;const btnClickedAudio=new Audio("audios/btn clicked.mp3");btnClickedAudio.volume=defaultVolume;const winnerAudio=new Audio("audios/risadaRei.mp3");winnerAudio.volume=.1;const risada1Audio=new Audio("audios/risada1.mp3");risada1Audio.volume=defaultVolume;const risada2Audio=new Audio("audios/risada2.mp3");risada2Audio.volume=defaultVolume;const congelarAudio=new Audio("audios/congelar.mp3");congelarAudio.volume=defaultVolume;const euSouAVelocidadeAudio=new Audio("audios/eu-sou-a-velocidade.mp3");euSouAVelocidadeAudio.volume=defaultVolume;const tolokoAudio=new Audio("audios/toloko.mp3");tolokoAudio.volume=defaultVolume;const getRandom=()=>Math.floor(10*Math.random())+1;var inGame=!1;const arena={height:arenaHeight,width:arenaWidth};var player1={initialPosX:10,initialPosY:180,x:null,y:null,directionY:null,directionMemory:null,settings:null,type:null,paused:!1},player2={initialPosX:arenaWidth-80,initialPosY:180,x:null,y:null,directionY:null,directionMemory:null,settings:null,type:null,paused:!1},ball=null;localStorage.getItem("player1")?(player1.settings=JSON.parse(localStorage.getItem("player1")),$("#player1-speed").val(player1.settings.speed),$("#player1-keyup").val(player1.settings.upKey),$("#player1-keydown").val(player1.settings.downKey),$("#player1-keypause").val(player1.settings.pauseKey)):player1.settings={speed:defaultSpeed,upKey:"w",downKey:"s",pauseKey:"a"},localStorage.getItem("player2")?(player2.settings=JSON.parse(localStorage.getItem("player2")),$("#player2-speed").val(player2.settings.speed),$("#player2-keyup").val(player2.settings.upKey),$("#player2-keydown").val(player2.settings.downKey),$("#player2-keypause").val(player2.settings.pauseKey)):player2.settings={speed:defaultSpeed,upKey:"arrowUp",downKey:"arrowDown",pauseKey:"arrowLeft"},localStorage.getItem("ball")?(ball=JSON.parse(localStorage.getItem("ball")),$("#ball-speed").val(ball.speed)):ball={height:20,width:20,initialPosX:Math.floor(arenaWidth/2),initialPosY:Math.floor(arenaHeight/2),x:null,y:null,directionX:5<getRandom()?1:-1,directionY:5<getRandom()?1:-1,speed:defaultSpeed,speedMemory:null};var buff={height:30,width:30,x:null,y:null,xMemomy:null,yMemomy:null,activated:!1};const playerBody={height:140,width:20},startBuffAreaX=arenaWidth/2/2,endBuffAreaX=3*startBuffAreaX,startBuffAreaY=arenaHeight/2/2,endBuffAreaY=3*arenaHeight;var buffTimer=null;function clearBuff(){"none"!==buffElement.css("display")&&(buffElement.css("display","none"),buffElement.css("top","-100px"),buffElement.css("left","-100px"),buff.x=-100,buff.y=-100),setTimeout(setBuffPosition,10000)}function replaceBuff(){clearTimeout(buffTimer),clearBuff()}function setBuffPosition(){var a=Math.floor(Math.random()*arenaWidth),b=Math.floor(Math.random()*arenaHeight);buff.x=a>startBuffAreaX&&a<endBuffAreaX?a:startBuffAreaX,buff.y=b>startBuffAreaY&&b<endBuffAreaY?b:startBuffAreaY,buff.xMemomy=buff.x,buff.yMemomy=buff.y,buffElement.css("left",`${buff.x}px`),buffElement.css("top",`${buff.y}px`),"none"===buffElement.css("display")&&buffElement.css("display","block"),buffTimer=setTimeout(()=>{buff.x===buff.xMemomy&&buff.y===buff.yMemomy&&clearBuff()},60000)}const buffEffect={freezeOpponent:a=>{let b=5;congelarAudio.play(),"player1"===a?(player2.settings.speed-=5,player2Element.css("backgroundColor","MediumTurquoise"),setTimeout(()=>{player2.settings.speed+=b,player2Element.css("backgroundColor","rgb(0, 81, 255)"),buff.activated=!1},4000)):(player1.settings.speed-=5,player1Element.css("backgroundColor","MediumTurquoise"),setTimeout(()=>{player1.settings.speed+=b,player1Element.css("backgroundColor","rgb(0, 81, 255)"),buff.activated=!1},4000))},speeder:a=>{let b=4;"player1"===a?(player1.settings.speed+=4,player1Element.css("backgroundColor","SandyBrown\t"),euSouAVelocidadeAudio.play(),setTimeout(()=>{player1.settings.speed-=b,player1Element.css("backgroundColor","rgb(0, 81, 255)"),buff.activated=!1},7000)):(player2.settings.speed+=4,player2Element.css("backgroundColor","SandyBrown\t"),euSouAVelocidadeAudio.play(),setTimeout(()=>{player2.settings.speed-=b,player2Element.css("backgroundColor","rgb(0, 81, 255)"),buff.activated=!1},7000))},ghostBall:()=>{ballElement.css("opacity",0),risada2Audio.play(),setTimeout(()=>{ballElement.css("opacity",1),buff.activated=!1},2000)},ghostPlayer:a=>{"player1"===a?(player2Element.css("opacity",0),risada1Audio.play(),setTimeout(()=>{player2Element.css("opacity",1),buff.activated=!1},2000)):(player1Element.css("opacity",0),risada1Audio.play(),setTimeout(()=>{player1Element.css("opacity",1),buff.activated=!1},2000))},speederBall:()=>{ball.speed+=4,ballElement.css("backgroundColor","rgb(211, 31, 8)"),ballElement.css("boxShadow","0 0 14px rgb(255, 8, 8)"),ballElement.css("animation","intence infinite alternate 100ms"),tolokoAudio.play(),setTimeout(()=>{ball.speed-=4,ballElement.css("boxShadow","none"),ballElement.css("animation","none"),buff.activated=!1},900)}},buffEffectList=["freezeOpponent","speeder","ghostBall","ghostPlayer","speederBall"];function player1Moviment(a){inGame&&"player"===a?(player1.y+=player1.settings.speed*player1.directionY,player1.y+playerBody.height>=arena.height?player1.directionY=-1:0>=player1.y&&(player1.directionY=1),player1Element.css("top",player1.y+"px")):inGame&&"comp"==a&&(ball.x<arena.width/2&&0>ball.directionX?ball.y+ball.height/2>player1.y+playerBody.height/2+player1.settings.speed?player1.y+playerBody.height<=arena.height&&(player1.y+=player1.settings.speed):ball.y+ball.height/2<player1.y+playerBody.height/2-player1.settings.speed&&0<=player1.y&&(player1.y-=player1.settings.speed):player1.y=player1.y+playerBody.height/2>arena.height/2?player1.y-player1.settings.speed:player1.y+playerBody.height/2<arena.height/2&&player1.y+playerBody.height/2>arena.height/2-10?player1.y+0:player1.y+player1.settings.speed,player1Element.css("top",player1.y+"px"))}function player2Moviment(a){inGame&&"player"===a?(player2.y+=player2.settings.speed*player2.directionY,player2.y+playerBody.height>=arena.height?player2.directionY=-1:0>=player2.y&&(player2.directionY=1),player2Element.css("top",player2.y+"px")):inGame&&"comp"===a&&(ball.x>arena.width/2&&0<ball.directionX?ball.y+ball.height/2>player2.y+playerBody.height/2+player2.settings.speed?player2.y+playerBody.height<=arena.height&&(player2.y+=player2.settings.speed):ball.y+ball.height/2<player2.y+playerBody.height/2-player2.settings.speed&&0<=player2.y&&(player2.y-=player2.settings.speed):player2.y=player2.y+playerBody.height/2<arena.height/2?player2.y+player2.settings.speed:player2.y+playerBody.height/2>arena.height/2&&player2.y+playerBody.height/2<arena.height/2+10?player2.y-0:player2.y-player2.settings.speed,player2Element.css("top",player2.y+"px"))}function ballMoviment(){if(ball.x+=ball.speed*ball.directionX,ball.y+=ball.speed*ball.directionY,ball.y+ball.height>arena.height?(collisionDownAudio.play(),ball.directionY*=-1):0>ball.y&&(collisionUpAudio.play(),ball.directionY*=-1),((ball.x>arena.width-20||0>ball.x)&&(ball.x>arena.width/2?(p1Pointes+=1,player1PointsElement.text(p1Pointes),player1SideEmoje.css("opacity",1),setTimeout(()=>player1SideEmoje.css("opacity",0),800)):(p2Pointes+=1,player2PointsElement.text(p2Pointes),player2SideEmoje.css("opacity",1),setTimeout(()=>player2SideEmoje.css("opacity",0),800)),ball.directionY=5<getRandom()?1:-1,ball.directionX*=-1,ball.x=ball.initialPosX,ball.y=ball.initialPosY,ball.speed=0,setTimeout(()=>{ball.speed=ball.speedMemory},1e3),winnerAudio.play()),ball.x<=player1.x+playerBody.width&&ball.x>player1.x+playerBody.width-playerBody.width&&ball.y+ball.height>=player1.y&&ball.y<=player1.y+playerBody.height)){let a=ball.directionY;ball.directionY=(player1.y+playerBody.height/2-(ball.y+ball.height/2))/20,console.log(ball.directionY),ball.y>player1.y+3&&ball.y<player1.y+playerBody.height-3?0<a&&0>ball.directionY?ball.directionY*=-1:0>a&&0<ball.directionY&&(ball.directionY*=-1):(ball.y<player1.y+5&&0<ball.directionY?ball.directionY*=-1:ball.y>player1.y+playerBody.height-5&&0>ball.directionY&&(ball.directionY*=-1),console.clear(),console.log("canto"),console.log(ball.directionY)),ball.directionX=1,collisionPlayerAudio.play(),ballElement.css("backgroundColor",colors[getRandom()])}if(ball.x>=player2.x+playerBody.width&&ball.x<player2.x+2*playerBody.width&&ball.y+ball.height>=player2.y&&ball.y<=player2.y+playerBody.height){let a=ball.directionY;ball.directionY=(player2.y+playerBody.height/2-(ball.y+ball.height/2))/20,ball.y>player2.y+3&&ball.y<player2.y+playerBody.height-3?0<a&&0>ball.directionY?ball.directionY*=-1:0>a&&0<ball.directionY&&(ball.directionY*=-1):(ball.y<player2.y+3&&0<ball.directionY?ball.directionY*=-1:ball.y>player2.y+playerBody.height-3&&0>ball.directionY&&(ball.directionY*=-1),console.clear(),console.log("canto"),console.log(ball.directionY)),ball.directionX=-1,collisionPlayerAudio.play(),ballElement.css("backgroundColor",colors[getRandom()])}1===ball.directionX?ball.x+ball.width>=buff.x&&ball.x+ball.width<=buff.x+buff.width&&(ball.y<buff.y+buff.height&&ball.y>buff.y||ball.y+ball.height<buff.y+buff.height&&ball.y+ball.height>buff.y)&&(buff.activated=!0,replaceBuff(),buffEffect[buffEffectList[Math.floor(Math.random()*buffEffectList.length)]]("player1")):-1===ball.directionX&&ball.x<buff.x+buff.width&&ball.x>buff.x&&(ball.y<buff.y+buff.height&&ball.y>buff.y||ball.y+ball.height<buff.y+buff.height&&ball.y+ball.height>buff.y)&&(buff.activated=!0,replaceBuff(),buffEffect[buffEffectList[Math.floor(Math.random()*buffEffectList.length)]]("player2")),ballElement.css("top",ball.y+"px"),ballElement.css("left",ball.x+"px")}function teclaDw(a){if(!pauseMemory.onPause){let b=a.key;switch(b.toLowerCase()){case player1.settings.upKey.toLowerCase():player1.directionY=-1;break;case player2.settings.upKey.toLowerCase():player2.directionY=-1;break;case player1.settings.downKey.toLowerCase():player1.directionY=1;break;case player2.settings.downKey.toLowerCase():player2.directionY=1;break;case player2.settings.pauseKey.toLowerCase():player2.paused||(player2.paused=!0,player2.directionMemory=player2.directionY,player2.directionY=0);break;case player1.settings.pauseKey.toLowerCase():player1.paused||(player1.paused=!0,player1.directionMemory=player1.directionY,player1.directionY=0);break;case"p":pauseGame();break;default:console.log("!!!");}}}function teclaUp(a){if(!pauseMemory.onPause){let b=a.key;switch(b.toLowerCase()){case player1.settings.upKey.toLowerCase():player1.directionY=-1;break;case player2.settings.upKey.toLowerCase():player2.directionY=-1;break;case player1.settings.downKey.toLowerCase():player1.directionY=1;break;case player2.settings.downKey.toLowerCase():player2.directionY=1;break;case player1.settings.pauseKey.toLowerCase():player1.paused=!1,0===player1.directionY&&(player1.directionY=player1.directionMemory);break;case player2.settings.pauseKey.toLowerCase():player2.paused=!1,0===player2.directionY&&(player2.directionY=player2.directionMemory);break;default:console.log("!!!");}}}function update(){inGame&&!pauseMemory.onPause&&(player1Moviment(player1.type),player2Moviment(player2.type),ballMoviment()),frames=requestAnimationFrame(update)}function startGame(){if(clearBuff(),$(document).on("keyup",teclaUp),$(document).on("keydown",teclaDw),$("#ready-container").css("display","none"),$("#modal").css("display","none"),timer.text(defaultTime),!inGame){cancelAnimationFrame(frames);let a=!0,b=defaultTime-1;inGame=!0,player1.directionY=0,player1.x=player1.initialPosX,player1.y=player1.initialPosY,player2.x=player2.initialPosX,player2.y=player2.initialPosY,ball.x=ball.initialPosX,ball.y=ball.initialPosY,ball.speedMemory=ball.speed,p1Pointes=0,p2Pointes=0,btnClickedAudio.play();let c=setInterval(()=>{timer.text(b),b-=1,btnClickedAudio.play(),0>b&&(a=!1),a||(clearInterval(c),timer.css("display","none"),ballElement.css("display","block"),update())},1100)}}function setDefinitions(a){a.preventDefault();let b=$("#op1-player1-def"),c=$("#op2-player1-def"),d=$("#op1-player2-def"),e=$("#op2-player2-def");player1.type=b.prop("checked")?b.val():c.val(),player2.type=d.prop("checked")?d.val():e.val(),$("#definitions-form").css("display","none"),$("#ready-container").css("display","block")}function saveConfigurations(){player1.settings.speed=parseInt($("#player1-speed").val()),player2.settings.speed=parseInt($("#player2-speed").val()),ball.speed=parseInt($("#ball-speed").val()),player1.settings.upKey=$("#player1-keyup").val().toLowerCase(),player1.settings.downKey=$("#player1-keydown").val().toLowerCase(),player1.settings.pauseKey=$("#player1-keypause").val().toLowerCase(),player2.settings.upKey=$("#player2-keyup").val().toLowerCase(),player2.settings.downKey=$("#player2-keydown").val().toLowerCase(),player2.settings.pauseKey=$("#player2-keypause").val().toLowerCase(),$("#container").css("display","block"),$("#configs").css("display","none"),localStorage.setItem("player1",JSON.stringify(player1.settings)),localStorage.setItem("player2",JSON.stringify(player2.settings)),localStorage.setItem("ball",JSON.stringify(ball))}function goBack(){$("#definitions-form").css("display","block"),$("#ready-container").css("display","none")}function pauseGame(){buff.activated?(btnPause.css("backgroundColor","red"),setTimeout(()=>{btnPause.css("backgroundColor","rgba(9, 114, 114, 0.253)")},800)):pauseMemory.onPause?(player1.settings.speed=pauseMemory.player1Speed,player2.settings.speed=pauseMemory.player2Speed,ball.speed=pauseMemory.ballSpeed,pauseMemory.onPause=!1,btnPause.css("backgroundColor","rgba(9, 114, 114, 0.253)")):(pauseMemory.player1Speed=player1.settings.speed,pauseMemory.player2Speed=player2.settings.speed,pauseMemory.ballSpeed=ball.speed,player1.settings.speed=0,player2.settings.speed=0,ball.speed=0,pauseMemory.onPause=!0,btnPause.css("backgroundColor","rgba(9, 114, 114, 0.900)"))}