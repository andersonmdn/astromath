import Phaser from 'phaser'
import ICoordinates from '../../../types/ICoordinates'
import { GameEvents } from '../GameEvents'
import { loadAssets } from '../Scripts/Assets'
import { log } from '../../../utils/logger'

interface IPreparationRule {
  color: string
  name: string
  description: string
  need_neighbor: boolean
  group: number
  quantity: number
}

const scenePreparationRules: IPreparationRule[] = [
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

function getAdjacentCoordinates(
  coordinates: ICoordinates[],
  circle: number,
  angle: number,
  allowAdjacentCircle: boolean = true
): ICoordinates[] {
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

function canPlaceShip(
  coordinates: ICoordinates[],
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

  // Filtrar vizinhos que já possuem uma nave
  if (!adjacent) return true

  const sameTypeNeighbors = adjacent.filter(
    coord => coord.ship && coord.type === color
  )
  const differentTypeNeighbors = adjacent.filter(
    coord => coord.ship && coord.type !== color
  )

  const sameColorShips = coordinates.filter(
    coord => coord.ship && coord.type === color
  ).length
  log('Quantidade de naves da mesma cor:', sameColorShips)

  // // Se houver algum vizinho de tipo diferente, não pode posicionar
  // if (differentTypeNeighbors.length > 0) {
  //   log('Vizinho de tipo diferente')
  //   return false
  // }

  // Verifica a quantidade de vizinhos do mesmo tipo conforme a regra
  const count = sameTypeNeighbors.length
  log('Vizinhos do mesmo tipo:', count)

  switch (color) {
    case 'blue':
      return (
        sameTypeNeighbors.length === 0 && differentTypeNeighbors.length === 0
      )
    case 'black':
      return (
        sameTypeNeighbors.length > 0 || sameColorShips === 0 /*&&
        differentTypeNeighbors.length === 0*/
      )
    case 'red':
      return (
        sameTypeNeighbors.length === 1 ||
        sameColorShips === 0 ||
        sameColorShips === 2
      ) /*&&
      differentTypeNeighbors.length === 0*/

    case 'green':
      return (
        sameTypeNeighbors.length > 0 || sameColorShips === 0 /*&&
        differentTypeNeighbors.length === 0*/
      )
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

  constructor() {
    super({ key: 'ScenePreparation', active: false }) // Garante que a cena tenha um identificador único
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

    GameEvents.on(
      'tryPlaceShip',
      (data: {
        coordinates: ICoordinates[]
        circle: number
        angle: number
      }) => {
        if (scenePreparationRules.length > 0) {
          if (
            canPlaceShip(
              data.coordinates,
              data.circle,
              data.angle,
              scenePreparationRules[0].color
            )
          ) {
            GameEvents.emit('placeShip', {
              circle: data.circle,
              angle: data.angle,
              color: scenePreparationRules[0].color,
            })

            scenePreparationRules[0].quantity--
            this.shipGroup[scenePreparationRules[0].color].clear(true, true)

            if (scenePreparationRules[0].quantity === 0) {
              scenePreparationRules.shift()
            }

            drawPreparationRules(this, width)
          }
        } else {
          GameEvents.emit('preparationEnd', {})
        }
      }
    )
  }

  update() {
    // scene.shipGroup[preparation.color].
  }
}
