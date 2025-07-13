import Phaser from 'phaser'
import { Board } from './Scenes/Board'
import { Main } from './Scenes/Main'
import { MainUI } from './Scenes/MainUI'
import { Preparation } from './Scenes/Preparation'

export const createGame = (parentId: string) => {
  const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: parentId,
    scene: [Main, MainUI, Board, Preparation],
  }

  return new Phaser.Game(gameConfig)
}
