
var menuMap = [];
bordureMap(menuMap);

/*function countdown(duree=3){
    if(duree > 0){
        console.log(duree)
        waiting_screen(duree);
        window.setTimeout(function(){
            countdown(duree-1);
        }, 1000);
    }else{
        new_game();
    }
}*/

function waiting_screen(msg='') {
	
    affichageMurs(menuMap);
    
    var logo = new Image();
    logo.src = '/img/logo.png';

    
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.drawImage(logo, 200, 200, 400, 400);
    
    context.font = '30px Verdana';
    context.textAlign = 'center';
    context.fillText(msg, 400, 650);
}