import { loadAssets } from './GameAssets'
import { GameEvents } from './GameEvents'

const fontConfig = {
  fontSize: '20px',
  fontFamily: 'Lexend',
  fill: '#50FA7B',
  align: 'center',
}

const shipColors = ['red', 'black', 'green', 'blue']

// Função para criar texto
function createTextCounts(
  scene: Phaser.Scene,
  width: number,
  height: number,
  title: string
) {
  scene.add.text(width / 2 / 2, 20, title, fontConfig).setOrigin(0.5, 0.5)

  shipColors.forEach((color, index) => {
    const x = (width / 2 / 5) * (index + 1)

    const image = scene.add
      .image(x, 60, `ship_${color}`)
      .setScale(0.5)
      .setOrigin(0.5, 0.5)

    const countText = scene.add
      .text(x, 100, `x 0`, fontConfig) // Inicialmente todas começam com 0
      .setOrigin(0.5, 0.5)

    countText.name = color

    if (scene instanceof UIScene) {
      scene.textCounts.add(image)
      scene.textCounts.add(countText)
      scene.textObjects[color] = countText
    }
  })
}

function updateTextCount(scene: Phaser.Scene, color: string, count: number) {
  if (scene instanceof UIScene) {
    scene.textObjects[color].setText(`x ${count}`)
  }
}

export class UIScene extends Phaser.Scene {
  textCounts!: Phaser.GameObjects.Group
  textObjects: Record<string, Phaser.GameObjects.Text> = {}
  customData: any

  constructor(config?: any) {
    super({ key: 'UIScene', active: true }) // Garante que a cena tenha um identificador único

    if (config) {
      this.customData = config // Guarda os dados
    }
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

    this.textCounts = this.add.group()

    createTextCounts(this, width, height, 'Player 1 - Naves')

    GameEvents.on(
      'updateTextCountShips',
      (data: { color: string; count: number }) => {
        updateTextCount(this, data.color, data.count)
      }
    )
  }
}
