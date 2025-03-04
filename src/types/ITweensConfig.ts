interface ITweensConfig {
  targets: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]
  alpha?: number
  angle?: number
  x?: number | string
  duration?: number
  repeat?: number
  yoyo?: boolean
  repeatDelay?: number
}

export default ITweensConfig
