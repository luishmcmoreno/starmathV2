var EscolheNiveis = {

	preload: function(){
		this.load.image('imgNivel1', 'recursos/imagens/nivel1.png');
		this.load.image('imgNivel2', 'recursos/imagens/nivel2.png');
		this.load.image('imgNivel3', 'recursos/imagens/nivel3.png');
		this.load.image('imgNivel4', 'recursos/imagens/nivel4.png');
		this.load.image('botaoMenu', 'recursos/imagens/botao-menu.png');
	},

	create: function(){

		this.add.sprite(0, 0, 'backgroundTelaInicial');
		this.add.button(this.world.centerX - 140, this.world.centerY - 50, 'imgNivel1', this.nivelAdicao, this);
		this.add.button(this.world.centerX, this.world.centerY - 50, 'imgNivel2', this.nivelSubtracao, this);
		this.add.button(this.world.centerX - 140, this.world.centerY + 20, 'imgNivel3', this.nivelMultiplicacao, this);
		this.add.button(this.world.centerX, this.world.centerY + 20, 'imgNivel4', this.nivelDivisao, this);
		
		this.add.text(this.world.centerX - 100, this.world.centerY - 100, 'Escolha seu nível!', {
			font: "25px Arial",
			fill: "#ffffff",
			align: "center",
		});
 
 		this.add.button(this.world.centerX - 120, this.world.centerY + 90, 'botaoMenu', this.voltaMenu, this);
		

	},

	nivelAdicao : function() {
		nivel = 1;
		this.state.start('Game');
	},

	nivelSubtracao : function() {
		nivel = 2;
		this.state.start('Game');
	},

	nivelMultiplicacao : function() {
		nivel = 3;
		this.state.start('Game');
	},

	nivelDivisao : function() {
		nivel = 4;
		this.state.start('Game');
	},

	voltaMenu : function(){
		this.state.start('Menu');
	}

}; 