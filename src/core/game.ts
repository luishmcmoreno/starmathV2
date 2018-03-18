import { resourcePath } from './constants';

declare var Phaser;

var isOrientationActivated = false;
var points;
var difficulty;

const width = window.innerWidth;
const heigth = window.innerHeight;

export const CoreGame = {
    VICTORY_POINTS: 20,
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

      this.maxRangeOperation = 3;
      this.meteorSpeed = 0.5;

      this.createBackground();
      this.createAircraft();
      this.createShoots();
      this.createGoalText();

      if (isOrientationActivated) {
        window.addEventListener("deviceorientation", this.callHandleOrientation, true);
      }

      this.questionText = this.add.text(this.world.centerX - 175, 7, '', {
        font: "35px Arial",
        fill: "#ffffff",
        align: "left"
      });
      this.changeQuestion();

      points = 0;
      this.textPoints = this.add.text(this.world.centerX + 90, 7, points, {
        font: '35px Arial',
        fill: '#ffffff',
        align: 'center'
      });

      this.meteors = this.add.group();
      this.meteors.enableBody = true;
      this.meteors.physicsBodyType = Phaser.Physics.ARCADE;
      this.createMeteors();

    },

    update: function () {
      this.updateTasks();
      this.moveMeteors();

      if (this.isMovingRight && this.aircraft.body.x < 296) {
        this.aircraft.body.velocity.x = this.distanceToMoveOnClick;
      } else if (this.isMovingLeft && this.aircraft.body.x > 0) {
        this.aircraft.body.velocity.x = this.distanceToMoveOnClick * -1;
      }

      // Identify colision for each one meteor
      this.physics.arcade.overlap(this.shoot, this.correctMeteor, this.quandoAconteceColisaoCorreta, null, this);
      this.physics.arcade.overlap(this.shoot, this.incorrectMeteor1, this.quandoAconteceColisaoErrada, null, this);
      this.physics.arcade.overlap(this.shoot, this.incorrectMeteor2, this.quandoAconteceColisaoErrada, null, this);

      this.physics.arcade.overlap(this.aircraft, this.correctMeteor, this.colisaoNaveMeteoroCerto, null, this);
      this.physics.arcade.overlap(this.aircraft, this.incorrectMeteor1, this.colisaoNaveMeteoroErrado1, null, this);
      this.physics.arcade.overlap(this.aircraft, this.incorrectMeteor2, this.colisaoNaveMeteoroErrado2, null, this);

      this.checkGameOver();
    },

    loadResources: function () {
      this.load.image('background', `${resourcePath}/img/background.png`);
      this.load.image('navinha', `${resourcePath}/img/navinha.png`);
      this.load.image('umTiro', `${resourcePath}/img/tiro.png`);
      this.load.image('meteoro', `${resourcePath}/img/meteoro.png`);
      this.load.image('hearth', `${resourcePath}/img/hearth.png`);
      this.load.image('explosao', `${resourcePath}/img/explosao.png`);

      this.load.image('btnLeft', `${resourcePath}/img/left.png`);
      this.load.image('btnRight', `${resourcePath}/img/right.png`);
      this.load.image('btnShoot', `${resourcePath}/img/shoot.png`);

      this.load.audio('shootSound', `${resourcePath}/audio/shootSound.ogg`);
      this.load.audio('correctAnswerSound', `${resourcePath}/audio/correctAnswerSound.ogg`);
      this.load.audio('incorrectAnswerSound', `${resourcePath}/audio/incorrectAnswerSound.ogg`);
      this.load.audio('gameOverSound', `${resourcePath}/audio/gameOverSound.ogg`);
      this.load.audio('backgroundSound', `${resourcePath}/audio/backgroundSound.ogg`);
      this.load.audio('victorySound', `${resourcePath}/audio/victorySound.ogg`);
      this.load.audio('explosionSound', `${resourcePath}/audio/explosionSound.ogg`);
    },



    createBackground: function () {
      if (isOrientationActivated) {
        this.background = this.add.tileSprite(0, 48, width, heigth, 'background');
      } else {
        this.background = this.add.tileSprite(0, 48, width, heigth, 'background');			
      }

      this.hearth = this.add.sprite(this.world.centerX, 0, 'hearth');
      this.backgroundScrollSpeed = 2;
      this.backgroundSound.play(null, null, 0.5, true, null);

      this.vidas = 3;
      this.textoVidas = this.add.text(this.world.centerX + 20, 14, this.vidas, {
        font: '18px Arial',
        fill: '#ffffff',
        align: 'center'
      });
    },

    createAircraft: function () {

      if (isOrientationActivated) {
        this.aircraft = this.add.sprite(this.world.centerX, this.world.centerY + 175, 'navinha');
      } else {
        this.aircraft = this.add.sprite(this.world.centerX, this.world.centerY + 120, 'navinha');

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

      this.physics.enable(this.aircraft, Phaser.Physics.ARCADE); // aplicar físicas (object, system)
    },


    createShoots: function () {

      this.shootVelocidade = 0;

      this.shootSound = this.add.audio('shootSound');

      this.shoot = this.add.group();
      // Faz com que os objetos do grupo tenham um 'corpo' e em seguida seta o sistema de fisica aplicado a esses corpos
      this.shoot.enableBody = true;
      this.shoot.physicsBodyType = Phaser.Physics.ARCADE;
      // Cria um grupo de 30 sprites usando a imagem da key fornecida
      this.shoot.createMultiple(30, 'umTiro');
      // Posiçao do tiro no bico da nave   ---- Altura em que o tiro sai, pra sair da boca da nave e não do meio da tela
      this.shoot.setAll('anchor.x', -0.9);
      this.shoot.setAll('anchor.y', 0.8);
      // Faz o objeto ser killado após sair da tela chamando automaticamente a função inWorld que retorna false	
      this.shoot.setAll('outOfBoundsKill', true);
      this.shoot.setAll('checkWorldBounds', true);

      if (isOrientationActivated) {
        this.touchAtirar = this.input.pointer1;
      } else {
        this.btnShootr = this.add.button(this.world.centerX - 15, this.world.centerY * 2 - 50, 'btnShoot', function () {
          this.atira();
        }, this);

      }

    },


    createMeteors: function () {
      // reseta posição do gurpo no eixo y
      this.meteors.y = 0;

      this.getPosicaoMeteoros();

      this.correctMeteor = this.meteors.create(this.posicoes[0], 65, 'meteoro');
      this.correctMeteor.anchor.setTo(0.5, 0.5);
      this.correctText = this.add.text(this.correctMeteor.x, this.correctMeteor.y, this.respostaCorreta, {
        font: "20px Arial",
        fill: "#ffffff",
        stroke: "000",
        strokeThickness: 3,
        wordWrap: true,
        wordWrapWidth: this.correctMeteor.width,
        align: "center"
      });
      this.correctText.anchor.set(0.5, 0.5);


      this.incorrectMeteor1 = this.meteors.create(this.posicoes[1], 65, 'meteoro');
      this.incorrectMeteor1.anchor.setTo(0.5, 0.5);
      this.incorrectText1 = this.add.text(this.incorrectMeteor1.x, this.incorrectMeteor1.y, this.respostaCorreta - this.getRandomInt(1, 7), {
        font: "20px Arial",
        fill: "#ffffff",
        stroke: "000",
        strokeThickness: 3,
        wordWrap: true,
        wordWrapWidth: this.incorrectMeteor1.width,
        align: "center"
      });
      this.incorrectText1.anchor.set(0.5, 0.5);


      this.incorrectMeteor2 = this.meteors.create(this.posicoes[2], 65, 'meteoro');
      this.incorrectMeteor2.anchor.setTo(0.5, 0.5);
      this.incorrectText2 = this.add.text(this.incorrectMeteor2.x, this.incorrectMeteor2.y, this.respostaCorreta - this.getRandomInt(1, 3), {
        font: "20px Arial",
        fill: "#ffffff",
        stroke: "000",
        strokeThickness: 3,
        wordWrap: true,
        wordWrapWidth: this.incorrectMeteor2.width,
        align: "center"
      });
      this.incorrectText2.anchor.set(0.5, 0.5);


    },

    quandoAconteceColisaoCorreta: function (tiroQueAcertou, meteoro) {
      tiroQueAcertou.kill();
      meteoro.kill();
      this.incorrectMeteor1.kill();
      this.incorrectMeteor2.kill();
      this.correctText.kill();
      this.incorrectText1.kill();
      this.incorrectText2.kill();
      points += 10;
      this.textPoints.text = points;

      this.correctAnswerSound.play();
      this.aumentaRangeOperacoes();
      this.changeQuestion();
      this.incrementaVelocidade();
      this.createMeteors();

      if (points >= this.VICTORY_POINTS) {
        this.backgroundSound.stop();
        this.victorySound.play();
        this.starMath.state.start('Vitoria');
      }


    },


    changeQuestion: function () {
      var op = this.getRandomInt(1, difficulty);
      var a = this.getRandomInt(1, this.maxRangeOperation);
      var b = this.getRandomInt(1, this.maxRangeOperation);


      if (op == 1) { //soma
        this.respostaCorreta = a + b;
        this.questionText.text = a + '+' + b + " = ?"
      } else if (op == 2) { //subtração

        //Evita respostas das operações com negativos
        if (a < b) {
          var temp = a;
          a = b;
          b = temp;
        }

        this.respostaCorreta = a - b;
        this.questionText.text = a + '-' + b + " = ?"
      } else if (op == 3) { //multiplicação
        a = this.getRandomInt(1, 10);
        b = this.getRandomInt(1, 10);
        this.respostaCorreta = a * b;
        this.questionText.text = a + 'x' + b + " = ?"
      } else { //divisão -> op == 4
        //Evita respostas das operações com valores irracionais
        while (a % b != 0) {
          a = this.getRandomInt(1, 10);
          b = this.getRandomInt(1, 10);
        }
        this.respostaCorreta = a / b;
        this.questionText.text = a + '÷' + b + " = ?"
      }
    },


    quandoAconteceColisaoErrada: function (tiroQueAcertou, meteoro) {
      tiroQueAcertou.kill();
      meteoro.kill();

      this.correctMeteor.kill();
      this.incorrectMeteor1.kill();
      this.incorrectMeteor2.kill();

      this.correctText.kill();
      this.incorrectText1.kill();
      this.incorrectText2.kill();

      this.incorrectAnswerSound.play();

      this.changeQuestion();
      this.createMeteors();
      // verifica vidas e chama game-over
      this.vidas--;
      this.textoVidas.text = this.vidas;

      if (points >= 10) {
        points -= 10;
        this.textPoints.text = points;
      }

      this.checkGameOver();
    },

    updateTasks: function () {
      this.background.tilePosition.y += this.backgroundScrollSpeed;
      this.aircraft.body.velocity.x = 0;

      if (isOrientationActivated) {
        if (this.touchAtirar.isDown) {
          this.atira();
        }
      }
    },

    atira: function () {

      this.umTiro = this.shoot.getFirstExists(false);

      this.shootSound.play();
      if (this.time.now > this.shootVelocidade) {

        if (this.umTiro) {

          this.umTiro.reset(this.aircraft.x, this.aircraft.y);
          // Quão rápido sobe a bala
          this.umTiro.body.velocity.y = -200; //pixels por segundo - rate / velocidade
          // De quanto em quanto tempo sai uma bala
          this.shootVelocidade = this.time.now + 300;
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

    callHandleOrientation: function (e) {
      Reflect.apply(CoreGame.handleOrientation, CoreGame, [e])
    },

    handleOrientation: function (e) {

      /*maior que 1 e menor que -1 apenas para evitar de andar com o celular parado,
           pois mesmo praticamente parado é detectado inclinações.	 
           */
      if (e.gamma >= 1.5 && this.aircraft.body.x < 296) {
        this.aircraft.body.velocity.x = this.distanceToMoveOnOrientation;
        return; // quebra o fluxo, não executa resto do código
      } else if (e.gamma <= -1.5 && this.aircraft.body.x > 0) {
        this.aircraft.body.velocity.x = this.distanceToMoveOnOrientation * -1;
        return; // quebra o fluxo, não executa resto do código
      }

      // só volta pra zero quando não temm inclinação (tilt)
      this.aircraft.body.velocity.x = 0;
    },

    checkGameOver: function () {
      if (isOrientationActivated) {
        if (this.meteors.y > 600 && this.vidas > 0) {
          this.vidas--;
          this.textoVidas.text = this.vidas;
          if (points >= 10) {
            points -= 10;
            this.textPoints.text = points;
          }
          this.incorrectMeteor1.kill();
          this.incorrectMeteor2.kill();
          this.correctMeteor.kill();
          this.correctText.kill();
          this.incorrectText1.kill();
          this.incorrectText2.kill();
          this.incorrectAnswerSound.play();
          this.createMeteors();
        } else if (this.meteors.y > 600 && this.vidas <= 0) {
          this.gameOver();
        } else if (this.vidas <= 0) {
          this.gameOver();
        }
      } else {
        if (this.meteors.y > 480 && this.vidas > 0) {
          this.vidas--;
          this.textoVidas.text = this.vidas;
          if (points >= 10) {
            points -= 10;
            this.textPoints.text = points;
          }
          this.incorrectMeteor1.kill();
          this.incorrectMeteor2.kill();
          this.correctMeteor.kill();
          this.correctText.kill();
          this.incorrectText1.kill();
          this.incorrectText2.kill();
          this.incorrectAnswerSound.play();
          this.createMeteors();
        } else if (this.meteors.y > 480 && this.vidas <= 0) {
          this.gameOver();
        } else if (this.vidas <= 0) {
          this.gameOver();
        }
      }
    },

    gameOver: function () {

      this.backgroundSound.stop();
      this.gameOverSound.play(null, null, 0.2, null, null);

      if (isOrientationActivated) {
        window.removeEventListener('deviceorientation', this.callHandleOrientation, true);
      }

      this.meteorSpeed = 0.5;
      this.starMath.state.start('Game-over');
    },

    moveMeteors: function () {
      this.meteors.y += this.meteorSpeed;
      this.correctText.y += this.meteorSpeed;
      this.incorrectText1.y += this.meteorSpeed;
      this.incorrectText2.y += this.meteorSpeed;
    },

    incrementaVelocidade: function () {
      this.meteorSpeed += this.SPEED_INCREMENT;
    },

    aumentaRangeOperacoes: function () {
      this.maxRangeOperation += 1;
    },

    criaExplosao: function (meteoro) {

      this.explosionSound.play();
      this.explosaoImg = this.add.sprite(this.aircraft.x, this.aircraft.y, 'explosao');

      this.time.events.add(400, function () {
        this.explosaoImg.kill();
      }, this);

    },

    colisaoNaveMeteoroCerto: function (navinha, meteoro) {
      this.criaExplosao();

      meteoro.kill();
      this.incorrectMeteor1.kill();
      this.incorrectMeteor2.kill();

      this.correctText.kill();
      this.incorrectText1.kill();
      this.incorrectText2.kill();

      this.changeQuestion();
      this.createMeteors();
      // verifica vidas e chama game-over
      this.vidas--;
      this.textoVidas.text = this.vidas;

      if (points >= 10) {
        points -= 10;
        this.textPoints.text = points;
      }

      this.checkGameOver();

    },

    colisaoNaveMeteoroErrado1: function (navinha, meteoro) {
      this.criaExplosao();

      meteoro.kill();
      this.correctMeteor.kill()
      this.incorrectMeteor2.kill();

      this.correctText.kill();
      this.incorrectText1.kill();
      this.incorrectText2.kill();

      this.changeQuestion();
      this.createMeteors();
      // verifica vidas e chama game-over
      this.vidas--;
      this.textoVidas.text = this.vidas;

      if (points >= 10) {
        points -= 10;
        this.textPoints.text = points;
      }

      this.checkGameOver();
    },
    colisaoNaveMeteoroErrado2: function (navinha, meteoro) {
      this.criaExplosao();

      meteoro.kill();
      this.correctMeteor.kill();
      this.incorrectMeteor1.kill();

      this.correctText.kill();
      this.incorrectText1.kill();
      this.incorrectText2.kill();

      this.changeQuestion();
      this.createMeteors();

      // verifica vidas e chama game-over
      this.vidas--;
      this.textoVidas.text = this.vidas;

      if (points >= 10) {
        points -= 10;
        this.textPoints.text = points;
      }

      this.checkGameOver();
    },
    createGoalText: function () {

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