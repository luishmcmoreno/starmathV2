var Vitoria = {
	

	preload: function(){
		this.load.image('backgroundGameOver', 'recursos/imagens/background-game-over.png');		
		this.load.image('botaoMenu', 'recursos/imagens/botao-menu.png');
		this.load.image('botaoJogaNovamente', 'recursos/imagens/botao-jogar-novamente.png');
		this.load.image('botaoJogaNovamenteProximoNivel', 'recursos/imagens/jogar-prox-nivel.png');
		this.load.image('astronauta', 'recursos/imagens/astronauta.png');
	},

	create: function(){

		this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

		this.add.sprite(0, 0, 'backgroundGameOver');
		this.add.sprite(100, 100, 'astronauta');	
		this.add.button(this.world.centerX - (245/2), this.world.centerY, 'botaoMenu', this.voltaProMenu, this);
		this.add.button(this.world.centerX - (245/2), this.world.centerY  + 55, 'botaoJogaNovamente', this.jogaNovamente, this);

		
		this.add.text(this.world.centerX - 155, this.world.centerY - 240, 'Você conseguiu! Parabéns!!!', {
				font: "26px Arial",
		        fill: "#ffffff",
		        align: "left"
			});


		if (nivel < 4){
			this.add.button(
				this.world.centerX - (245/2), 
			 	this.world.centerY  + 110, 
			 	'botaoJogaNovamenteProximoNivel', 
			 	this.jogaNovamenteProximoNivel, 
			 	this);
		}


	},
	
	voltaProMenu: function(){
		starMath.state.start('Menu');
	},

	jogaNovamente: function(){
		starMath.state.start('Game');
	},

	jogaNovamenteProximoNivel: function(){
		nivel ++;
		starMath.state.start('Game');
	}	

};