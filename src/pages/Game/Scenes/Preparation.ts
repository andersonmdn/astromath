import Phaser from 'phaser'
import { GameEvents } from '../GameEvents'
import { loadAssets } from '../Scripts/Assets'

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
    const height = Number(this.sys.game.config.height)

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

    GameEvents.off('tryPlaceShip', () => {
      console.log('Tentando posicionar nave')
    })

    GameEvents.on('tryPlaceShip', () => {
      scenePreparationRules[0].quantity--
      this.shipGroup[scenePreparationRules[0].color].clear(true, true)

      if (scenePreparationRules[0].quantity == 0) {
        scenePreparationRules.shift()
      }

      drawPreparationRules(this, width)
    })
  }

  update() {
    // scene.shipGroup[preparation.color].
  }
}
