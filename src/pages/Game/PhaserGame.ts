// frontend/src/pages/Game/PhaserGame.ts
import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { Main } from './Scenes/Main'
import { MainUI } from './Scenes/MainUI'
import { Preparation } from './Scenes/Preparation'
import { SceneBoard } from './Scenes/SceneBoard'

export const createGame = (
  parentId: string,
  data?: {
    socket: Socket
    userId: string
    roomId: string
  }
) => {
  const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: parentId,
    scene: [Main, MainUI], // SceneBoard será adicionada depois
  }

  const game = new Phaser.Game(gameConfig)

  if (data) {
    const sceneBoard = new SceneBoard()
    const scenePreparation = new Preparation()

    game.scene.add('SceneBoard', sceneBoard, false)
    game.scene.add('ScenePreparation', scenePreparation, false)

    game.scene.start('SceneBoard', {
      socket: data.socket,
      userId: data.userId,
      roomId: data.roomId,
    })

    game.scene.start('ScenePreparation', {
      socket: data.socket,
      userId: data.userId,
      roomId: data.roomId,
    })
  }

  return game
}
