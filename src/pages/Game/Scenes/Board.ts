import ICoordinates from '../../../types/ICoordinates'
import { log } from '../../../utils/logger'
import { GameEvents } from '../GameEvents'
import { loadAssets } from '../Scripts/Assets'

const angleLabelStyle = {
  fontSize: '16px',
  fontFamily: 'Lexend',
  fill: '#FFFFFF',
  align: 'center',
}

/**
 * Cena principal do tabuleiro do jogo Astromath
 */
export class Board extends Phaser.Scene {
  coordinatesAlly: ICoordinates[] = []
  coordinatesEnemy: ICoordinates[] = []
  gameStatus: 'setup' | 'attacking' | 'receiving attack' = 'setup'

  constructor() {
    super({ key: 'SceneBoard', active: false })
  }

  preload() {
    loadAssets(this)
  }

  create() {
    if (!this.add) {
      console.error("Erro: 'this.add' está indefinido.")
      return
    }

    const width = Number(this.sys.game.config.width)
    const height = Number(this.sys.game.config.height)

    drawGameBoard(this, width, height)

    // Evento disparado ao posicionar uma nave
    GameEvents.on(
      'placeShip',
      (data: { circle: number; angle: number; color: string }) => {
        const coordinate = this.coordinatesAlly.find(
          coord => coord.circle === data.circle && coord.angle === data.angle
        )

        if (coordinate) {
          this.add
            .image(coordinate.x, coordinate.y, `ship_${data.color}`)
            .setScale(0.5)
          coordinate.alive = true
          coordinate.occupied = true
          coordinate.ship = true
          coordinate.type = data.color
        }
      }
    )

    // Evento usado durante a fase de preparação do jogador
    GameEvents.on(
      'placeAllyShipInSetupFase',
      (data: { color: string; coordinates: ICoordinates }) => {
        drawAllyShipImage(this, data.coordinates, data.color)
      }
    )
  }
}

/**
 * Cria o tabuleiro com coordenadas, círculos, linhas e interações
 */
function drawGameBoard(scene: Board, width: number, height: number) {
  const allyGroup = scene.add.group()
  const enemyGroup = scene.add.group()

  const graphics = {
    ally: scene.add.graphics({ lineStyle: { width: 1, color: 0x50fa7b } }),
    enemy: scene.add.graphics({ lineStyle: { width: 1, color: 0xff5555 } }),
  }

  allyGroup.add(graphics.ally)
  enemyGroup.add(graphics.enemy)

  const center = {
    ally: { x: width / 2, y: height / 2 },
    enemy: { x: width / 2, y: height / 2 },
  }

  const circleRadii = [100, 150, 200] // Raio dos círculos do tabuleiro
  const radialExtension = 35 // Extensão das linhas radiais

  circleRadii.forEach((radius, index) => {
    drawCircle(graphics.ally, center.ally, radius)
    drawCircle(graphics.enemy, center.enemy, radius)

    for (let angle = 0; angle < 360; angle += 30) {
      const radians = Phaser.Math.DegToRad(angle)

      // Calcula a posição do ponto no círculo
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

      if (index === circleRadii.length - 1) {
        drawRadialLine(
          graphics.ally,
          center.ally,
          radius,
          radialExtension,
          radians
        )
        drawRadialLine(
          graphics.enemy,
          center.enemy,
          radius,
          radialExtension,
          radians
        )
      }

      if (index === 2) {
        const labelX =
          center.ally.x + Math.cos(radians) * (radius + radialExtension + 20)
        const labelY =
          center.ally.y + Math.sin(radians) * (radius + radialExtension + 20)
        scene.add
          .text(labelX, labelY, `${angle}°`, angleLabelStyle)
          .setOrigin(0.5)
      }

      const { clickableZone: allyClickableZone, circleZone: allyCircleZone } =
        addInteractivePoint(scene, positions.ally, index + 1, angle, 'ally')

      allyGroup.add(allyClickableZone)
      allyGroup.add(allyCircleZone)

      const { clickableZone: enemyClickableZone, circleZone: enemyCircleZone } =
        addInteractivePoint(scene, positions.enemy, index + 1, angle, 'enemy')
      enemyGroup.add(enemyClickableZone)
      enemyGroup.add(enemyCircleZone)
    }
  })

  allyGroup.setVisible(true)
  enemyGroup.setVisible(false)

  scene.add
    .text(20, 60, 'Board Enemy', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#771c1cff',
      padding: { x: 10, y: 5 },
    })
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      allyGroup.setVisible(false)
      enemyGroup.setVisible(true)
    })

  scene.add
    .text(20, 20, 'Board Ally', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#1f771cff',
      padding: { x: 10, y: 5 },
    })
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      allyGroup.setVisible(true)
      enemyGroup.setVisible(false)
    })
}

/**
 * Desenha um círculo no tabuleiro
 */
function drawCircle(
  graphics: Phaser.GameObjects.Graphics,
  center: { x: number; y: number },
  radius: number
) {
  graphics.strokeCircle(center.x, center.y, radius)
}

/**
 * Desenha uma linha radial a partir do centro do círculo
 */
function drawRadialLine(
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

/**
 * Adiciona zona interativa nos pontos do tabuleiro
 */
function addInteractivePoint(
  scene: Phaser.Scene,
  position: { x: number; y: number },
  circle: number,
  angle: number,
  side: 'ally' | 'enemy'
) {
  const circleColor = side === 'ally' ? 0x00ff00 : 0xb94435

  const clickableZone = scene.add
    .zone(position.x, position.y, 45, 45)
    .setInteractive()
  const circleZone = scene.add
    .circle(position.x, position.y, 25, circleColor)
    .setAlpha(0.1)

  clickableZone.on('pointerdown', () =>
    onGridPointClick(scene as Board, circle, angle, side)
  )

  return { clickableZone, circleZone }
}

/**
 * Gerencia clique do jogador em uma célula do tabuleiro
 */
function onGridPointClick(
  scene: Board,
  circle: number,
  angle: number,
  side: string
) {
  const coordinate =
    side === 'ally'
      ? scene.coordinatesAlly.find(
          c => c.circle === circle && c.angle === angle
        )
      : scene.coordinatesEnemy.find(
          c => c.circle === circle && c.angle === angle
        )

  if (
    coordinate &&
    side === 'ally' &&
    scene.gameStatus === 'setup' &&
    !coordinate.occupied
  ) {
    emitTryPlaceShip(scene, scene.coordinatesAlly, coordinate)
  }

  log('Clicou no ponto', circle, angle, coordinate)
}

/**
 * Emite evento para tentativa de posicionar uma nave
 */
function emitTryPlaceShip(
  scene: Board,
  coordinates: ICoordinates[],
  coordinate: ICoordinates
) {
  GameEvents.emit('tryPlaceShip', {
    coordinates,
    circle: coordinate.circle,
    angle: coordinate.angle,
  })
}

/**
 * Desenha visualmente a nave aliada no tabuleiro
 */
function drawAllyShipImage(
  scene: Board,
  coordinate: ICoordinates,
  shipType: string
) {
  scene.add.image(coordinate.x, coordinate.y, `ship_${shipType}`).setScale(0.5)
}
