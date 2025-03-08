import Phaser from 'phaser'
import { loadAssets } from './GameAssets'
import { createBackground } from './MainSceneBackground'

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' }) // Garante que a cena tenha um identificador único
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

    createBackground(this, width, height)

    //Buttors to Test Event Emitter UpdateTextCount
    const button = this.add
      .image(100, height - 100, 'button')
      .setInteractive()
      .setScale(0.5)

    this.add
      .text(button.x, button.y, 'Preparação', {
        fontSize: '20px',
        color: 'white',
        align: 'center',
        fontFamily: 'Lexend',
      })
      .setOrigin(0.5)

    button.on('pointerdown', () => {
      this.scene.remove('UIScene')
      this.scene.start('SetupScene')
    })
  }
}
