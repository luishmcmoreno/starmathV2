var Opcoes = {
	

	preload: function(){
		this.load.image('backgroundGameOver', 'recursos/imagens/background-game-over.png');		
		this.load.image('botaoMenu', 'recursos/imagens/botao-menu.png');
		this.load.image('botaoSetaControles', 'recursos/imagens/direita.png');
	},

	create: function(){

		this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

		this.add.sprite(0, 0, 'backgroundGameOver');		
		this.add.button(this.world.centerX - (245/2), this.world.centerY, 'botaoMenu', this.voltaProMenu, this);
		this.add.button(this.world.centerX - (245/2) + 30, this.world.centerY - 100, 'botaoSetaControles', this.setaControles, this);

		
		this.controlesText = this.add.text(this.world.centerX - 130, this.world.centerY - 130, 'Controles: Botões', {
				font: "20px Arial",
		        fill: "#ffffff",
		        align: "left"
			});
	},
	
	
	
	voltaProMenu: function(){
		starMath.state.start('Menu');
	},

	setaControles: function(){
		inclinaCelular = !inclinaCelular;
		if(inclinaCelular){
			this.controlesText.text = 'Controles: Inclinação do Aparelho';
		} else {
			this.controlesText.text = 'Controles: Botões';			
		}
	}

};