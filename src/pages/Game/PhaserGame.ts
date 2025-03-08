import Phaser from 'phaser'
import { GameBoard } from './GameBoard'
import { MainScene } from './MainScene'
import { SetupScene } from './SetupScene'
import { UIScene } from './UIScene'

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
    scene: [MainScene, UIScene, GameBoard, SetupScene], // Certifique-se de que a cena está sendo incluída
  }

  return new Phaser.Game(gameConfig)
}
