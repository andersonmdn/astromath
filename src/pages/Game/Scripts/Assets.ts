import IAssets from '../../../types/IAssets'

const Assets: IAssets = {
  images: {
    laser: '/assets/kenney_space-shooter-redux/PNG/Lasers/laserRed01.png',
    star_1: '/assets/kenney_space-shooter-redux/PNG/Effects/star1.png',
    star_2: '/assets/kenney_space-shooter-redux/PNG/Effects/star2.png',
    star_3: '/assets/kenney_space-shooter-redux/PNG/Effects/star3.png',
    shootingStar: '/assets/yellow.png',
    meteor:
      '/assets/kenney_space-shooter-redux/PNG/Meteors/meteorBrown_big1.png',
    blackhole: '/assets/kenney_planets/Parts/sphere2.png',
    ship_blue: '/assets/kenney_space-shooter-redux/PNG/Enemies/enemyBlue1.png',
    ship_red: '/assets/kenney_space-shooter-redux/PNG/Enemies/enemyRed2.png',
    ship_black:
      '/assets/kenney_space-shooter-redux/PNG/Enemies/enemyBlack3.png',
    ship_green:
      '/assets/kenney_space-shooter-redux/PNG/Enemies/enemyGreen4.png',
    button:
      '/assets/kenney_ui-pack/PNG/Red/Double/button_rectangle_depth_flat.png',
    cloud_1: '/assets/kenney_background-elements/PNG/cloud1.png',
    cloud_2: '/assets/kenney_background-elements/PNG/cloud2.png',
    cloud_3: '/assets/kenney_background-elements/PNG/cloud3.png',
    cloud_4: '/assets/kenney_background-elements/PNG/cloud4.png',
    cloud_5: '/assets/kenney_background-elements/PNG/cloud5.png',
    cloud_6: '/assets/kenney_background-elements/PNG/cloud6.png',
    cloud_7: '/assets/kenney_background-elements/PNG/cloud7.png',
    cloud_8: '/assets/kenney_background-elements/PNG/cloud8.png',
    cloud_9: '/assets/kenney_background-elements/PNG/cloud9.png',
    receiving_attacking:
      '/assets/kenney_board-game-icons/PNG/Default (64px)/shield.png',
    attacking: '/assets/kenney_board-game-icons/PNG/Default (64px)/sword.png',
    planning_1:
      '/assets/kenney_board-game-icons/PNG/Default (64px)/hourglass_top.png',
    planning_2:
      '/assets/kenney_board-game-icons/PNG/Default (64px)/hourglass.png',
    planning_3:
      '/assets/kenney_board-game-icons/PNG/Default (64px)/hourglass_bottom.png',
  },
  spritesheets: {
    explosion: {
      path: '/assets/explosion.png',
      frameConfig: { frameWidth: 82, frameHeight: 72 },
    },
    fire: {
      path: '/assets/Pixel Fire Pack/13/13.png',
      frameConfig: { frameWidth: 48, frameHeight: 48 },
    },
  },
  audio: {
    laser2: '/assets/kenney_space-shooter-redux/Bonus/sfx_laser2.ogg',
  },
}

function loadAssets(scene: Phaser.Scene) {
  scene.load.setCORS('anonymous')

  Object.entries(Assets.images).forEach(([key, path]) => {
    scene.load.image(key, path)
  })
  Object.entries(Assets.spritesheets).forEach(([key, { path, frameConfig }]) =>
    scene.load.spritesheet(key, path, frameConfig)
  )
  Object.entries(Assets.audio).forEach(([key, path]) =>
    scene.load.audio(key, path)
  )
}

export { Assets, loadAssets }
