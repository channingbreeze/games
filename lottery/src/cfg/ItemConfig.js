
/**
* 全局变量
*/

// 定义对应关系
var YINSHAYU = 0;  // 银鲨鱼
var JINSHAYU = 1;  // 金鲨鱼
var KONGQUE = 2;  // 孔雀
var LAOYING = 3;  // 老鹰
var SHIZI = 4;  // 狮子
var XIONGMAO = 5;  // 熊猫
var GEZI = 6;  // 鸽子
var YANZI = 7;  // 燕子
var TUZI = 8;  // 兔子
var HOUZI = 9;  // 猴子

// item元信息
var ITEMRAW = {
  YINSHAYU: {
    texture: 'choices',
    frame: YINSHAYU,
    type: 'YINSHAYU',
    runAnim: 'runYinshayu',
    bigAnim: ['bigYinshayu', 'bigShayubg'],
    sound: 'sound-yinshayu'
  },
  JINSHAYU: {
    texture: 'choices',
    frame: JINSHAYU,
    type: 'JINSHAYU',
    runAnim: 'runJinshayu',
    bigAnim: ['bigJinshayu', 'bigShayubg'],
    sound: 'sound-jinshayu'
  },
  KONGQUE: {
    texture: 'choices',
    frame: KONGQUE,
    type: 'KONGQUE',
    runAnim: 'runKongque',
    bigAnim: ['bigKongque'],
    sound: 'sound-kongque'
  },
  LAOYING: {
    texture: 'choices',
    frame: LAOYING,
    type: 'LAOYING',
    runAnim: 'runLaoying',
    bigAnim: ['bigLaoying'],
    sound: 'sound-laoying'
  },
  SHIZI: {
    texture: 'choices',
    frame: SHIZI,
    type: 'SHIZI',
    runAnim: 'runShizi',
    bigAnim: ['bigShizi'],
    sound: 'sound-shizi'
  },
  XIONGMAO: {
    texture: 'choices',
    frame: XIONGMAO,
    type: 'XIONGMAO',
    runAnim: 'runXiongmao',
    bigAnim: ['bigXiongmao'],
    sound: 'sound-xiongmao'
  },
  GEZI: {
    texture: 'choices',
    frame: GEZI,
    type: 'GEZI',
    runAnim: 'runGezi',
    bigAnim: ['bigGezi'],
    sound: 'sound-gezi'
  },
  YANZI: {
    texture: 'choices',
    frame: YANZI,
    type: 'YANZI',
    runAnim: 'runYanzi',
    bigAnim: ['bigYanzi'],
    sound: 'sound-yanzi'
  },
  TUZI: {
    texture: 'choices',
    frame: TUZI,
    type: 'TUZI',
    runAnim: 'runTuzi',
    bigAnim: ['bigTuzi'],
    sound: 'sound-tuzi'
  },
  HOUZI: {
    texture: 'choices',
    frame: HOUZI,
    type: 'HOUZI',
    runAnim: 'runHouzi',
    bigAnim: ['bigHouzi'],
    sound: 'sound-houzi'
  }
}

// history item元信息
var HISTORYRAW = {
  YINSHAYU: {
    texture: 'items',
    frame: YINSHAYU,
    type: 'YINSHAYU',
    runAnim: 'runYinshayu',
    bigAnim: ['bigYinshayu', 'bigShayubg'],
    sound: 'sound-yinshayu'
  },
  JINSHAYU: {
    texture: 'items',
    frame: JINSHAYU,
    type: 'JINSHAYU',
    runAnim: 'runJinshayu',
    bigAnim: ['bigJinshayu', 'bigShayubg'],
    sound: 'sound-jinshayu'
  },
  KONGQUE: {
    texture: 'items',
    frame: KONGQUE,
    type: 'KONGQUE',
    runAnim: 'runKongque',
    bigAnim: ['bigKongque'],
    sound: 'sound-kongque'
  },
  LAOYING: {
    texture: 'items',
    frame: LAOYING,
    type: 'LAOYING',
    runAnim: 'runLaoying',
    bigAnim: ['bigLaoying'],
    sound: 'sound-laoying'
  },
  SHIZI: {
    texture: 'items',
    frame: SHIZI,
    type: 'SHIZI',
    runAnim: 'runShizi',
    bigAnim: ['bigShizi'],
    sound: 'sound-shizi'
  },
  XIONGMAO: {
    texture: 'items',
    frame: XIONGMAO,
    type: 'XIONGMAO',
    runAnim: 'runXiongmao',
    bigAnim: ['bigXiongmao'],
    sound: 'sound-xiongmao'
  },
  GEZI: {
    texture: 'items',
    frame: GEZI,
    type: 'GEZI',
    runAnim: 'runGezi',
    bigAnim: ['bigGezi'],
    sound: 'sound-gezi'
  },
  YANZI: {
    texture: 'items',
    frame: YANZI,
    type: 'YANZI',
    runAnim: 'runYanzi',
    bigAnim: ['bigYanzi'],
    sound: 'sound-yanzi'
  },
  TUZI: {
    texture: 'items',
    frame: TUZI,
    type: 'TUZI',
    runAnim: 'runTuzi',
    bigAnim: ['bigTuzi'],
    sound: 'sound-tuzi'
  },
  HOUZI: {
    texture: 'items',
    frame: HOUZI,
    type: 'HOUZI',
    runAnim: 'runHouzi',
    bigAnim: ['bigHouzi'],
    sound: 'sound-houzi'
  }
}

// 每个item的信息
var ITEMS = [{
  type: 'YINSHAYU',
  position: {
    x: 1,
    y: 1
  },
}, {
  type: 'LAOYING',
  position: {
    x: 2,
    y: 1
  },
}, {
  type: 'LAOYING',
  position: {
    x: 3,
    y: 1
  },
}, {
  type: 'LAOYING',
  position: {
    x: 4,
    y: 1
  }
}, {
  type: 'JINSHAYU',
  position: {
    x: 5,
    y: 1
  }
}, {
  type: 'SHIZI',
  position: {
    x: 6,
    y: 1
  }
}, {
  type: 'SHIZI',
  position: {
    x: 7,
    y: 1
  }
}, {
  type: 'SHIZI',
  position: {
    x: 8,
    y: 1
  }
}, {
  type: 'YINSHAYU',
  position: {
    x: 9,
    y: 1
  }
}, {
  type: 'XIONGMAO',
  position: {
    x: 9,
    y: 2
  }
}, {
  type: 'XIONGMAO',
  position: {
    x: 9,
    y: 3
  }
}, {
  type: 'JINSHAYU',
  position: {
    x: 9,
    y: 4
  }
}, {
  type: 'HOUZI',
  position: {
    x: 9,
    y: 5
  }
}, {
  type: 'HOUZI',
  position: {
    x: 9,
    y: 6
  }
}, {
  type: 'YINSHAYU',
  position: {
    x: 9,
    y: 7
  }
}, {
  type: 'TUZI',
  position: {
    x: 8,
    y: 7
  }
}, {
  type: 'TUZI',
  position: {
    x: 7,
    y: 7
  }
}, {
  type: 'TUZI',
  position: {
    x: 6,
    y: 7
  }
}, {
  type: 'JINSHAYU',
  position: {
    x: 5,
    y: 7
  }
}, {
  type: 'YANZI',
  position: {
    x: 4,
    y: 7
  }
}, {
  type: 'YANZI',
  position: {
    x: 3,
    y: 7
  }
}, {
  type: 'YANZI',
  position: {
    x: 2,
    y: 7
  }
}, {
  type: 'YINSHAYU',
  position: {
    x: 1,
    y: 7
  }
}, {
  type: 'GEZI',
  position: {
    x: 1,
    y: 6
  }
}, {
  type: 'GEZI',
  position: {
    x: 1,
    y: 5
  }
}, {
  type: 'JINSHAYU',
  position: {
    x: 1,
    y: 4
  }
}, {
  type: 'KONGQUE',
  position: {
    x: 1,
    y: 3
  }
}, {
  type: 'KONGQUE',
  position: {
    x: 1,
    y: 2
  }
}];

