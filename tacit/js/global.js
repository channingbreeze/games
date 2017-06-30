
var WIDTH = 1920;
var HEIGHT = 1080;

var TIME_RATIO = 5;   // 时间比，此数越大，时间越多
var TOTAL_BLOOD = 60*TIME_RATIO;  // 总血量
var LEVEL_TIME_RATIO = 8*TIME_RATIO;  // 每局时间

// 每一个index对应的图片
var MissionMap = {
  0: 'missonicon_black',
  1: 'missonicon_blue',
  2: 'missonicon_red',
  3: 'missonicon_green',
  4: 'missonicon_yellow',
}

// 粒子发射颜色
var EmitterMap = {
  0: 0x001322,
  1: 0x19B9FF,
  2: 0xFF7537,
  3: 0xB3FB48,
  4: 0xFFED60,
  5: 0xEDEBDA
}
