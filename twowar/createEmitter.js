function createEmitter(obj) {
  obj.emitter = game.add.emitter(0, 0, 250);
  obj.emitter.x = obj.x;
  obj.emitter.y = obj.y + obj.height / 2;
  obj.emitter.makeParticles(['pink', 'cyan', 'blue']);
  obj.emitter.setXSpeed(-100, 100);
  obj.emitter.setYSpeed(100, 100);
  obj.emitter.setRotation(0, 0);
  obj.emitter.setAlpha(0.3, 0.8);
  obj.emitter.gravity = 200;
  obj.emitter.start(false, 5000, 100);
}