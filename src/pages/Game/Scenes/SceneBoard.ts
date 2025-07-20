// frontend/src/pages/Game/Scenes/SceneBoard.ts
import { toast } from 'react-toastify'
import { Socket } from 'socket.io-client'
import Board from '../../../types/Board'
import { Spaceship } from '../../../types/Spaceship'
import { log } from '../../../utils/logger'
import { loadAssets } from '../Scripts/Assets'
import scenePreparationRules from './Preparation'

const angleLabelStyle = {
  fontSize: '16px',
  fontFamily: 'Lexend',
  fill: '#FFFFFF',
  align: 'center',
}

/**
 * Cena principal do tabuleiro do jogo Astromath
 */
export class SceneBoard extends Phaser.Scene {
  coordinatesAlly: Board[] = []
  coordinatesEnemy: Board[] = []
  gameStatus: 'setup' | 'attacking' | 'receiving attack' = 'setup'
  socket!: Socket
  userId!: string
  roomId!: string

  constructor() {
    super({ key: 'SceneBoard' })
  }

  init(data: { socket: Socket; userId: string; roomId: string }) {
    this.socket = data.socket
    this.userId = data.userId
    this.roomId = data.roomId
  }

  preload() {
    loadAssets(this)
  }

  create() {
    if (!this.add) {
      console.error("Erro: 'this.add' está indefinido.")
      return
    }

    const width = Number(this.sys.game.config.width)
    const height = Number(this.sys.game.config.height)

    // Desenha o tabuleiro do jogo
    this.drawGameBoard(this, width, height)

    const registerBoard = toast.success('Registrando tabuleiro...')
    console.log('Registrando tabuleiro...')

    this.socket.emit(
      'registerBoard',
      {
        roomId: this.roomId,
        playerId: this.userId,
        board: this.coordinatesAlly,
      },
      (response: { success: boolean; error?: string }) => {
        if (response.success) {
          toast.update(registerBoard, {
            render: 'Tabuleiro registrado com sucesso!',
            type: 'success',
            isLoading: false,
            autoClose: 2000,
          })
        } else {
          toast.update(registerBoard, {
            render: `Erro ao registrar tabuleiro: ${response.error}`,
            type: 'error',
            isLoading: false,
            autoClose: 2000,
          })
        }
      }
    )

    // // Evento disparado ao posicionar uma nave no tabuleiro
    // GameEvents.on(
    //   'placeShip',
    //   (data: { circle: number; angle: number; color: string }) => {
    //     // Verifica se o círculo e o ângulo existem nas coordenadas aliadas
    //     const coordinate = this.coordinatesAlly.find(
    //       coord => coord.circle === data.circle && coord.angle === data.angle
    //     )

    //     if (coordinate) {
    //       this.add
    //         .image(coordinate.x, coordinate.y, `ship_${data.color}`)
    //         .setScale(0.5)
    //       coordinate.occupant = {
    //         alive: true,
    //         color: data.color,
    //       } as Spaceship

    //       const allyGroup = this.registry.get(
    //         'allyGroup'
    //       ) as Phaser.GameObjects.Group
    //     }
    //   }
    // )

    // // Evento usado durante a fase de preparação do jogador
    // GameEvents.on(
    //   'placeAllyShipInSetupFase',
    //   (data: { color: string; coordinates: Board }) => {
    //     drawAllyShipImage(this, data.coordinates, data.color)
    //   }
    // )
  }

  /**
   * Exemplo de função na classe que recebe argumentos e retorna um valor.
   */
  sumCoordinates(a: number, b: number): number {
    return a + b
  }

  /**
   * Emite evento para tentativa de posicionar uma nave
   */
  emitTryPlaceShip(scene: SceneBoard, coordinates: Board[], coordinate: Board) {
    if (!this.socket) return
    const spaceshipColor = scenePreparationRules[0].color

    const spaceship: Spaceship = {
      alive: true,
      color: spaceshipColor,
      type: 'Spaceship',
    }

    this.socket.emit(
      'tryPlaceShip',
      {
        roomId: this.roomId,
        playerId: this.userId,
        coordinate: coordinate,
        spaceship: spaceship,
      },
      (response: { success: boolean; error?: string }) => {
        if (response.success) {
          log('Pouso autorizado:', coordinate)
          toast.success('Pouso autorizado! Posicionando nave...')
          // GameEvents.emit('placeShip', {
          //   circle: coordinate.circle,
          //   angle: coordinate.angle,
          //   color: spaceshipColor, // Usando cor dinâmica
          // })
        } else {
          log('Erro ao posicionar nave:', response.error)
          toast.error(`Erro ao posicionar nave: ${response.error}`)
        }
      }
    )
  }

  /**
   * Cria o tabuleiro com coordenadas, círculos, linhas e interações
   */
  drawGameBoard(scene: SceneBoard, width: number, height: number) {
    const allyGroup = scene.add.group()
    const enemyGroup = scene.add.group()

    scene.registry.set('allyGroup', allyGroup)
    scene.registry.set('enemyGroup', enemyGroup)

    const graphics = {
      ally: scene.add.graphics({ lineStyle: { width: 1, color: 0x50fa7b } }),
      enemy: scene.add.graphics({ lineStyle: { width: 1, color: 0xff5555 } }),
    }

    allyGroup.add(graphics.ally)
    enemyGroup.add(graphics.enemy)

    const center = {
      ally: { x: width / 2, y: height / 2 },
      enemy: { x: width / 2, y: height / 2 },
    }

    const circleRadii = [100, 150, 200] // Raio dos círculos do tabuleiro
    const radialExtension = 35 // Extensão das linhas radiais

    circleRadii.forEach((radius, index) => {
      this.drawCircle(graphics.ally, center.ally, radius)
      this.drawCircle(graphics.enemy, center.enemy, radius)

      for (let angle = 0; angle < 360; angle += 30) {
        const radians = Phaser.Math.DegToRad(angle)

        // Calcula a posição do ponto no círculo
        const positions = {
          ally: {
            x: center.ally.x + Math.cos(radians) * radius,
            y: center.ally.y + Math.sin(radians) * radius,
          },
          enemy: {
            x: center.enemy.x + Math.cos(radians) * radius,
            y: center.enemy.y + Math.sin(radians) * radius,
          },
        }

        scene.coordinatesAlly.push({
          circle: index + 1,
          angle,
          x: positions.ally.x,
          y: positions.ally.y,
          occupant: null,
        })

        scene.coordinatesEnemy.push({
          circle: index + 1,
          angle,
          x: positions.enemy.x,
          y: positions.enemy.y,
          occupant: null,
        })

        // Desenha a linha radial
        if (index === circleRadii.length - 1) {
          this.drawRadialLine(
            graphics.ally,
            center.ally,
            radius,
            radialExtension,
            radians
          )
          this.drawRadialLine(
            graphics.enemy,
            center.enemy,
            radius,
            radialExtension,
            radians
          )
        }

        // Adiciona o texto do ângulo no círculo externo
        if (index === 2) {
          const labelX =
            center.ally.x + Math.cos(radians) * (radius + radialExtension + 20)
          const labelY =
            center.ally.y + Math.sin(radians) * (radius + radialExtension + 20)
          scene.add
            .text(labelX, labelY, `${angle}°`, angleLabelStyle)
            .setOrigin(0.5)
        }

        const { clickableZone: allyClickableZone, circleZone: allyCircleZone } =
          this.addInteractivePoint(
            scene,
            positions.ally,
            index + 1,
            angle,
            'ally'
          )

        const {
          clickableZone: enemyClickableZone,
          circleZone: enemyCircleZone,
        } = this.addInteractivePoint(
          scene,
          positions.enemy,
          index + 1,
          angle,
          'enemy'
        )

        // Adiciona zonas interativas e círculos ao grupo correspondente
        allyGroup.add(allyClickableZone)
        allyGroup.add(allyCircleZone)
        enemyGroup.add(enemyClickableZone)
        enemyGroup.add(enemyCircleZone)
      }
    })

    allyGroup.setVisible(true)
    enemyGroup.setVisible(false)

    scene.add
      .text(20, 60, 'Board Enemy', {
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#771c1cff',
        padding: { x: 10, y: 5 },
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        allyGroup.setVisible(false)
        enemyGroup.setVisible(true)
      })

    scene.add
      .text(20, 20, 'Board Ally', {
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#1f771cff',
        padding: { x: 10, y: 5 },
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        allyGroup.setVisible(true)
        enemyGroup.setVisible(false)
      })
  }

  /**
   * Desenha um círculo no tabuleiro
   */
  drawCircle(
    graphics: Phaser.GameObjects.Graphics,
    center: { x: number; y: number },
    radius: number
  ) {
    graphics.strokeCircle(center.x, center.y, radius)
  }

  /**
   * Desenha uma linha radial a partir do centro do círculo
   */
  drawRadialLine(
    graphics: Phaser.GameObjects.Graphics,
    center: { x: number; y: number },
    radius: number,
    extraLength: number,
    radians: number
  ) {
    const xEnd = center.x + Math.cos(radians) * (radius + extraLength)
    const yEnd = center.y + Math.sin(radians) * (radius + extraLength)
    graphics.lineBetween(center.x, center.y, xEnd, yEnd)
  }

  /**
   * Adiciona zona interativa nos pontos do tabuleiro
   */
  addInteractivePoint(
    scene: Phaser.Scene,
    position: { x: number; y: number },
    circle: number,
    angle: number,
    side: 'ally' | 'enemy'
  ) {
    const circleColor = side === 'ally' ? 0x00ff00 : 0xb94435

    const clickableZone = scene.add
      .zone(position.x, position.y, 45, 45)
      .setInteractive()
    const circleZone = scene.add
      .circle(position.x, position.y, 25, circleColor)
      .setAlpha(0.1)

    clickableZone.on('pointerdown', () =>
      this.onGridPointClick(scene as SceneBoard, circle, angle, side)
    )

    return { clickableZone, circleZone }
  }

  /**
   * Gerencia clique do jogador em uma célula do tabuleiro
   */
  onGridPointClick(
    scene: SceneBoard,
    circle: number,
    angle: number,
    side: string
  ) {
    const coordinate =
      side === 'ally'
        ? scene.coordinatesAlly.find(
            c => c.circle === circle && c.angle === angle
          )
        : scene.coordinatesEnemy.find(
            c => c.circle === circle && c.angle === angle
          )

    if (
      coordinate &&
      side === 'ally' &&
      scene.gameStatus === 'setup' &&
      !coordinate.occupant
    ) {
      this.emitTryPlaceShip(scene, scene.coordinatesAlly, coordinate)
    }
  }
}

// /**
//  * Desenha visualmente a nave aliada no tabuleiro
//  */
// function drawAllyShipImage(
//   scene: Board,
//   coordinate: Board,
//   shipType: string
// ) {
//   scene.add.image(coordinate.x, coordinate.y, `ship_${shipType}`).setScale(0.5)
// }
