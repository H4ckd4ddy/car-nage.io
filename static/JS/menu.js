var wait_action = false;

function action_handler(event){
    document.removeEventListener("keydown", action_handler);
    wait_action = false;
    socket.emit('ready', {});
}

function waiting_screen(msg='', need_action=false) {

    if(run){
       run.stop();
    }

    if(wait_action){
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
        wait_action = true;
        document.addEventListener("keydown", action_handler);
    }
}