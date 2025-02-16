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

  scene.add.image(((width / 2) / 5) * 1, 60, "ship_red").setScale(0.5).setOrigin(0.5, 0.5);
  scene.add.text(((width / 2) / 5) * 1, 100, `x 3`, fontConfigCounter).setOrigin(0.5, 0.5);

  scene.add.image(((width / 2) / 5) * 2, 60, "ship_black").setScale(0.5).setOrigin(0.5, 0.5);
  scene.add.text(((width / 2) / 5) * 2, 100, `x 3`, fontConfigCounter).setOrigin(0.5, 0.5);

  scene.add.image(((width / 2) / 5) * 3, 60, "ship_green").setScale(0.5).setOrigin(0.5, 0.5);
  scene.add.text(((width / 2) / 5) * 3, 100, `x 3`, fontConfigCounter).setOrigin(0.5, 0.5);

  scene.add.image(((width / 2) / 5) * 4, 60, "ship_blue").setScale(0.5).setOrigin(0.5, 0.5);
  scene.add.text(((width / 2) / 5) * 4, 100, `x 3`, fontConfigCounter).setOrigin(0.5, 0.5);
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

// Função para criar objetos do jogo
function createGameObjects() {
  const { width, height } = this.sys.game.config;
  const stars = this.add.group();
  this.cameras.main.setBackgroundColor("#000015");

  createSky(this);
  createClouds(this);

  createTextLayout(this, width, height);

  // Adiciona estrelas ao fundo
  createStars(this, stars, width, height);

  // Adiciona estrelas cadentes
  createShootingStars(this, width, height);

  // Desenha círculos e linhas
  drawCirclesAndLines(this, width / 2, height);

  // drawCirclesAndLines(this, width + (width / 2), height);

  // Adiciona botão interativo
  const button = this.add.image(100, 760, "button").setInteractive().setScale(0.5);
  button.on("pointerdown", () => handleCollision(this, 2, 150));

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
  for (let i = 0; i < 200; i++) {
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
function destroyAndCreateStars(scene, stars, width, height) {
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