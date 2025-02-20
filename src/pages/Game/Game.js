import "./Game.css";
import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

// Configurações do jogo
const gameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  parent: "game-container",
  scene: {
    preload: preloadAssets,
    create: createGameObjects,
  },
};

const points = [];

// Assets do jogo
const assets = {
  images: {
    laser: "/assets/kenney_space-shooter-redux/PNG/Lasers/laserRed01.png",
    star_1: "/assets/kenney_space-shooter-redux/PNG/Effects/star1.png",
    star_2: "/assets/kenney_space-shooter-redux/PNG/Effects/star2.png",
    star_3: "/assets/kenney_space-shooter-redux/PNG/Effects/star3.png",
    shootingStar: "/assets/yellow.png",
    meteor: "/assets/kenney_space-shooter-redux/PNG/Meteors/meteorBrown_big1.png",
    blackhole: "/assets/kenney_planets/Parts/sphere2.png",
    ship_blue: "/assets/kenney_space-shooter-redux/PNG/Enemies/enemyBlue1.png",
    ship_red: "/assets/kenney_space-shooter-redux/PNG/Enemies/enemyRed2.png",
    ship_black: "/assets/kenney_space-shooter-redux/PNG/Enemies/enemyBlack3.png",
    ship_green: "/assets/kenney_space-shooter-redux/PNG/Enemies/enemyGreen4.png",
    button: "/assets/kenney_ui-pack/PNG/Red/Double/button_rectangle_depth_flat.png",
    cloud_1: "/assets/kenney_background-elements/PNG/cloud1.png",
    cloud_2: "/assets/kenney_background-elements/PNG/cloud2.png",
    cloud_3: "/assets/kenney_background-elements/PNG/cloud3.png",
    cloud_4: "/assets/kenney_background-elements/PNG/cloud4.png",
    cloud_5: "/assets/kenney_background-elements/PNG/cloud5.png",
    cloud_6: "/assets/kenney_background-elements/PNG/cloud6.png",
    cloud_7: "/assets/kenney_background-elements/PNG/cloud7.png",
    cloud_8: "/assets/kenney_background-elements/PNG/cloud8.png",
    cloud_9: "/assets/kenney_background-elements/PNG/cloud9.png",
    receiving_attacking: "/assets/kenney_board-game-icons/PNG/Default (64px)/shield.png",
    attacking: "/assets/kenney_board-game-icons/PNG/Default (64px)/sword.png",
    planning_1: "/assets/kenney_board-game-icons/PNG/Default (64px)/hourglass_top.png",
    planning_2: "/assets/kenney_board-game-icons/PNG/Default (64px)/hourglass.png",
    planning_3: "/assets/kenney_board-game-icons/PNG/Default (64px)/hourglass_bottom.png",
  },
  spritesheets: {
    explosion: {
      path: "/assets/explosion.png",
      frameConfig: { frameWidth: 82, frameHeight: 72 },
    },
    fire: {
      path: "/assets/Pixel Fire Pack/13/13.png",
      frameConfig: { frameWidth: 48, frameHeight: 48 },
    },
  },
  audio: {
    laser2: "/assets/kenney_space-shooter-redux/Bonus/sfx_laser2.ogg",
  },
};

// Função para carregar assets
function preloadAssets() {
  const { images, spritesheets, audio } = assets;
  this.load.setCORS("anonymous");

  // Carrega imagens
  Object.entries(images).forEach(([key, path]) => {
    this.load.image(key, path);
  });

  // Carrega spritesheets
  Object.entries(spritesheets).forEach(([key, { path, frameConfig }]) => {
    this.load.spritesheet(key, path, frameConfig);
  });

  // Carrega áudios
  Object.entries(audio).forEach(([key, path]) => {
    this.load.audio(key, path);
  });
}

// Função para criar texto
function createTextLayout(scene, width, height) {
  scene.add.text((width / 2) / 2, 20, `Player 1 - Naves Restantes`, {
    fontSize: "20px",
    fontFamily: "Lexend",
    fill: "#50FA7B",
    align: "center",
  }).setOrigin(0.5, 0.5);

  const fontConfigCounter = {
    fontSize: "20px",
    fontFamily: "Lexend",
    fill: "#50FA7B",
    align: "center",
  }

  const countTypes = (type) => points.filter(point => point.type === type).length;

  const redCount = countTypes("red");
  const blackCount = countTypes("black");
  const blueCount = countTypes("blue");
  const greenCount = countTypes("green");

  scene.add.image(((width / 2) / 5) * 1, 60, "ship_red").setScale(0.5).setOrigin(0.5, 0.5);
  const redCountText = scene.add.text(((width / 2) / 5) * 1, 100, `x ${redCount}`, fontConfigCounter).setOrigin(0.5, 0.5);
  redCountText.nome = "red";

  scene.add.image(((width / 2) / 5) * 2, 60, "ship_black").setScale(0.5).setOrigin(0.5, 0.5);
  const blackCountText = scene.add.text(((width / 2) / 5) * 2, 100, `x ${blackCount}`, fontConfigCounter).setOrigin(0.5, 0.5);
  blackCountText.nome = "black";

  scene.add.image(((width / 2) / 5) * 3, 60, "ship_green").setScale(0.5).setOrigin(0.5, 0.5);
  const greenCountText = scene.add.text(((width / 2) / 5) * 3, 100, `x ${greenCount}`, fontConfigCounter).setOrigin(0.5, 0.5);
  greenCountText.nome = "green";

  scene.add.image(((width / 2) / 5) * 4, 60, "ship_blue").setScale(0.5).setOrigin(0.5, 0.5);
  const blueCountText = scene.add.text(((width / 2) / 5) * 4, 100, `x ${blueCount}`, fontConfigCounter).setOrigin(0.5, 0.5);
  blueCountText.nome = "blue";

  scene.textCounts.add(redCountText);
  scene.textCounts.add(blackCountText);
  scene.textCounts.add(greenCountText);
  scene.textCounts.add(blueCountText);
}

function updateTexts(scene) {
  const countTypes = (type) => points.filter(point => point.type === type && point.alive).length;

  const newRedCount = countTypes("red");
  const newBlackCount = countTypes("black");
  const newBlueCount = countTypes("blue");
  const newGreenCount = countTypes("green");

  const textsCounts = scene.textCounts.getChildren();

  textsCounts.forEach((text) => {
    if (text.nome.includes("red")) {
      text.setText(`x ${newRedCount}`);
    } else if (text.nome.includes("black")) {
      text.setText(`x ${newBlackCount}`);
    } else if (text.nome.includes("blue")) {
      text.setText(`x ${newBlueCount}`);
    } else if (text.nome.includes("green")) {
      text.setText(`x ${newGreenCount}`);
    }
  });
}

function createSky(scene) {
  const gradient = scene.add.graphics();
  const width = scene.sys.game.config.width;
  const height = scene.sys.game.config.height;

  // Cria um gradiente vertical (de azul escuro para preto)
  const fillStyle = gradient.fillGradientStyle(
    0x000033, // Azul escuro (topo)
    0x000000, // Preto (base)
    1, // Alpha do topo
    1, // Alpha da base
    true // Gradiente vertical
  );

  gradient.fillRect(0, 0, width, height); // Preenche a tela com o gradiente
}

function createClouds(scene) {
  const clouds = scene.add.group();
  const width = scene.sys.game.config.width;
  const height = scene.sys.game.config.height;

  for (let i = 0; i < 5; i++) {
    const randomCloudIndex = Phaser.Math.Between(1, 9);
    const cloudTexture = `cloud_${randomCloudIndex}`;

    const cloud = scene.add.sprite(
      Phaser.Math.Between(-width, width), // Posição X aleatória
      Phaser.Math.Between(0, height / 2), // Posição Y aleatória
      cloudTexture // Textura da nuvem
    ).setScale(Phaser.Math.FloatBetween(0.5, 1.5)).setAlpha(0.1); // Tamanho aleatório

    clouds.add(cloud);

    // Movimento da nuvem
    scene.tweens.add({
      targets: cloud,
      x: width + cloud.width, // Move a nuvem para a direita
      duration: Phaser.Math.Between(10000, 20000), // Duração aleatória
      ease: 'Linear',
      repeat: -1, // Repete infinitamente
      yoyo: false,
      delay: Phaser.Math.Between(0, 5000) // Delay aleatório
    });
  }
}

function animatePlanning(scene, first, middle, end) {
  scene.statusTweenPlanningAnimation1 = scene.tweens.add({
    targets: first,
    alpha: 1, // Fade out
    duration: 1000, // Duração de 1 segundo
    delay: 0, // Espera 2 segundos antes de começar,
    onAnimationEnd: () => {
      first[0].setAlpha(0);
      first[1].setAlpha(0);
    },
    repeat: -1,
    repeatDelay: 2000
  });

  scene.statusTweenPlanningAnimation1.pause()

  scene.statusTweenPlanningAnimation2 = scene.tweens.add({
    targets: middle,
    alpha: 1, // Fade out
    duration: 1000, // Duração de 1 segundo
    delay: 1000, // Espera 2 segundos antes de começar
    onAnimationEnd: () => {
      middle[0].setAlpha(0);
      middle[1].setAlpha(0);
    },
    repeat: -1,
    repeatDelay: 2000
  });

  scene.statusTweenPlanningAnimation2.pause()

  scene.statusTweenPlanningAnimation3 = scene.tweens.add({
    targets: end,
    alpha: 1, // Fade out
    duration: 1000, // Duração de 1 segundo
    delay: 2000, // Espera 2 segundos antes de começar
    angle: 180, // Gira 360 graus
    onAnimationEnd: () => {
      end[0].setAlpha(0);
      end[1].setAlpha(0);
    },
    repeat: -1,
    repeatDelay: 2000
  });
  
  scene.statusTweenPlanningAnimation3.pause()
}

function animateSword(scene, sword, angle, xOffset) {
  scene.tweens.add({
      targets: sword,
      angle: angle, // Ângulo de rotação
      x: `+=${xOffset}`, // Movimento horizontal
      duration: 500, // Duração da animação
      ease: 'Linear', // Easing linear
      repeat: -1, // Repete infinitamente
      repeatDelay: 5000, // Atraso entre repetições
      yoyo: true, // Alterna entre os valores inicial e final
  });
}

function animateReceivingAttacking(scene, planning) {
  scene.tweens.add({
      targets: planning,
      scale: 0.6, // Escala
      duration: 500, // Duração da animação
      ease: 'Linear', // Easing linear
      repeat: -1, // Repete infinitamente
      repeatDelay: 5000, // Atraso entre repetições
      yoyo: true, // Alterna entre os valores inicial e final
  });
}

function createGameStatusLayout(scene, width, height) {
  const statusGameText = scene.add.text(width / 2, 50, "Planejamento", {
    fontSize: "20px",
    fontFamily: "Lexend",
    fill: "#FFB86C",
    align: "center",
  }).setOrigin(0.5, 0.5);

  const statusReceivingAttacking1 = scene.add.image(statusGameText.x - statusGameText.width + 40, statusGameText.y, "receiving_attacking").setScale(0.5).setOrigin(0.5, 0.5).setAlpha(0);
  const statusReceivingAttacking2 = scene.add.image(statusGameText.x + statusGameText.width - 40, statusGameText.y, "receiving_attacking").setScale(0.5).setOrigin(0.5, 0.5).setAlpha(0);
  
  const statusPlanning1 = scene.add.image(statusGameText.x - statusGameText.width + 40, statusGameText.y, "planning_1").setScale(0.5).setOrigin(0.5, 0.5).setAlpha(0);
  const statusPlanning2 = scene.add.image(statusGameText.x - statusGameText.width + 40, statusGameText.y, "planning_2").setScale(0.5).setOrigin(0.5, 0.5).setAlpha(0);
  const statusPlanning3 = scene.add.image(statusGameText.x - statusGameText.width + 40, statusGameText.y, "planning_3").setScale(0.5).setOrigin(0.5, 0.5).setAlpha(0);

  const statusPlanning1Enemy = scene.add.image(statusGameText.x + statusGameText.width - 40, statusGameText.y, "planning_1").setScale(0.5).setOrigin(0.5, 0.5).setAlpha(0);
  const statusPlanning2Enemy = scene.add.image(statusGameText.x + statusGameText.width - 40, statusGameText.y, "planning_2").setScale(0.5).setOrigin(0.5, 0.5).setAlpha(0);
  const statusPlanning3Enemy = scene.add.image(statusGameText.x + statusGameText.width - 40, statusGameText.y, "planning_3").setScale(0.5).setOrigin(0.5, 0.5).setAlpha(0);
  
  const statusAttacking1 = scene.add.image(statusGameText.x + statusGameText.width - 40, statusGameText.y, "attacking").setScale(0.5).setOrigin(0.5, 0.5).setFlipX(false).setAlpha(0);
  const statusAttacking2 = scene.add.image(statusGameText.x + statusGameText.width - 40 + 10, statusGameText.y, "attacking").setScale(0.5).setOrigin(0.5, 0.5).setFlipX(true).setAlpha(0);
  const statusAttacking3 = scene.add.image(statusGameText.x - statusGameText.width + 40, statusGameText.y, "attacking").setScale(0.5).setOrigin(0.5, 0.5).setFlipX(false).setAlpha(0);
  const statusAttacking4 = scene.add.image(statusGameText.x - statusGameText.width + 40 + 10, statusGameText.y, "attacking").setScale(0.5).setOrigin(0.5, 0.5).setFlipX(true).setAlpha(0);

  animateReceivingAttacking(scene, [statusReceivingAttacking1, statusReceivingAttacking2]);
  animatePlanning(scene, [statusPlanning1, statusPlanning1Enemy], [statusPlanning2, statusPlanning2Enemy], [statusPlanning3, statusPlanning3Enemy]);
  animateSword(scene, [statusAttacking1, statusAttacking3], -50, -10);
  animateSword(scene, [statusAttacking2, statusAttacking4], 50, 10);

  scene.statusGameText = statusGameText;
  scene.statusReceivingAttacking1 = statusReceivingAttacking1;
  scene.statusReceivingAttacking2 = statusReceivingAttacking2;
  scene.statusPlanning1 = statusPlanning1;
  scene.statusPlanning2 = statusPlanning2;
  scene.statusPlanning3 = statusPlanning3;
  scene.statusPlanning1Enemy = statusPlanning1Enemy;
  scene.statusPlanning2Enemy = statusPlanning2Enemy;
  scene.statusPlanning3Enemy = statusPlanning3Enemy;
  scene.statusAttacking1 = statusAttacking1;
  scene.statusAttacking2 = statusAttacking2;
  scene.statusAttacking3 = statusAttacking3;
  scene.statusAttacking4 = statusAttacking4;
}

function updateStatus(scene, status) {
  scene.statusTweenPlanningAnimation1.restart()
  scene.statusTweenPlanningAnimation2.restart()
  scene.statusTweenPlanningAnimation3.restart()
  scene.statusTweenPlanningAnimation1.pause()
  scene.statusTweenPlanningAnimation2.pause()
  scene.statusTweenPlanningAnimation3.pause()
  scene.statusPlanning1.setAlpha(0)
  scene.statusPlanning2.setAlpha(0)
  scene.statusPlanning3.setAlpha(0)
  scene.statusPlanning1Enemy.setAlpha(0)
  scene.statusPlanning2Enemy.setAlpha(0)
  scene.statusPlanning3Enemy.setAlpha(0)
  scene.statusAttacking1.setAlpha(0)
  scene.statusAttacking2.setAlpha(0)
  scene.statusAttacking3.setAlpha(0)
  scene.statusAttacking4.setAlpha(0)
  scene.statusReceivingAttacking1.setAlpha(0)
  scene.statusReceivingAttacking2.setAlpha(0)
  
  if (status === 0) {
    scene.statusPlanning1.setAlpha(1)
    scene.statusTweenPlanningAnimation1.play()
    scene.statusTweenPlanningAnimation2.play()
    scene.statusTweenPlanningAnimation3.play()
    scene.statusPlanning1Enemy.setAlpha(1)
    scene.statusGameText.setText("Planejamento");
    scene.statusGameText.setColor("#FFB86C");
  } else if (status === 1) {
    scene.statusAttacking1.setAlpha(1)
    scene.statusAttacking2.setAlpha(0.5)
    scene.statusAttacking3.setAlpha(1)
    scene.statusAttacking4.setAlpha(0.5)
    scene.statusGameText.setText("Ataque");
    scene.statusGameText.setColor("#FF5555");
  } else {
    scene.statusReceivingAttacking1.setAlpha(1)
    scene.statusReceivingAttacking2.setAlpha(1)
    scene.statusGameText.setText("Defesa");
    scene.statusGameText.setColor("#50FA7B");
  }
  
}

// Função para criar objetos do jogo
function createGameObjects() {
  const { width, height } = this.sys.game.config;
  const stars = this.add.group();
  this.textCounts = this.add.group();
  this.cameras.main.setBackgroundColor("#000015");

  // Cria o céu
  createSky(this);
  createClouds(this);
  createStars(this, stars, width, height);
  createShootingStars(this, width, height);

  // Cria texto
  createTextLayout(this, width, height);
  createGameStatusLayout(this, width, height);

  // Desenha círculos e linhas
  drawCirclesAndLines(this, width / 2, height);

  // drawCirclesAndLines(this, width + (width / 2), height);

  // Adiciona botão interativo
  const button = this.add.image(100, 760, "button").setInteractive().setScale(0.5);
  const button2 = this.add.image(500, 760, "button").setInteractive().setScale(0.5);
  const button3 = this.add.image(800, 760, "button").setInteractive().setScale(0.5);

  button.on("pointerdown", () => {
    updateStatus(this, 0);
  });

  button2.on("pointerdown", () => {
    updateStatus(this, 1);
  });

  button3.on("pointerdown", () => {
    updateStatus(this, 2);
  });

  // Posiciona naves
  placeShip(this, 1, 30, "red");
  placeShip(this, 3, 60, "black");
  placeShip(this, 1, 120, "green");
  placeShip(this, 2, 270, "blue");
  placeShip(this, 3, 330, "red");

  // Cria animações
  createAnimations(this);
}

// Função para criar uma estrela
function createStar(scene, stars, width, height) {
  // Escolhe uma textura aleatória para a estrela
  const starTexture = Phaser.Utils.Array.GetRandom(['star_1', 'star_2', 'star_3']);

  // Cria a estrela
  const star = scene.add.sprite(
    Phaser.Math.Between(0, width), // Posição X aleatória
    Phaser.Math.Between(0, height), // Posição Y aleatória
    starTexture // Textura da estrela
  ).setScale(Phaser.Math.FloatBetween(0.1, 0.5)) // Tamanho aleatório
   .setAlpha(Phaser.Math.FloatBetween(0.3, 1)); // Opacidade inicial aleatória

  stars.add(star);

  // Animação de piscar para a estrela
  animateStar(scene, star);
}

// Função para criar estrelas de fundo
function createStars(scene, stars, width, height) {
  for (let i = 0; i < 50; i++) {
    createStar(scene, stars, width, height); // Cria uma estrela
  }

  // Timer para destruir e recriar estrelas
  scene.time.addEvent({
    delay: 5000, // Intervalo de 5 segundos
    loop: true,
    callback: () => {
      destroyAndCreateStars(scene, stars); // Destrói e cria novas estrelas
    }
  });
}

// Função para destruir e criar novas estrelas
function destroyAndCreateStars(scene, stars) {
  // Destrói algumas estrelas aleatoriamente
  const starsToDestroy = Phaser.Math.Between(10, 30); // Número de estrelas a destruir
  for (let i = 0; i < starsToDestroy; i++) {
    const star = Phaser.Utils.Array.GetRandom(stars.getChildren());
    if (star) {
      star.destroy(); // Destrói a estrela
      stars.remove(star); // Remove do grupo
    }
  }

  // Cria novas estrelas
  const starsToCreate = starsToDestroy; // Cria o mesmo número de estrelas destruídas
  for (let i = 0; i < starsToCreate; i++) {
    createStar(scene, stars); // Cria uma nova estrela
  }
}

function animateStar(scene, star) {
  // Define a duração e o atraso da animação de forma aleatória
  const duration = Phaser.Math.Between(500, 2000); // Duração da animação
  const delay = Phaser.Math.Between(0, 3000); // Atraso antes de começar

  // Animação de piscar (fade in e fade out)
  scene.tweens.add({
    targets: star,
    alpha: { from: 0.3, to: 1 }, // Variação da opacidade
    duration: duration,
    yoyo: true, // Repete a animação (fade in e fade out)
    repeat: -1, // Repete infinitamente
    delay: delay, // Atraso antes de começar
    ease: 'Sine.easeInOut' // Easing suave
  });
}

// Função para criar estrelas cadentes
function createShootingStars(scene, width, height) {
  scene.time.addEvent({
    delay: Phaser.Math.Between(5000, 15000),
    loop: true,
    callback: () => {
      const xStart = Phaser.Math.Between(200, width);
      const yStart = Phaser.Math.Between(0, height);
      const shootingStar = scene.add.image(xStart, yStart, "shootingStar").setScale(0.5);
      scene.tweens.add({
        targets: shootingStar,
        x: xStart + Phaser.Math.Between(100, 300),
        y: yStart + Phaser.Math.Between(100, 300),
        alpha: 0,
        duration: 1000,
        onComplete: () => shootingStar.destroy(),
      });
    },
  });
}

// Função para desenhar círculos e linhas
function drawCirclesAndLines(scene, width, height) {
  const graphics = scene.add.graphics({ lineStyle: { width: 1, color: 0x50FA7B } });
  const centerX = width / 2;
  const centerY = height / 2;
  const radii = [90, 150, 200];
  const extraLineLength = 35;

  radii.forEach((radius, index) => {
    graphics.strokeCircle(centerX, centerY, radius);

    for (let angle = 0; angle < 360; angle += 30) {
      const radians = Phaser.Math.DegToRad(angle);
      const x = centerX + Math.cos(radians) * radius;
      const y = centerY + Math.sin(radians) * radius;

      // Adiciona o ponto à lista
      points.push({
        circle: index + 1,
        angle,
        x,
        y,
        occupied: false,
        ship: false,
        type: "",
        alive: false,
      });

      if (index === radii.length - 1) {
        const xEnd = centerX + Math.cos(radians) * (radius + extraLineLength);
        const yEnd = centerY + Math.sin(radians) * (radius + extraLineLength);
        graphics.lineBetween(centerX, centerY, xEnd, yEnd);
      }

      const xEnd = centerX + Math.cos(radians) * (radius + extraLineLength + 20);
      const yEnd = centerY + Math.sin(radians) * (radius + extraLineLength + 20);
      
      if (index === 2) {
        scene.add.text(xEnd, yEnd, `${angle}°`, {
          font: "14px Arial",
          fill: "#ffffff",
          align: "center",
        }).setOrigin(0.5, 0.5);
      }

      const pointObject = scene.add.zone(x, y, 45, 45).setInteractive();
      pointObject.on("pointerdown", () => handleCollision(scene, index + 1, angle));
    }
  });
}

// Função para posicionar naves
function placeShip(scene, circle, angle, type) {
  const point = findPoint(circle, angle);
  if (point && !point.occupied) {
    const shipType = `ship_${type}`;
    scene.add.image(point.x, point.y, shipType).setScale(0.5).setOrigin(0.5, 0.5);
    point.occupied = true;
    point.ship = true;
    point.type = type;
    point.alive = true;
  }

  updateTexts(scene);
}

// Função para criar animações
function createAnimations(scene) {
  scene.anims.create({
    key: "explode",
    frames: scene.anims.generateFrameNumbers("explosion", { start: 0, end: 7 }),
    frameRate: 16,
    repeat: 0,
  });

  scene.anims.create({
    key: "burning",
    frames: scene.anims.generateFrameNumbers("fire", { start: 0, end: 13 }),
    frameRate: 16,
    repeat: -1,
  });
}

function createTweenLaser(scene, startX, startY, targetX, targetY) {
  const angle = Phaser.Math.Angle.Between(startX, startY, targetX, targetY) + Phaser.Math.DEG_TO_RAD * 90;
        
  const laser = scene.add.sprite(startX, startY, "laser").setOrigin(0, 0.5).setRotation(angle);

  scene.tweens.add({
    targets: laser,
    x: targetX,
    y: targetY,
    duration: 200, // Tempo para alcançar o alvo (ajuste conforme necessário)
    onComplete: () => laser.destroy() // Destroi após atingir o alvo
});
}

// Função para lidar com colisões
function handleCollision(scene, circle, angle) {
  const point = findPoint(circle, angle);
  if (point && point.ship) {
    if (point.alive) {
      const explosion = scene.add.sprite(point.x, point.y, "explosion");
      explosion.play("explode").on("animationcomplete", () => explosion.destroy());
      const fire = scene.add.sprite(point.x, point.y, "fire").play("burning").setScale(1.5);

      point.alive = false;
    }
    
    const randomX = Phaser.Math.Between(0, scene.scale.width);
    scene.sound.play("laser2");
    createTweenLaser(scene, randomX, -100, point.x, point.y);
  } else {
    if (point && point.occupied) return;

    let meteor = scene.add.image(point.x, point.y, "meteor").setScale(0.5);

    let rotationSpeed = 0.005;
    
    point.occupied = true;
    point.type = "meteor";

    scene.time.addEvent({
      delay: 1000 / 60, // 60fps
      callback: () => {
        meteor.rotation += rotationSpeed;
      },
      loop: true
    });
  }

  updateTexts(scene);
}

// Função para encontrar pontos
function findPoint(circle, angle) {
  // Implemente a lógica para encontrar pontos
  return points.find((p) => p.circle === circle && p.angle === angle)
}

// Componente React
export const Game = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (gameRef.current) return;

    const parentElement = document.getElementById("game-container");
    const margin = 8;
    gameConfig.width = Math.max(800, parentElement.clientWidth) - margin;
    gameConfig.height = Math.max(800, parentElement.clientHeight) - margin;

    gameRef.current = new Phaser.Game(gameConfig);

    return () => {
      gameRef.current.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="game-container"></div>;
};