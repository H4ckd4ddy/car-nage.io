

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

var lock_screen = false;

function action_handler(event){
    document.removeEventListener("click", action_handler);
    lock_screen = false;
    socket.emit('ready', {});
}

function waiting_screen(msg='', need_action=false) {

    if(run){
       run.stop();
    }

    if(lock_screen){
        return;
    }

    affichageMurs(generate_empty_map());
    
    var logo = new Image();
    logo.src = '/img/logo.png';

    
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.drawImage(logo, 200, 200, 400, 400);
    
    context.font = '30px Verdana';
    context.textAlign = 'center';
    context.fillText(msg, 400, 650);

    if(need_action){
        lock_screen = true;
        document.addEventListener("click", action_handler);
    }
}