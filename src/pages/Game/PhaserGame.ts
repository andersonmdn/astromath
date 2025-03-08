import Phaser from 'phaser'
import { Board } from './Scenes/Board'
import { Main } from './Scenes/Main'
import { MainUI } from './Scenes/MainUI'
import { Preparation } from './Scenes/Preparation'

export const createGame = (parentId: string) => {
  const parentElement = document.getElementById(parentId)
  const margin = 8

  const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: parentElement
      ? Math.max(800, parentElement.clientWidth) - margin
      : 800,
    height: parentElement
      ? Math.max(600, parentElement.clientHeight) - margin
      : 600,
    parent: parentId,
    scene: [Main, MainUI, Board, Preparation], // Certifique-se de que a cena está sendo incluída
  }

  return new Phaser.Game(gameConfig)
}
