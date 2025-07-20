import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import Board from '../../../types/Board'
import PreparationRule from '../../../types/PreparationRule'
import { Spaceship } from '../../../types/Spaceship'
import { log } from '../../../utils/logger'
import { GameEvents } from '../GameEvents'
import { loadAssets } from '../Scripts/Assets'

const scenePreparationRules: PreparationRule[] = [
  {
    color: 'blue',
    name: 'Caça Leve (Interceptor)',
    description: 'Posicionada individualmente.',
    need_neighbor: false,
    group: 5,
    quantity: 5,
  },
  {
    color: 'green',
    name: 'Nave de Combate Pesado (Battleship)',
    description: 'Posicionada um grupo de 4.',
    need_neighbor: true,
    group: 1,
    quantity: 4,
  },
  {
    color: 'black',
    name: 'Nave de Suporte (Support Ship)',
    description: 'Posicionada em um grupo de 3.',
    need_neighbor: true,
    group: 1,
    quantity: 3,
  },
  {
    color: 'red',
    name: 'Nave de Exploração (Scout)',
    description: 'Posicionada em duas duplas.',
    need_neighbor: true,
    group: 2,
    quantity: 4,
  },
]

export default scenePreparationRules

function getAdjacentCoordinates(
  coordinates: Board[],
  circle: number,
  angle: number,
  allowAdjacentCircle = true
): Board[] {
  return coordinates.filter(coord => {
    const adjustedAnglePlus = (angle + 30) % 360
    const adjustedAngleMinus = (angle - 30 + 360) % 360

    const sameCircle =
      coord.circle === circle &&
      (coord.angle === adjustedAnglePlus || coord.angle === adjustedAngleMinus)

    if (!allowAdjacentCircle) {
      return sameCircle
    }

    const adjacentCircle =
      Math.abs(coord.circle - circle) === 1 && coord.angle === angle

    return sameCircle || adjacentCircle
  })
}

function canPlaceBlue(
  sameTypeNeighbors: Board[],
  differentTypeNeighbors: Board[]
): boolean {
  return sameTypeNeighbors.length === 0 && differentTypeNeighbors.length === 0
}

function canPlaceBlack(
  sameTypeNeighbors: Board[],
  sameColorShips: number
): boolean {
  return sameTypeNeighbors.length > 0 || sameColorShips === 0
}

function canPlaceRed(
  sameTypeNeighbors: Board[],
  sameColorShips: number
): boolean {
  return (
    sameTypeNeighbors.length === 1 ||
    sameColorShips === 0 ||
    sameColorShips === 2
  )
}

function canPlaceGreen(
  sameTypeNeighbors: Board[],
  sameColorShips: number
): boolean {
  return sameTypeNeighbors.length > 0 || sameColorShips === 0
}

function canPlaceShip(
  coordinates: Board[],
  circle: number,
  angle: number,
  color: string
): boolean {
  const adjacent = getAdjacentCoordinates(
    coordinates,
    circle,
    angle,
    color === 'green' ? false : true
  )

  if (!adjacent) return true

  const sameTypeNeighbors = adjacent.filter(
    coord =>
      coord.occupant &&
      coord.occupant.type === 'Spaceship' &&
      coord.occupant.color === color
  )
  log('Vizinhos do mesmo tipo:', sameTypeNeighbors)
  const differentTypeNeighbors = adjacent.filter(
    coord =>
      coord.occupant &&
      coord.occupant.type === 'Spaceship' &&
      coord.occupant.color !== color
  )
  log('Vizinhos de tipo diferente:', differentTypeNeighbors)
  const sameColorShips = coordinates.filter(
    coord =>
      coord.occupant &&
      coord.occupant.type === 'Spaceship' &&
      coord.occupant.color === color
  ).length
  log('Quantidade de naves da mesma cor:', sameColorShips)

  const count = sameTypeNeighbors.length
  log('Vizinhos do mesmo tipo:', count)

  switch (color) {
    case 'blue':
      return canPlaceBlue(sameTypeNeighbors, differentTypeNeighbors)
    case 'black':
      return canPlaceBlack(sameTypeNeighbors, sameColorShips)
    case 'red':
      return canPlaceRed(sameTypeNeighbors, sameColorShips)
    case 'green':
      return canPlaceGreen(sameTypeNeighbors, sameColorShips)
    default:
      return false
  }
}

function drawPreparationRules(scene: Preparation, width: number) {
  let previousColor: string | null = null

  scenePreparationRules.forEach(preparation => {
    if (previousColor && preparation.color !== previousColor) {
      return
    }

    scene.shipName.text = preparation.name
    scene.shipDescription.text = preparation.description

    const centerX = width / 2 // Centro da tela
    const spacing = 60 // Distância entre as naves
    const totalShips = preparation.quantity

    for (let i = 0; i < totalShips; i++) {
      // Calcula a posição X garantindo distribuição simétrica
      const offset = (i - (totalShips - 1) / 2) * spacing
      const x = centerX + offset

      const ship = scene.add
        .image(x, 130, `ship_${preparation.color}`)
        .setScale(0.5)

      scene.shipGroup[preparation.color].add(ship)
    }

    previousColor = preparation.color
  })
}

export class Preparation extends Phaser.Scene {
  shipName!: Phaser.GameObjects.Text
  shipDescription!: Phaser.GameObjects.Text
  shipGroup: Record<string, Phaser.GameObjects.Group> = {}
  socket!: Socket
  userId!: string
  roomId!: string

  constructor() {
    super({ key: 'ScenePreparation', active: false }) // Garante que a cena tenha um identificador único
  }

  init(data: { socket: Socket; userId: string; roomId: string }) {
    this.socket = data.socket
    this.userId = data.userId
    this.roomId = data.roomId
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

    //Background
    const width = Number(this.sys.game.config.width)
    // const height = Number(this.sys.game.config.height)

    scenePreparationRules.forEach(rule => {
      this.shipGroup[rule.color] = this.add.group()
    })

    this.add
      .text(width / 2, 20, 'Preparação', {
        fontSize: '25px',
        color: '#FFB86C',
        align: 'center',
        fontFamily: 'Lexend',
      })
      .setOrigin(0.5)

    this.shipName = this.add
      .text(width / 2, 50, '', {
        fontSize: '20px',
        color: '#FFB86C',
        align: 'center',
        fontFamily: 'Lexend',
      })
      .setOrigin(0.5)

    this.shipDescription = this.add
      .text(width / 2, 80, '', {
        fontSize: '20px',
        color: '#FFB86C',
        align: 'center',
        fontFamily: 'Lexend',
      })
      .setOrigin(0.5)

    drawPreparationRules(this, width)

    this.socket.on(
      'LandingSpaceship',
      (data: { coordinate: Board; spaceship: Spaceship }) => {
        if (scenePreparationRules.length > 0) {
          GameEvents.emit('placeShip', {
            circle: data.coordinate.circle,
            angle: data.coordinate.angle,
            color: scenePreparationRules[0].color,
          })

          scenePreparationRules[0].quantity--
          this.shipGroup[scenePreparationRules[0].color].clear(true, true)

          if (scenePreparationRules[0].quantity === 0) {
            scenePreparationRules.shift()

            if (scenePreparationRules.length === 0) {
              GameEvents.emit('preparationEnd', {})
            }
          }

          drawPreparationRules(this, width)
        }
      }
    )
  }

  update() {
    // scene.shipGroup[preparation.color].
  }
}
