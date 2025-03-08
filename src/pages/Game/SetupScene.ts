import Phaser from 'phaser'
import { loadAssets } from './GameAssets'

interface ISetupRule {
  id: string
  name: string
  description: string
  need_neighbor: boolean
  group: number
  quantity: number
}

const sceneSetupRules: ISetupRule[] = [
  {
    id: 'blue',
    name: 'Caça Leve (Interceptor)',
    description: 'Posicionada individualmente.',
    need_neighbor: false,
    group: 5,
    quantity: 5,
  },
  {
    id: 'green',
    name: 'Nave de Combate Pesado (Battleship)',
    description: 'Posicionada um grupo de 4.',
    need_neighbor: true,
    group: 1,
    quantity: 4,
  },
  {
    id: 'black',
    name: 'Nave de Suporte (Support Ship)',
    description: 'Posicionada em um grupo de 3.',
    need_neighbor: true,
    group: 1,
    quantity: 3,
  },
  {
    id: 'red',
    name: 'Nave de Exploração (Scout)',
    description: 'Posicinada em duas duplas.',
    need_neighbor: true,
    group: 2,
    quantity: 4,
  },
]

function createShipSetup(scene: Phaser.Scene, width: number, id: string) {
  const setupScene = scene as SetupScene

  sceneSetupRules.map(setup => {
    if (setup.id === id) {
      setupScene.shipName.text = setup.name
      setupScene.shipDescription.text = setup.description

      const centerX = width / 2 // Centro da tela
      const startY = 130 // Posição final no eixo Y
      const spacing = 60 // Distância entre as naves
      const totalShips = setup.quantity

      for (let i = 0; i < totalShips; i++) {
        // Calcula a posição X garantindo distribuição simétrica
        const offset = (i - (totalShips - 1) / 2) * spacing
        const x = centerX + offset

        const ship = setupScene.add
          .image(x, -100, `ship_${setup.id}`)
          .setScale(0.5)

        setupScene.add
          .tween({
            targets: ship,
            duration: 100,
            delay: 500 * i,
            y: startY,
            onComplete: () => {
              ship.setInteractive()
            },
          })
          .play()
      }
    }
  })
}

export class SetupScene extends Phaser.Scene {
  shipName!: Phaser.GameObjects.Text
  shipDescription!: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'SetupScence', active: true }) // Garante que a cena tenha um identificador único
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

    createShipSetup(this, width, 'blue')

    // GameEvents.on(
    //   'getAllyShipInSetupFase ',
    //   (data: { color: string; coordinates: ICoordinates }) => {
    //     placeAllyShip(this, data.coordinates, data.color)
    //   }
    // )
  }
}
