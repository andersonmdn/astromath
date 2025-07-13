function animateStar(scene: Phaser.Scene, star: Phaser.GameObjects.Sprite) {
  scene.tweens.add({
    targets: star,
    alpha: { from: 0.3, to: 1 }, // Variação da opacidade
    duration: Phaser.Math.Between(500, 2000),
    yoyo: true,
    repeat: -1,
    delay: Phaser.Math.Between(0, 3000),
    ease: 'Sine.easeInOut', // Easing suave
  })
}

function createStar(
  scene: Phaser.Scene,
  stars: Phaser.GameObjects.Group,
  width: number,
  height: number
) {
  const starTexture = Phaser.Utils.Array.GetRandom([
    'star_1',
    'star_2',
    'star_3',
  ])

  const star = scene.add
    .sprite(
      Phaser.Math.Between(0, width),
      Phaser.Math.Between(0, height),
      starTexture
    )
    .setScale(Phaser.Math.FloatBetween(0.1, 0.5))
    .setAlpha(Phaser.Math.FloatBetween(0.3, 1))

  stars.add(star)

  animateStar(scene, star)
}

function destroyAndCreateStars(
  scene: Phaser.Scene,
  stars: Phaser.GameObjects.Group,
  width: number,
  height: number
) {
  const starsToDestroy = Phaser.Math.Between(10, 30)
  for (let i = 0; i < starsToDestroy; i++) {
    const star = Phaser.Utils.Array.GetRandom(stars.getChildren())
    if (star) {
      star.destroy()
      stars.remove(star)
    }
  }

  const starsToCreate = starsToDestroy
  for (let i = 0; i < starsToCreate; i++) {
    createStar(scene, stars, width, height)
  }
}

function createStars(
  scene: Phaser.Scene,
  stars: Phaser.GameObjects.Group,
  width: number,
  height: number
) {
  for (let i = 0; i < 50; i++) {
    createStar(scene, stars, width, height)
  }

  scene.time.addEvent({
    delay: 5000,
    loop: true,
    callback: () => {
      destroyAndCreateStars(scene, stars, width, height)
    },
  })
}

function createClouds(scene: Phaser.Scene, width: number, height: number) {
  const clouds = scene.add.group()

  for (let i = 0; i < 5; i++) {
    const randomCloudIndex = Phaser.Math.Between(1, 9)
    const cloudTexture = `cloud_${randomCloudIndex}`

    const cloud = scene.add
      .sprite(
        Phaser.Math.Between(-width, 0), // Posição X aleatória
        Phaser.Math.Between(0, height / 2), // Posição Y aleatória
        cloudTexture // Textura da nuvem
      )
      .setScale(Phaser.Math.FloatBetween(0.5, 1.5))
      .setAlpha(0.1) // Tamanho aleatório

    clouds.add(cloud)

    scene.tweens.add({
      targets: cloud,
      x: width + cloud.width,
      duration: Phaser.Math.Between(10000, 20000),
      repeat: -1,
      yoyo: false,
      repeatDelay: 5000,
      ease: 'Linear',
      onRepeat: () => {
        cloud.y = Phaser.Math.Between(0, height / 2)
      },
    })
  }
}

function createBackground(scene: Phaser.Scene, width: number, height: number) {
  // const gradient = scene.add.graphics()
  const stars = scene.add.group()

  // // Cria um gradiente vertical (de azul escuro para preto)
  // gradient.fillGradientStyle(
  //   0x000033, // Azul escuro (topo)
  //   0x000000, // Preto (base)
  //   1, // Alpha do topo
  //   1 // Alpha da base
  // )
  scene.cameras.main.setBackgroundColor(0x0e0d11)
  // gradient.fillRect(0, 0, width, height) // Preenche a tela com o gradiente
  createClouds(scene, width, height) // Adiciona nuvens ao fundo
  createStars(scene, stars, width, height) // Adiciona estrelas ao fundo
}

export { createBackground }
