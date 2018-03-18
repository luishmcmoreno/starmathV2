import { resourcePath } from './constants';

declare var Phaser;

var inclinaCelular = false;
var pontuacao;
var nivel;

const width = window.innerWidth;
const heigth = window.innerHeight;

export const CoreGame = {
    VICTORY_POINTS: 200,
    SPEED_INCREMENT: 0.060,

    isMovingLeft: false,
    isMovingRight: false,

    isShooting: false,
    distanceToMoveOnClick: 120,
    distanceToMoveOnOrientation: 125,

    preload: function () {
      this.loadResources();
    },

    create: function () {
      this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

      this.backgroundSound = this.add.audio('backgroundSound');
      this.correctAnswerSound = this.add.audio('correctAnswerSound');
      this.incorrectAnswerSound = this.add.audio('incorrectAnswerSound');
      this.gameOverSound = this.add.audio('gameOverSound');
      this.explosionSound = this.add.audio('explosionSound');
      this.victorySound = this.add.audio('victorySound');

      this.maxRangeOperacao = 3;
      this.velocidadeMovimentacaoMeteoros = 0.5;

      this.criaCenarioBackground();
      this.criaNave();
      this.criaTiros();
      this.criaMeta();

      /*Device orientado, 
        API para detectar inclinações do celular e movimentar a nave
        */
      if (inclinaCelular) {
        window.addEventListener("deviceorientation", this.chamaHandlerOrientation, true);
      }

      //Texto
      this.textoPergunta = this.add.text(this.world.centerX - 175, 7, '', {
        font: "35px Arial",
        fill: "#ffffff",
        align: "left"
      });
      this.alteraPergunta();

      pontuacao = 0;
      this.textoPontuacao = this.add.text(this.world.centerX + 90, 7, pontuacao, {
        font: '35px Arial',
        fill: '#ffffff',
        align: 'center'
      });

      // Meteoros com a resposta
      this.meteoros = this.add.group();
      this.meteoros.enableBody = true;
      this.meteoros.physicsBodyType = Phaser.Physics.ARCADE;
      this.criaMeteoros();

    },

    update: function () {
      this.atualizacoes();
      // Faz meteoros descer (O GRUPO)


      this.movimentaMeteoros();

      if (this.isMovingRight && this.navinha.body.x < 296) {
        this.navinha.body.velocity.x = this.distanceToMoveOnClick;
      } else if (this.isMovingLeft && this.navinha.body.x > 0) {
        this.navinha.body.velocity.x = this.distanceToMoveOnClick * -1;
      }

      // Identificando colisão para cada um dos meteoros
      // objetos que recebem colisao, funcao, 
      this.physics.arcade.overlap(this.tiro, this.meteoroCerto, this.quandoAconteceColisaoCorreta, null, this);
      this.physics.arcade.overlap(this.tiro, this.meteoroErrado1, this.quandoAconteceColisaoErrada, null, this);
      this.physics.arcade.overlap(this.tiro, this.meteoroErrado2, this.quandoAconteceColisaoErrada, null, this);

      this.physics.arcade.overlap(this.navinha, this.meteoroCerto, this.colisaoNaveMeteoroCerto, null, this);
      this.physics.arcade.overlap(this.navinha, this.meteoroErrado1, this.colisaoNaveMeteoroErrado1, null, this);
      this.physics.arcade.overlap(this.navinha, this.meteoroErrado2, this.colisaoNaveMeteoroErrado2, null, this);

      this.checkGameOver();

    },

    loadResources: function () {
      this.load.image('cenario', `${resourcePath}/img/cenario.png`);
      this.load.image('navinha', `${resourcePath}/img/navinha.png`);
      this.load.image('umTiro', `${resourcePath}/img/tiro.png`);
      this.load.image('meteoro', `${resourcePath}/img/meteoro.png`);
      this.load.image('hearth', `${resourcePath}/img/hearth.png`);
      this.load.image('explosao', `${resourcePath}/img/explosao.png`);

      this.load.image('btnLeft', `${resourcePath}/img/left.png`);
      this.load.image('btnRight', `${resourcePath}/img/right.png`);
      this.load.image('btnShoot', `${resourcePath}/img/shoot.png`);

      this.load.audio('shootSound', `${resourcePath}/audio/somTiro.ogg`);
      this.load.audio('correctAnswerSound', `${resourcePath}/audio/correctAnswerSound.ogg`);
      this.load.audio('incorrectAnswerSound', `${resourcePath}/audio/incorrectAnswerSound.ogg`);
      this.load.audio('gameOverSound', `${resourcePath}/audio/gameOverSound.ogg`);
      this.load.audio('backgroundSound', `${resourcePath}/audio/backgroundSound.ogg`);
      this.load.audio('victorySound', `${resourcePath}/audio/victorySound.ogg`);
      this.load.audio('explosionSound', `${resourcePath}/audio/explosionSound.ogg`);
    },



    criaCenarioBackground: function () {
      if (inclinaCelular) {
        this.cenario = this.add.tileSprite(0, 48, width, heigth, 'cenario');
      } else {
        this.cenario = this.add.tileSprite(0, 48, width, heigth, 'cenario');			
      }

      this.hearth = this.add.sprite(this.world.centerX, 0, 'hearth');
      this.velocidadeScrollCenario = 2;
      this.backgroundSound.play(null, null, 0.5, true, null);

      this.vidas = 3;
      this.textoVidas = this.add.text(this.world.centerX + 20, 14, this.vidas, {
        font: '18px Arial',
        fill: '#ffffff',
        align: 'center'
      });
    },

    criaNave: function () {

      if (inclinaCelular) {
        this.navinha = this.add.sprite(this.world.centerX, this.world.centerY + 175, 'navinha');
      } else {
        this.navinha = this.add.sprite(this.world.centerX, this.world.centerY + 120, 'navinha');

        this.btnRight = this.add.button(this.world.centerX * 2 - 64, this.world.centerY * 2 - 50, 'btnRight');
        this.btnRight.onInputDown.add(function () {
          this.isMovingRight = true;
        }, this);
        this.btnRight.onInputUp.add(function () {
          this.isMovingRight = false;
        }, this);


        this.btnLeft = this.add.button(0, this.world.centerY * 2 - 50, 'btnLeft');
        this.btnLeft.onInputDown.add(function () {
          this.isMovingLeft = true;
        }, this);
        this.btnLeft.onInputUp.add(function () {
          this.isMovingLeft = false;
        }, this);
      }

      this.physics.enable(this.navinha, Phaser.Physics.ARCADE); // aplicar físicas (object, system)
    },


    criaTiros: function () {

      this.tiroVelocidade = 0;

      this.somTiro = this.add.audio('somTiro');

      this.tiro = this.add.group();
      // Faz com que os objetos do grupo tenham um 'corpo' e em seguida seta o sistema de fisica aplicado a esses corpos
      this.tiro.enableBody = true;
      this.tiro.physicsBodyType = Phaser.Physics.ARCADE;
      // Cria um grupo de 30 sprites usando a imagem da key fornecida
      this.tiro.createMultiple(30, 'umTiro');
      // Posiçao do tiro no bico da nave   ---- Altura em que o tiro sai, pra sair da boca da nave e não do meio da tela
      this.tiro.setAll('anchor.x', -0.9);
      this.tiro.setAll('anchor.y', 0.8);
      // Faz o objeto ser killado após sair da tela chamando automaticamente a função inWorld que retorna false	
      this.tiro.setAll('outOfBoundsKill', true);
      this.tiro.setAll('checkWorldBounds', true);

      if (inclinaCelular) {
        this.touchAtirar = this.input.pointer1;
      } else {
        this.btnShootr = this.add.button(this.world.centerX - 15, this.world.centerY * 2 - 50, 'btnShoot', function () {
          this.atira();
        }, this);

      }

    },


    criaMeteoros: function () {
      // reseta posição do gurpo no eixo y
      this.meteoros.y = 0;

      this.getPosicaoMeteoros();

      this.meteoroCerto = this.meteoros.create(this.posicoes[0], 65, 'meteoro');
      this.meteoroCerto.anchor.setTo(0.5, 0.5);
      this.textCorreto = this.add.text(this.meteoroCerto.x, this.meteoroCerto.y, this.respostaCorreta, {
        font: "20px Arial",
        fill: "#ffffff",
        stroke: "000",
        strokeThickness: 3,
        wordWrap: true,
        wordWrapWidth: this.meteoroCerto.width,
        align: "center"
      });
      this.textCorreto.anchor.set(0.5, 0.5);


      this.meteoroErrado1 = this.meteoros.create(this.posicoes[1], 65, 'meteoro');
      this.meteoroErrado1.anchor.setTo(0.5, 0.5);
      this.textErrado1 = this.add.text(this.meteoroErrado1.x, this.meteoroErrado1.y, this.respostaCorreta - this.getRandomInt(1, 7), {
        font: "20px Arial",
        fill: "#ffffff",
        stroke: "000",
        strokeThickness: 3,
        wordWrap: true,
        wordWrapWidth: this.meteoroErrado1.width,
        align: "center"
      });
      this.textErrado1.anchor.set(0.5, 0.5);


      this.meteoroErrado2 = this.meteoros.create(this.posicoes[2], 65, 'meteoro');
      this.meteoroErrado2.anchor.setTo(0.5, 0.5);
      this.textErrado2 = this.add.text(this.meteoroErrado2.x, this.meteoroErrado2.y, this.respostaCorreta - this.getRandomInt(1, 3), {
        font: "20px Arial",
        fill: "#ffffff",
        stroke: "000",
        strokeThickness: 3,
        wordWrap: true,
        wordWrapWidth: this.meteoroErrado2.width,
        align: "center"
      });
      this.textErrado2.anchor.set(0.5, 0.5);


    },

    quandoAconteceColisaoCorreta: function (tiroQueAcertou, meteoro) {
      tiroQueAcertou.kill();
      meteoro.kill();
      this.meteoroErrado1.kill();
      this.meteoroErrado2.kill();
      this.textCorreto.kill();
      this.textErrado1.kill();
      this.textErrado2.kill();
      pontuacao += 10;
      this.textoPontuacao.text = pontuacao;

      this.correctAnswerSound.play();
      this.aumentaRangeOperacoes();
      this.alteraPergunta();
      this.incrementaVelocidade();
      this.criaMeteoros();

      if (pontuacao >= this.VICTORY_POINTS) {
        this.backgroundSound.stop();
        this.victorySound.play();
        this.starMath.state.start('Vitoria');
      }


    },


    alteraPergunta: function () {
      var op = this.getRandomInt(1, nivel);
      var a = this.getRandomInt(1, this.maxRangeOperacao);
      var b = this.getRandomInt(1, this.maxRangeOperacao);


      if (op == 1) { //soma
        this.respostaCorreta = a + b;
        this.textoPergunta.text = a + '+' + b + " = ?"
      } else if (op == 2) { //subtração

        //Evita respostas das operações com negativos
        if (a < b) {
          var temp = a;
          a = b;
          b = temp;
        }

        this.respostaCorreta = a - b;
        this.textoPergunta.text = a + '-' + b + " = ?"
      } else if (op == 3) { //multiplicação
        a = this.getRandomInt(1, 10);
        b = this.getRandomInt(1, 10);
        this.respostaCorreta = a * b;
        this.textoPergunta.text = a + 'x' + b + " = ?"
      } else { //divisão -> op == 4
        //Evita respostas das operações com valores irracionais
        while (a % b != 0) {
          a = this.getRandomInt(1, 10);
          b = this.getRandomInt(1, 10);
        }
        this.respostaCorreta = a / b;
        this.textoPergunta.text = a + '÷' + b + " = ?"
      }
    },


    quandoAconteceColisaoErrada: function (tiroQueAcertou, meteoro) {
      tiroQueAcertou.kill();
      meteoro.kill();

      this.meteoroCerto.kill();
      this.meteoroErrado1.kill();
      this.meteoroErrado2.kill();

      this.textCorreto.kill();
      this.textErrado1.kill();
      this.textErrado2.kill();

      this.incorrectAnswerSound.play();

      this.alteraPergunta();
      this.criaMeteoros();
      // verifica vidas e chama game-over
      this.vidas--;
      this.textoVidas.text = this.vidas;

      if (pontuacao >= 10) {
        pontuacao -= 10;
        this.textoPontuacao.text = pontuacao;
      }

      this.checkGameOver();
    },

    atualizacoes: function () {

      this.cenario.tilePosition.y += this.velocidadeScrollCenario;



      //resetando para 0
      this.navinha.body.velocity.x = 0;

      if (inclinaCelular) {
        if (this.touchAtirar.isDown) {
          this.atira();
        }
      } //else if (this.isShooting){
      //this.atira();
      //}


    },

    atira: function () {

      this.umTiro = this.tiro.getFirstExists(false);

      this.somTiro.play();
      if (this.time.now > this.tiroVelocidade) {

        if (this.umTiro) {

          this.umTiro.reset(this.navinha.x, this.navinha.y);
          // Quão rápido sobe a bala
          this.umTiro.body.velocity.y = -200; //pixels por segundo - rate / velocidade
          // De quanto em quanto tempo sai uma bala
          this.tiroVelocidade = this.time.now + 300;
        }
      }
    },


    getPosicaoMeteoros: function () {
      this.posicoes = [
        this.getRandomInt(20, 235),
        this.getRandomInt(20, 235),
        this.getRandomInt(20, 235)
      ];


      this.posicoes.sort(function (a, b) {
        return a - b;
      });


      if (this.posicoes[1] - this.posicoes[0] <= 50) {
        this.posicoes[1] += 50;
      }
      if (this.posicoes[2] - this.posicoes[1] <= 50) {
        this.posicoes[2] += 100;
      }

      this.shuffle();
      // implementar lógica da posição dos meteoros, para que um não sobreponha o outro


    },

    shuffle: function () {
      var j, x, i;
      for (i = this.posicoes.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = this.posicoes[i - 1];
        this.posicoes[i - 1] = this.posicoes[j];
        this.posicoes[j] = x;
      }
    },


    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    chamaHandlerOrientation: function (e) {
      Reflect.apply(CoreGame.handleOrientation, CoreGame, [e])
    },

    handleOrientation: function (e) {

      /*maior que 1 e menor que -1 apenas para evitar de andar com o celular parado,
           pois mesmo praticamente parado é detectado inclinações.	 
           */
      if (e.gamma >= 1.5 && this.navinha.body.x < 296) {
        this.navinha.body.velocity.x = this.distanceToMoveOnOrientation;
        return; // quebra o fluxo, não executa resto do código
      } else if (e.gamma <= -1.5 && this.navinha.body.x > 0) {
        this.navinha.body.velocity.x = this.distanceToMoveOnOrientation * -1;
        return; // quebra o fluxo, não executa resto do código
      }

      // só volta pra zero quando não temm inclinação (tilt)
      this.navinha.body.velocity.x = 0;
    },

    checkGameOver: function () {
      if (inclinaCelular) {
        if (this.meteoros.y > 600 && this.vidas > 0) {
          this.vidas--;
          this.textoVidas.text = this.vidas;
          if (pontuacao >= 10) {
            pontuacao -= 10;
            this.textoPontuacao.text = pontuacao;
          }
          this.meteoroErrado1.kill();
          this.meteoroErrado2.kill();
          this.meteoroCerto.kill();
          this.textCorreto.kill();
          this.textErrado1.kill();
          this.textErrado2.kill();
          this.incorrectAnswerSound.play();
          this.criaMeteoros();
        } else if (this.meteoros.y > 600 && this.vidas <= 0) {
          this.gameOver();
        } else if (this.vidas <= 0) {
          this.gameOver();
        }
      } else {
        if (this.meteoros.y > 480 && this.vidas > 0) {
          this.vidas--;
          this.textoVidas.text = this.vidas;
          if (pontuacao >= 10) {
            pontuacao -= 10;
            this.textoPontuacao.text = pontuacao;
          }
          this.meteoroErrado1.kill();
          this.meteoroErrado2.kill();
          this.meteoroCerto.kill();
          this.textCorreto.kill();
          this.textErrado1.kill();
          this.textErrado2.kill();
          this.incorrectAnswerSound.play();
          this.criaMeteoros();
        } else if (this.meteoros.y > 480 && this.vidas <= 0) {
          this.gameOver();
        } else if (this.vidas <= 0) {
          this.gameOver();
        }
      }
    },

    gameOver: function () {

      this.backgroundSound.stop();
      this.gameOverSound.play(null, null, 0.2, null, null);

      if (inclinaCelular) {
        window.removeEventListener('deviceorientation', this.chamaHandlerOrientation, true);
      }

      this.velocidadeMovimentacaoMeteoros = 0.5;
      this.starMath.state.start('Game-over');
    },

    movimentaMeteoros: function () {
      this.meteoros.y += this.velocidadeMovimentacaoMeteoros;
      this.textCorreto.y += this.velocidadeMovimentacaoMeteoros;
      this.textErrado1.y += this.velocidadeMovimentacaoMeteoros;
      this.textErrado2.y += this.velocidadeMovimentacaoMeteoros;
    },

    incrementaVelocidade: function () {
      this.velocidadeMovimentacaoMeteoros += this.SPEED_INCREMENT;
    },

    aumentaRangeOperacoes: function () {
      this.maxRangeOperacao += 1;
    },

    criaExplosao: function (meteoro) {

      this.explosionSound.play();
      this.explosaoImg = this.add.sprite(this.navinha.x, this.navinha.y, 'explosao');

      this.time.events.add(400, function () {
        this.explosaoImg.kill();
      }, this);

    },

    colisaoNaveMeteoroCerto: function (navinha, meteoro) {
      this.criaExplosao();

      meteoro.kill();
      this.meteoroErrado1.kill();
      this.meteoroErrado2.kill();

      this.textCorreto.kill();
      this.textErrado1.kill();
      this.textErrado2.kill();

      this.alteraPergunta();
      this.criaMeteoros();
      // verifica vidas e chama game-over
      this.vidas--;
      this.textoVidas.text = this.vidas;

      if (pontuacao >= 10) {
        pontuacao -= 10;
        this.textoPontuacao.text = pontuacao;
      }

      this.checkGameOver();

    },

    colisaoNaveMeteoroErrado1: function (navinha, meteoro) {
      this.criaExplosao();

      meteoro.kill();
      this.meteoroCerto.kill()
      this.meteoroErrado2.kill();

      this.textCorreto.kill();
      this.textErrado1.kill();
      this.textErrado2.kill();

      this.alteraPergunta();
      this.criaMeteoros();
      // verifica vidas e chama game-over
      this.vidas--;
      this.textoVidas.text = this.vidas;

      if (pontuacao >= 10) {
        pontuacao -= 10;
        this.textoPontuacao.text = pontuacao;
      }

      this.checkGameOver();
    },
    colisaoNaveMeteoroErrado2: function (navinha, meteoro) {
      this.criaExplosao();

      meteoro.kill();
      this.meteoroCerto.kill();
      this.meteoroErrado1.kill();

      this.textCorreto.kill();
      this.textErrado1.kill();
      this.textErrado2.kill();

      this.alteraPergunta();
      this.criaMeteoros();

      // verifica vidas e chama game-over
      this.vidas--;
      this.textoVidas.text = this.vidas;

      if (pontuacao >= 10) {
        pontuacao -= 10;
        this.textoPontuacao.text = pontuacao;
      }

      this.checkGameOver();
    },
    criaMeta: function () {

      this.textoMeta = this.add.text(this.world.centerX - 125, this.world.centerY, 'Objetivo da missão: \nFaça ' + this.VICTORY_POINTS + ' pontos!', {
        font: '30px Arial',
        fill: '#ffffff',
        align: 'center'
      });

      this.textoMeta.alpha = 1;

      this.time.events.add(3000, function () { //exibe o texto por 3s antes de iniciar o fade-out
        this.add.tween(this.textoMeta).to({ alpha: 0 }, 3000, "Linear", true); //efeito fade-out de 3s (3000ms) para o texto

        this.time.events.add(3000, function () { //espera o fade-out completar antes de destruir o texto
          this.textoMeta.kill();

        }, this);
      }, this);

    }
  };