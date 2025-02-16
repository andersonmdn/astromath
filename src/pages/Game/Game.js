import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

export const Game = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    if (gameRef.current) return; // Evita recriação do jogo

    const config = {
      type: Phaser.AUTO,
      width: 1000, // 🔥 Aumentado o tamanho do mapa
      height: 800,
      parent: "game-container",
      scene: {
        preload: function () {
          this.load.setCORS("anonymous");
          this.load.image("laser", "/assets/kenney_space-shooter-redux/PNG/Lasers/laserRed01.png");
          this.load.audio("laser2", "/assets/kenney_space-shooter-redux/Bonus/sfx_laser2.ogg");
          this.load.image("star", "/assets/star2.png");
          this.load.image("shootingStar", "/assets/yellow.png");
          this.load.spritesheet("explosion", "/assets/explosion.png", {
            frameWidth: 82,  // Ajuste para o tamanho correto dos frames
            frameHeight: 72
          });
          this.load.image("meteor", "/assets/kenney_space-shooter-redux/PNG/Meteors/meteorBrown_big1.png");
          this.load.image("blackHole", "/assets/kenney_planets/Parts/sphere2.png");
          this.load.image("ship", "/assets/kenney_space-shooter-redux/PNG/playerShip1_blue.png");
          this.load.image("button", "/assets/kenney_ui-pack/PNG/Red/Double/button_rectangle_depth_flat.png");
        },
        create: function () {
          this.cameras.main.setBackgroundColor("#000015"); // 🌌 Fundo escuro

          const graphics = this.add.graphics({ lineStyle: { width: 1, color: 0xffffff } });
          const button = this.add.image(100, 760, "button").setInteractive().setScale(0.5);;

          const extraLineLength = 35; // 🔥 Tamanho extra da linha para melhor visualização
          const centerX = 500; // Novo centro do jogo
          const centerY = 400;
          const radii = [100, 150, 200]; // 🔥 Lista de raios dos círculos
          const points = []; // 🔥 Lista de pontos para colocar a nave
          const ships = []; // 🔥 Lista de naves
          
          // ⭐ Adiciona estrelas ao fundo
          const stars = this.add.group();
          for (let i = 0; i < 50; i++) {
            let star = this.add.image(
              Phaser.Math.Between(0, 1000),
              Phaser.Math.Between(0, 800),
              "star"
            ).setScale(Phaser.Math.FloatBetween(0.3, 0.8)).setAlpha(Phaser.Math.FloatBetween(0.3, 1));
            stars.add(star);
          }

          // ⭐ Animação de estrelas piscando
          this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
              Phaser.Utils.Array.GetRandom(stars.getChildren()).setAlpha(Phaser.Math.FloatBetween(0.3, 1));
            }
          });

          // 🌠 Estrelas cadentes aleatórias
          this.time.addEvent({
            delay: Phaser.Math.Between(5000, 15000), // Tempo aleatório para surgir
            loop: true,
            callback: () => {
              let xStart = Phaser.Math.Between(200, 800);
              let yStart = Phaser.Math.Between(0, 200);
              let shootingStar = this.add.image(xStart, yStart, "shootingStar").setScale(0.5);
              this.tweens.add({
                targets: shootingStar,
                x: xStart + Phaser.Math.Between(100, 300),
                y: yStart + Phaser.Math.Between(100, 300),
                alpha: 0,
                duration: 1000,
                onComplete: () => shootingStar.destroy(),
              });
            }
          });

          const createLaser = (startX, startY, targetX, targetY) => {
            const angle = Phaser.Math.Angle.Between(startX, startY, targetX, targetY) + Phaser.Math.DEG_TO_RAD * 90;
        
            const laser = this.add.sprite(startX, startY, "laser")
                .setOrigin(0, 0.5)
                .setRotation(angle);
        
            this.tweens.add({
                targets: laser,
                x: targetX,
                y: targetY,
                duration: 200, // Tempo para alcançar o alvo (ajuste conforme necessário)
                onComplete: () => laser.destroy() // Destroi após atingir o alvo
            });
          };
        
        

          // 🔵 Desenha os círculos e coleta os pontos de interseção
          radii.forEach((radius, index) => {
            graphics.strokeCircle(centerX, centerY, radius);

            for (let angle = 0; angle < 360; angle += 30) {
              const radians = Phaser.Math.DegToRad(angle);
              const x = centerX + Math.cos(radians) * radius;
              const y = centerY + Math.sin(radians) * radius;

              points.push({ circle: index + 1, angle, x, y });

              if (index === radii.length - 1) {
                // 🔴 Ajusta as linhas para passarem um pouco do círculo
                const xEnd = centerX + Math.cos(radians) * (radius + extraLineLength);
                const yEnd = centerY + Math.sin(radians) * (radius + extraLineLength);
                graphics.lineBetween(centerX, centerY, xEnd, yEnd);
              }

              const xEnd = centerX + Math.cos(radians) * (radius + extraLineLength + 20);
              const yEnd = centerY + Math.sin(radians) * (radius + extraLineLength + 20);
              
              if (index === 2) {
                this.add.text(xEnd, yEnd, `${angle}°`, {
                  font: "14px Arial",
                  fill: "#ffffff",
                  align: "center",
                }).setOrigin(0.5, 0.5);
              }
            }
          });

          // 🔥 Função para posicionar uma nave em um ponto específico
          const placeShip = (circle, angle) => {
            const point = points.find(p => p.circle === circle && p.angle === angle);
            if (point) {
              this.add.image(point.x, point.y, "ship").setScale(0.5).setOrigin(0.5, 0.5);

              ships.push({ circle: circle, angle: angle, x: point.x, y: point.y });
            }
          };

          this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 7 }),
            frameRate: 16,
            repeat: 0,
          });

          const handleCollision = (circle, angle) => {
            const point = points.find(p => p.circle === circle && p.angle === angle);
            if (!point) return;
      
            let existingShip = ships.find(s => s.circle === circle && s.angle === angle);
      
            if (existingShip) {
              console.log("Nave já existe no ponto", point);
              // 🚀 Nave atingida → Explosão e dano
              this.add.sprite(existingShip.x, existingShip.y, "explosion").on("animationstart", () => {
                this.sound.play("laser2");

                const randomX = Phaser.Math.Between(0, this.scale.width);
                const randomY = Phaser.Math.Between(0, this.scale.height);
                
                createLaser(randomX, 0 - 100, existingShip.x, existingShip.y);
              }).play("explode").on("animationcomplete", (anim, frame, sprite) => {
                sprite.destroy();
              });
              

            } else {
              // ☄️ Adiciona meteoro ou buraco negro
              let objectType = Phaser.Math.RND.pick(["meteor", "blackHole"]);
              let newObject = this.add.image(point.x, point.y, objectType).setScale(0.7);

              console.log("Novo objeto criado:", newObject);  // 🔍 Debug para verificar se o objeto existe

              if (newObject) {  // ✅ Garante que `newObject` existe antes de animá-lo
                this.time.delayedCall(3000, () => {
                  if (newObject) newObject.destroy();  // ✅ Garante que o objeto existe antes de destruí-lo
                });
              } else {
                console.warn("Falha ao criar o objeto", objectType);
              }
            }
          }

          // 🛸 Posiciona naves nos exemplos dados
          placeShip(1, 30);  // Primeiro Círculo, ângulo 30°
          placeShip(3, 150); // Terceiro Círculo, ângulo 150°

          button.on("pointerdown", () => {
            handleCollision(3, 150);
          });
        },
      },
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="game-container"></div>;
};
