interface IAssets {
  images: { [key: string]: string }
  spritesheets: {
    [key: string]: {
      path: string
      frameConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig
    }
  }
  audio: { [key: string]: string }
}

export default IAssets
