// 自定义粒子
FlameParticle = function (game, x, y) {
  // 定义纹理
  Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('flameParticle'));
};
// 继承自Phaser.Particle
FlameParticle.prototype = Object.create(Phaser.Particle.prototype);
FlameParticle.prototype.constructor = FlameParticle;
