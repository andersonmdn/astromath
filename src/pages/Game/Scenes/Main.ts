import Phaser from 'phaser'
import Phase from '../../../enums/Phase'
import { GameEvents } from '../GameEvents'
import { loadAssets } from '../Scripts/Assets'
import { createBackground } from '../Scripts/MainBackground'
import { log } from '../../../utils/logger'

export class Main extends Phaser.Scene {
  phase: Phase
  preparationLaunched: boolean = false

  constructor() {
    super({ key: 'SceneMain', active: true })
    this.phase = Phase.Preparation
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

    GameEvents.on('changeStatus', (phase: Phase) => {
      this.updatePhase(phase)
    })

    GameEvents.on('preparationEnd', () => {
      //Transmintir para para o Backend que a preparação acabou
      log('Preparação finalizada')
    })

    this.add
      .image(width / 2, height / 2, 'button-attack')
      .setInteractive()
      .on('pointerdown', () => {
        log('Botão de ataque pressionado')
      })
  }

  updatePhase(newPhase: Phase) {
    this.phase = newPhase
    log(`Fase alterada para: ${this.phase}`)
  }

  update() {
    switch (this.phase) {
      case Phase.Preparation:
        if (!this.preparationLaunched) {
          this.preparationLaunched = true
          this.scene.launch('ScenePreparation')
          this.scene.launch('SceneBoard')
        }
        break
      case Phase.Attack:
        break
      case Phase.Defense:
        break
      default:
        console.error('Erro: fase não reconhecida.')
    }
  }
}
