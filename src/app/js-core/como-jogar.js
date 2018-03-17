var ComoJogar = {
	
	preload: function(){
		this.load.image('background', 'recursos/imagens/background-game-over.png');
		this.load.image('botaoMenu', 'recursos/imagens/botao-menu.png');
		
	},

	create: function(){
		
		this.add.sprite(0, 0, 'background');

		this.textoMeta = this.add.text(50, 50, 'Atire no meteoro certo para ganhar pontos. Utilize os botões na parte inferior da tela ou a inclinação do celular.',{
			font: '30px Arial',
			fill: '#ffffff',
			align: 'center',
			strokeThickness: 3,
	    	wordWrap: true,
	    	wordWrapWidth: 250
		});
		this.add.button(this.world.centerX - (245/2), this.world.centerY + 120, 'botaoMenu', this.voltaProMenu, this);		
	},
	
	voltaProMenu: function(){
		starMath.state.start('Menu');
	}

};