/*
#####################################################################################
#                                                                                   #
#	Fichier contenant les constructeurs d'objets dynamiques (joueurs,projectiles)   #
#                                                                                   #
#####################################################################################
*/


var player = function(id, x, y, angle=0) {
	
	//propriétés basiques
	this.id = id;
	this.x = x;
	this.y = y;
	this.angle = angle;
	this.status = 'ok';
	this.score = 0;
	this.remote = (local_player_id != this.id);
	
	//Les vitesses sont des "pas" en pixels
	this.move_speed = default_move_speed;
	this.rotation_speed = default_move_speed;
	
	//temps en seconde entre 2 tirs
	this.fire_delay = default_fire_delay;
	
	//timestamp du dernier tir
	this.last_shoot = 0;
	
	//codes des touches pour ce joueur
	this.key_up = default_up_key[0];
	this.key_down = default_down_key[0];
	this.key_left = default_left_key[0];
	this.key_right = default_right_key[0];
	this.key_fire = default_fire_key[0];

	this.set_position = function(x,y,angle) {
		this.x = x;
		this.y = y;
		this.angle = angle;
	};

	this.send_position = function() {
		socket.emit('j', [Math.round(this.id),Math.round(this.x),Math.round(this.y),Math.round(this.angle)]);
	}

	this.rotate_left = function() {
		
		var new_angle = this.angle - this.rotation_speed;
		
		//application de la rotation uniquement si le test de collision retourne true (pas de collision)
		if(this.test_collision(this.x, this.y, new_angle)){
			this.angle = new_angle;
			this.reset_angle();
			this.send_position();
		}
		
	};
	
	this.rotate_right = function() {
		
		var new_angle = this.angle + this.rotation_speed;
		
		//application de la rotation uniquement si le test de collision retourne true (pas de collision)
		if(this.test_collision(this.x, this.y, new_angle)){
			this.angle = new_angle;
			this.reset_angle();
			this.send_position()
		}
		
	};
	
	this.forward = function() {
		
		//calcul de la nouvelle position (x & y) par trigonometrie à partir de l'angle et de la vitesse
		var new_x = this.x + Math.cos((this.angle-90)*(Math.PI/180)) * this.move_speed;
		var new_y = this.y + Math.sin((this.angle-90)*(Math.PI/180)) * this.move_speed;
		
		//application du mouvement uniquement si le test de collision retourne true (pas de collision)
		if(this.test_collision(new_x, new_y, this.angle)){
			this.x = new_x;
			this.y = new_y;
			this.send_position()
		}
		
	};
	
	this.backward = function() {
		
		//calcul de la nouvelle position (x & y) par trigonometrie à partir de l'angle et de la vitesse
		var new_x = this.x - Math.cos((this.angle-90)*(Math.PI/180)) * this.move_speed;
		var new_y = this.y - Math.sin((this.angle-90)*(Math.PI/180)) * this.move_speed;
		
		//application du mouvement uniquement si le test de collision retourne true (pas de collision)
		if(this.test_collision(new_x, new_y, this.angle)){
			this.x = Math.round(new_x);
			this.y = Math.round(new_y);
			this.send_position()
		}
		
	};
	
	this.reset_angle = function() {
		
		//cette fonction permet de garder la valeure de l'angle dans une fouchette acceptable (0 à 360)
		if(this.angle < 0){
			this.angle += 360;
		}else if(this.angle >= 360){
			this.angle -= 360;
		}
		
	};
	
	this.compute_hitbox = function(x,y,angle) {
		
		//Calul les cordonnées X & Y des quatre coins du joueur via des formules de trigonometrie
		
		var angle_reference = (angle - 90);
		var l = player_length;
		var L = player_width;
		
		var angle_coin = (90 - (Math.atan((l / 2) / (L / 2)) * 180 / Math.PI));
		var diagonale = Math.sqrt( Math.pow((l / 2), 2) + Math.pow((L / 2), 2) );
		
		var angles = [];
		
		angles[0] = (angle_reference - angle_coin) * Math.PI / 180;
		angles[1] = (angle_reference + angle_coin) * Math.PI / 180;
		angles[2] = (angle_reference + 180 - angle_coin) * Math.PI / 180;
		angles[3] = (angle_reference + 180 + angle_coin) * Math.PI / 180;
		
		var coins = [];
		
		
		for(var i = 0;i < angles.length;i++){
            coins[i] = {};
			coins[i].x = x + ( Math.cos(angles[i]) * diagonale );
            coins[i].y = y + ( Math.sin(angles[i]) * diagonale );
		}
		
		return coins;
		
	};
	
	//fonction qui test une eventuelle collision entre un joueur et les murs, à partir de sa futur position (centre)
	this.test_collision = function(new_x, new_y, new_angle) {
		
		//calcul de la position de 4 coins du joueur (actuelle et future)
		var coins_joueur = this.compute_hitbox(this.x,this.y,this.angle);
		var nouveau_coins_joueur = this.compute_hitbox(new_x, new_y, new_angle);
		
		//pour chaque mur
		for(var i = 0;i < map.length;i++){
			
			//pour chaque face de chaque mur
			for(var j = 0;j < map[i].faces.length;j++){
				
				var face = map[i].faces[j];
				
				//pour chaque coin du joueur, sur chaque face de chaque mur
				for(var k = 0;k < coins_joueur.length;k++){
					
					if(face.orientation === "vertical"){
						
						//test si le point est au niveau du mur
						if((nouveau_coins_joueur[k]["y"] >= face.debut["y"]) && (nouveau_coins_joueur[k]["y"] <= face.fin["y"])){
							
							if(coins_joueur[k]["x"] < face.debut["x"]){
								
								if(nouveau_coins_joueur[k]["x"] >= face.debut["x"]){
									return false;
								}
								
							}else if(coins_joueur[k]["x"] > face.debut["x"]){
								
								if(nouveau_coins_joueur[k]["x"] <= face.debut["x"]){
									return false;
								}
								
							}
							
						}
						
					}
					
					if(face.orientation === "horizontal"){
						
						//test si le point est au niveau du mur
						if((nouveau_coins_joueur[k]["x"] >= face.debut["x"]) && (nouveau_coins_joueur[k]["x"] <= face.fin["x"])){
							
							if(coins_joueur[k]["y"] < face.debut["y"]){
								
								if(nouveau_coins_joueur[k]["y"] >= face.debut["y"]){
									return false;
								}
								
							}else if(coins_joueur[k]["y"] > face.debut["y"]){
								
								if(nouveau_coins_joueur[k]["y"] <= face.debut["y"]){
									return false;
								}
								
							}
							
						}
						
					}
					
				}
				
				
				//Ancien systeme de collision
				/*if( (face.orientation === "vertical") && (nouveau_x < (face.debut["x"] + 7)) && (nouveau_x > (face.debut["x"] - 7)) && (nouveau_y >= face.debut["y"]) && (nouveau_y <= face.fin["y"]) ){
					
					return false;
					
				}else if( (face.orientation === "horizontal") && (nouveau_y < (face.debut["y"] + 7)) && (nouveau_y > (face.debut["y"] - 7)) && (nouveau_x >= face.debut["x"]) && (nouveau_x <= face.fin["x"]) ){
					
					return false;
					
				}*/
				
			}
			
		}
		
		//si une collision est detectée, le return false arretera la fonction
		//sinon on return true
		return true;
		
	};
	
	//function qui genere les projectiles
	this.fire = function() {
		
		//si le joueur est vivant et qu'il n'a pas depasé son ratio de tir
		if(this.last_shoot <= (Date.now() - (this.fire_delay * 1000)) && this.status !== 'mort'){
			
			var new_x = this.x + Math.cos((this.angle-90)*(Math.PI/180)) * 50;
			var new_y = this.y + Math.sin((this.angle-90)*(Math.PI/180)) * 50;
			
			bullets.push(new bullet(new_x, new_y, this.angle));

			socket.emit('tir', {'id':this.id,'x':Math.round(new_x),'y':Math.round(new_y),'angle':Math.round(this.angle)});

			this.last_shoot = Date.now();
		}
		
	}
	
};

var bullet = function(x, y, angle, ttl=15) {
	
	//propriétés basiques
	this.id = bullets.length;
	this.previous_x = x;
	this.previous_y = y;
	this.x = x;
	this.y = y;
	this.angle = angle;
	this.move_speed = default_move_speed;
	this.diameter = bullet_diameter;
	this.ttl = ttl;
	
	this.way = function() {
		
		//memorisation des anciennes coordonnées
		this.previous_x = this.x;
		this.previous_y = this.y;
		
		//calcul de la nouvelle position (x & y) par trigonometrie à partir de l'angle et de la vitesse
		this.x += Math.round(Math.cos((this.angle-90)*(Math.PI/180)) * this.move_speed);
		this.y += Math.round(Math.sin((this.angle-90)*(Math.PI/180)) * this.move_speed);
		
		this.test_collision();
		this.test_player_collision();
		
	};
	
	this.bounce = function(sens) {

		if(this.ttl <= 0){
			this.explode();
			return;
		}
		
		switch(sens){
			case "vertical": this.angle = (270) - (this.angle - 90);break;
			case "horizontal": this.angle = 180 - this.angle;break;
		}
		
		if(this.angle < 0){
			this.angle += 360;
		}else if(this.angle >= 360){
			this.angle -= 360;
		}
		
		this.ttl--;
		
	};

	this.explode = function(){
		bullets.splice(this.id, 0, 'explosé');
        bullets.splice(this.id+1, 1);
	}
	
	this.test_player_collision = function() {
		
		for(var i = 0;i < players.length;i++){
			
			var angles = players[i].compute_hitbox(players[i].x,players[i].y,players[i].angle);
			
			//calcul utilisant des vecteurs pour verifier la presence d'un projectile dans la hitbox du joueur
			var AMx = this.x - angles[0].x;
			var AMy = this.y - angles[0].y;
			var ABx = angles[1].x - angles[0].x;
			var ABy = angles[1].y - angles[0].y;
			var ADx = angles[3].x - angles[0].x;
			var ADy = angles[3].y - angles[0].y;
			
			var AMdotAB = AMx * ABx + AMy * ABy;
			var ABdotAB = ABx * ABx + ABy * ABy;
			var AMdotAD = AMx * ADx + AMy * ADy;
			var ADdotAD = ADx * ADx + ADy * ADy;
			
			if (0 < AMdotAB && AMdotAB < ABdotAB && 0 < AMdotAD && AMdotAD < ADdotAD && players[i].status !== 'mort') {
				
				this.explode();

                explosion(players[i].x,players[i].y);
				players[i].status = 'mort';
				
				var alives_players = [];
                for(let j = 0;j < players.length;j++){
                	if(players[j].status != 'mort'){
                		alives_players.push(players[j]);
					}
                }

                if(alives_players.length <= 1){
                	
                	(function(alives_players){
                		//delai d'attente pour verifier que le joueur ne va pas mourir
						setTimeout(function () {
		                    run.stop()
		                    if(alives_players.length == 1){
		                    	waiting_screen("Victoire d'un joueur inconnue")
		                    }else{
		                    	waiting_screen("Match nul")
		                    }
		                }, 3000);
		                setTimeout(function () {
		                	socket.emit('end', {});
		                }, 6000);
		            })(alives_players);
				}
				
			}
			
		}
		
	};
	
	this.test_collision = function() {
		
		for(var i = 0;i < map.length;i++){
			
			for(var j = 0;j < map[i].faces.length;j++){
				
				var face = map[i].faces[j];
				
				
				//Ancien systeme de colision
				//if( /*(face.orientation === "vertical") &&*/ (this.x <= (face.debut["x"] + erreur)) && (this.x >= (face.debut["x"] - erreur)) && (this.y >= face.debut["y"]) && (this.y <= face.fin["y"]) ){
				//	
				//	this.rebond(face.orientation);
				//	
				//	/*if(this.y > face.debut["y"]){
				//		this.y = face.debut["y"] + 1;
				//	}else if(this.y < face.debut["y"]){
				//		this.y = face.debut["y"] - 1;
				//	}*/
				//	
				//}
				//
				//if( /*(face.orientation === "horizontal") &&*/ (this.y <= (face.debut["y"] + erreur)) && (this.y >= (face.debut["y"] - erreur)) && (this.x >= face.debut["x"]) && (this.x <= face.fin["x"]) ){
				//	
				//	this.rebond(face.orientation);
				//	
				//	/*if(this.y > face.debut["y"]){
				//		this.y = face.debut["y"] + 1;
				//	}else if(this.y < face.debut["y"]){
				//		this.y = face.debut["y"] - 1;
				//	}*/
				//	
				//}
				
				if(face.orientation === "vertical"){
					
					if((this.y >= face.debut["y"]) && (this.y <= face.fin["y"])){
						
						if(this.previous_x < face.debut["x"]){
							
							if(this.x >= face.debut["x"]){
								this.x = face.debut["x"] - 5;
								this.bounce(face.orientation);
							}
							
						}else if(this.previous_x > face.debut["x"]){
							
							if(this.x <= face.debut["x"]){
								this.x = face.debut["x"] + 5;
								this.bounce(face.orientation);
							}
							
						}
						
					}
					
				}
				
				if(face.orientation === "horizontal"){
					
					if((this.x >= face.debut["x"]) && (this.x <= face.fin["x"])){
						
						if(this.previous_y < face.debut["y"]){
							
							if(this.y >= face.debut["y"]){
								this.y = face.debut["y"] - 5;
								this.bounce(face.orientation);
							}
							
						}else if(this.previous_y > face.debut["y"]){
							
							if(this.y <= face.debut["y"]){
								this.y = face.debut["y"] + 5;
								this.bounce(face.orientation);
							}
							
						}
						
					}
					
				}
				
			}
			
		}
		
	};
};

