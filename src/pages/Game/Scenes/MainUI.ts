import { GameEvents } from '../GameEvents'
import { loadAssets } from '../Scripts/Assets'

const fontConfigAlly = {
  fontSize: '20px',
  fontFamily: 'Lexend',
  fill: '#50FA7B',
  align: 'center',
}

const fontConfigEnemy = {
  fontSize: '20px',
  fontFamily: 'Lexend',
  fill: '#FF5555',
  align: 'center',
}

const shipColors = ['red', 'black', 'green', 'blue']
const shipSpacing = 5

function createTextCounts(
  scene: Phaser.Scene,
  width: number,
  height: number,
  allyLabel: string,
  enemyLabel: string
) {
  const widthMiddle = width / 2

  scene.add
    .text(widthMiddle / 2, 20, allyLabel, fontConfigAlly)
    .setOrigin(0.5, 0.5)

  scene.add
    .text(widthMiddle + widthMiddle / 2, 20, enemyLabel, fontConfigEnemy)
    .setOrigin(0.5, 0.5)
    .setOrigin(0.5, 0.5)

  shipColors.forEach((color, index) => {
    const x = (widthMiddle / shipSpacing) * (index + 1)

    scene.add.image(x, 80, `ship_${color}`).setScale(0.5).setOrigin(0.5, 0.5)
    scene.add
      .image(widthMiddle + x, 80, `ship_${color}`)
      .setScale(0.5)
      .setOrigin(0.5, 0.5)

    const countTextAlly = scene.add
      .text(x, 120, `x 0`, fontConfigAlly)
      .setOrigin(0.5, 0.5)

    const countTextEnemy = scene.add
      .text(widthMiddle + x, 120, `x 0`, fontConfigEnemy)
      .setOrigin(0.5, 0.5)

    countTextAlly.name = color
    countTextEnemy.name = color

    if (scene instanceof MainUI) {
      scene.textAlly[color] = countTextAlly
      scene.textEnemy[color] = countTextEnemy
    }
  })
}

function updateTextAlly(scene: Phaser.Scene, color: string, count: number) {
  if (scene instanceof MainUI) {
    scene.textAlly[color].setText(`x ${count}`)
  }
}

function updateTextEnemy(scene: Phaser.Scene, color: string, count: number) {
  if (scene instanceof MainUI) {
    scene.textEnemy[color].setText(`x ${count}`)
  }
}

export class MainUI extends Phaser.Scene {
  textAlly: Record<string, Phaser.GameObjects.Text> = {}
  textEnemy: Record<string, Phaser.GameObjects.Text> = {}
  customData: any

  constructor(config?: any) {
    super({ key: 'SceneMainUI', active: false }) // Garante que a cena tenha um identificador único

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

    createTextCounts(
      this,
      width,
      height,
      'Player 1 - Naves',
      'Player 2 - Naves'
    )

    GameEvents.on(
      'updateTextCountShipsAlly',
      (data: { color: string; count: number }) => {
        updateTextAlly(this, data.color, data.count)
      }
    )

    GameEvents.on(
      'updateTextCountShipsEnemy',
      (data: { color: string; count: number }) => {
        updateTextEnemy(this, data.color, data.count)
      }
    )
  }
}
