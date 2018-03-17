var GameOver = {
	preload: function(){
		this.load.image('botaoMenu','recursos/imagens/botao-menu.png');
		this.load.image('backgroundGameOver', 'recursos/imagens/background-game-over.png');

	},

	create: function(){
		window.plugins.insomnia.allowSleepAgain();
		this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
 	
 		this.add.sprite(0, 0, 'backgroundGameOver');
		this.add.button(this.world.centerX - (245/2), this.world.centerY - 110, 'botaoIniciar', this.jogaNovamente, this);
		this.add.button(this.world.centerX - (245/2), this.world.centerY - 50, 'botaoMenu', this.voltaProMenu, this);
		this.add.button(this.world.centerX - (245/2), this.world.centerY + 10, 'botaoRanking', this.salvaPontuacao, this);

		
		this.add.text(this.world.centerX - 95, this.world.centerY - 250, 'Game-over!!', {
			font: "34px Arial",
		    fill: "#ffffff",
		    align: "center"
		});

		this.add.text(this.world.centerX - 50, this.world.centerY + 150, 'Uau!!', {
		 		font: "34px Arial",
		         fill: "#ffffff",
		         align: "center"
		});
		
		this.add.text(this.world.centerX - 80, this.world.centerY + 190, pontuacao + ' pontos', {
		 		font: "34px Arial",
		         fill: "#ffffff",
		        align: "center"
		});
	},

	salvaPontuacao: function(){
		
	},

	jogaNovamente: function(){
		starMath.state.start('Game');
	},

	voltaProMenu: function(){
		starMath.state.start('Menu');
	}

};