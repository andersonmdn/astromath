import { loadAssets } from './GameAssets'
import { GameEvents } from './GameEvents'

interface ICoordinates {
  circle: number
  angle: number
  x: number
  y: number
  occupied: boolean
  ship: boolean
  type: string
  alive: boolean
}

const angleTextFontConfig = {
  fontSize: '16px',
  fontFamily: 'Lexend',
  fill: '#FFFFFF',
  align: 'center',
}

function drawBoard(
  scene: GameBoard, // Garantindo que `scene` tenha `coordinatesAlly`
  width: number,
  height: number,
  color: string = '#282a36'
) {
  const graphics = {
    ally: scene.add.graphics({ lineStyle: { width: 1, color: 0x50fa7b } }),
    enemy: scene.add.graphics({ lineStyle: { width: 1, color: 0xff5555 } }),
  }

  const center = {
    ally: { x: width / 4, y: height / 2 },
    enemy: { x: (width * 3) / 4, y: height / 2 },
  }

  const radii = [100, 150, 200]
  const extraLineLength = 35

  radii.forEach((radius, index) => {
    // Desenhando círculos
    drawCircleGrid(graphics.ally, center.ally, radius)
    drawCircleGrid(graphics.enemy, center.enemy, radius)

    for (let angle = 0; angle < 360; angle += 30) {
      const radians = Phaser.Math.DegToRad(angle)

      // Calcula coordenadas para ambos os lados
      const positions = {
        ally: {
          x: center.ally.x + Math.cos(radians) * radius,
          y: center.ally.y + Math.sin(radians) * radius,
        },
        enemy: {
          x: center.enemy.x + Math.cos(radians) * radius,
          y: center.enemy.y + Math.sin(radians) * radius,
        },
      }

      // Adiciona pontos ao `coordinatesAlly`
      scene.coordinatesAlly.push({
        circle: index + 1,
        angle,
        x: positions.ally.x,
        y: positions.ally.y,
        occupied: false,
        ship: false,
        type: 'empty',
        alive: true,
      })

      // Adiciona pontos ao `coordinatesEnemy`
      scene.coordinatesEnemy.push({
        circle: index + 1,
        angle,
        x: positions.enemy.x,
        y: positions.enemy.y,
        occupied: false,
        ship: false,
        type: 'empty',
        alive: true,
      })

      // Desenha linhas radiais apenas no último círculo
      if (index === radii.length - 1) {
        drawRadialLines(
          graphics.ally,
          center.ally,
          radius,
          extraLineLength,
          radians
        )
        drawRadialLines(
          graphics.enemy,
          center.enemy,
          radius,
          extraLineLength,
          radians
        )
      }

      // Adiciona texto dos ângulos
      if (index === 2) {
        const xEnd =
          center.ally.x + Math.cos(radians) * (radius + extraLineLength + 20)
        const yEnd =
          center.ally.y + Math.sin(radians) * (radius + extraLineLength + 20)
        scene.add
          .text(xEnd, yEnd, `${angle}°`, angleTextFontConfig)
          .setOrigin(0.5)
      }

      // Criando pontos interativos
      createInteractivePoint(scene, positions.ally, index + 1, angle, 'ally')
      createInteractivePoint(scene, positions.enemy, index + 1, angle, 'enemy')
    }
  })
}

// 🔹 Função para desenhar círculos
function drawCircleGrid(
  graphics: Phaser.GameObjects.Graphics,
  center: { x: number; y: number },
  radius: number
) {
  graphics.strokeCircle(center.x, center.y, radius)
}

// 🔹 Função para desenhar linhas radiais
function drawRadialLines(
  graphics: Phaser.GameObjects.Graphics,
  center: { x: number; y: number },
  radius: number,
  extraLength: number,
  radians: number
) {
  const xEnd = center.x + Math.cos(radians) * (radius + extraLength)
  const yEnd = center.y + Math.sin(radians) * (radius + extraLength)
  graphics.lineBetween(center.x, center.y, xEnd, yEnd)
}

// 🔹 Função para criar pontos interativos
function createInteractivePoint(
  scene: Phaser.Scene,
  position: { x: number; y: number },
  circle: number,
  angle: number,
  type: string
) {
  const pointObject = scene.add
    .zone(position.x, position.y, 45, 45)
    .setInteractive()
  scene.add.circle(position.x, position.y, 25, 0x00ff00).setAlpha(0.1)

  pointObject.on('pointerdown', () =>
    pointClick(scene as GameBoard, circle, angle, type)
  )
}

function tryPlaceAllyShip(scene: GameBoard, coordinates: ICoordinates) {
  if (coordinates) {
    if (coordinates.occupied) {
      console.log('Posição ocupada')
      return
    }
  }
}

function placeAllyShip(
  scene: GameBoard,
  coordinates: ICoordinates,
  type: string
) {
  scene.add.image(coordinates.x, coordinates.y, `ship_${type}`).setScale(0.5)

  console.log(
    'Clicou no ponto',
    coordinates.circle,
    coordinates.angle,
    coordinates
  )
}

function pointClick(
  scene: GameBoard,
  circle: number,
  angle: number,
  type: string
) {
  console.log(type)

  const coordinates =
    type === 'ally'
      ? scene.coordinatesAlly.find(
          coord => coord.circle === circle && coord.angle === angle
        )
      : scene.coordinatesEnemy.find(
          coord => coord.circle === circle && coord.angle === angle
        )

  // ;(scene as GameBoard).gameStatus = 'attacking'

  if (coordinates && type === 'ally' && scene.gameStatus === 'setup') {
    tryPlaceAllyShip(scene, coordinates)
  }

  console.log('Clicou no ponto', circle, angle, coordinates)
}

export class GameBoard extends Phaser.Scene {
  coordinatesAlly: ICoordinates[] = []
  coordinatesEnemy: ICoordinates[] = []
  gameStatus: 'setup' | 'attacking' | 'receiving attack' = 'setup'

  constructor() {
    super({ key: 'GameBoard', active: true }) // Garante que a cena tenha um identificador único
  }

  preload() {
    loadAssets(this)
  }

  create() {
    if (!this.add) {
      console.error(
        "Erro: 'this.add' está indefinido. Verifique a inicialização da cena."
      )
      return
    }

    const width = Number(this.sys.game.config.width)
    const height = Number(this.sys.game.config.height)

    drawBoard(this, width, height)

    // GameEvents.on(
    //   'placeShip', (data: { color: string; count: number }) => {
    //     updateTextAlly(this, data.color, data.count)
    //   }
    // )

    GameEvents.on(
      'placeAllyShipInSetupFase ',
      (data: { color: string; coordinates: ICoordinates }) => {
        placeAllyShip(this, data.coordinates, data.color)
      }
    )
  }
}
