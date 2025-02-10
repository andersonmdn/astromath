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
          this.load.image("star", "https://labs.phaser.io/assets/demoscene/star2.png"); // ⭐ Estrela
          this.load.image("shootingStar", "https://labs.phaser.io/assets/particles/yellow.png"); // 🌠 Estrela cadente
          this.load.image("sky", "https://labs.phaser.io/assets/skies/space4.png");
          this.load.image("ship", "https://labs.phaser.io/assets/sprites/ufo.png"); // 🔵 Imagem da "nave"
        },
        create: function () {
          this.cameras.main.setBackgroundColor("#000015"); // 🌌 Fundo escuro

          const graphics = this.add.graphics({ lineStyle: { width: 1, color: 0xffffff } });
          
          const extraLineLength = 35; // 🔥 Tamanho extra da linha para melhor visualização
          const centerX = 500; // Novo centro do jogo
          const centerY = 400;
          const radii = [100, 150, 200]; // 🔥 Lista de raios dos círculos
          const points = []; // 🔥 Lista de pontos para colocar a nave
          
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
              this.add.image(point.x, point.y, "ship").setScale(1.5).setOrigin(0.5, 0.5);
            }
          };

          // 🛸 Posiciona naves nos exemplos dados
          placeShip(1, 30);  // Primeiro Círculo, ângulo 30°
          placeShip(3, 150); // Terceiro Círculo, ângulo 150°
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
