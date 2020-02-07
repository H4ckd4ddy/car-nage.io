var menuMap = [];
var menuLoop;
var nbAleaPilotLoop;
var autoPilotLoop;
var tempo = [50,50];
bordureMap(menuMap);

function showMenu() {
    clearInterval(run);
    document.getElementById('btnNewGame').removeAttribute('hidden');
    frameMenu()
}

function frameMenu() {
	
    affichageMurs(menuMap);
    affichageJoueurs();
    
    var logo = new Image();
    logo.src = 'img/logo.png';

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.drawImage(logo, 200, 200, 400, 400);
    context.restore();
    
    context.font = '20px Verdana';
    context.fillText(joueurs[0].score + '/' + joueurs[1].score, 50, 100);

}