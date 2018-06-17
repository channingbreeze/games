function checkOverlap(spriteA, spriteB) {
  // 获取边界
  var boundsA = spriteA.getBounds();
  var boundsB = spriteB.getBounds();
  // 检测是否相交
  return Phaser.Rectangle.intersects(boundsA, boundsB);
}