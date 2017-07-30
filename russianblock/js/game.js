//var game = new Phaser.Game(640, 480, Phaser.AUTO, '', {preload: preload, create: create, update: update});
var game = new Phaser.Game(640, 480, Phaser.AUTO, 'gameDiv');

//Global Variables
var BLOCK_SIDE = 23;
//var BLOCO_SPRITE_SCALE = BLOCK_SIDE / 32;
var MAX_BLOCK_COUNT_HORIZONTAL = 10;
var MAX_BLOCK_COUNT_VERTICAL = 20;
var MAX_INDEX_HORIZONTAL = 9;
var MAX_INDEX_VERTICAL = 19;
var DISPLAY_OFFSET_VERTICAL = 10;
var DISPLAY_OFFSET_HORIZONTAL = 205;
var NEXT_WINDOW_OFFSET_VERTICAL = 56;
var NEXT_WINDOW_OFFSET_HORIZONTAL = 504;
var HOLD_WINDOW_OFFSET_VERTICAL = 58;
var HOLD_WINDOW_OFFSET_HORIZONTAL = 66;

var tetraminos;
var blocos = [];

var board;

var boardDisplay;
var nextWindow;

var holdWindow;
var blocosColors = ["T", "L", "J", "O", "I", "Z", "S"];

var curX = 4;
var curY = 0;
var lastX = 0;
var lastY = 0;
var curPose = 0;
var piece;
var holdPiece;
var nextPiece = [-1, -1, -1];
var pieceQueue = [];
var pieceIndex;
var lastPieceIndex = 0;
var nextPieceIndex = [-1, -1, -1];
var holdPieceIndex;
var rotateLock = false;
var movementLock = false;
var movementDelayLock = false;
var movementIntervalDelay = 0.15;
var movementInterval = 0.05;
var tickInterval = 500;
var tickIntervalsoftDrop = 50;
var hAxis = 0;
var bgsNames;
var curBg = 3;
var bgs = [];
var timer = null;
var ticktimer = null;
var lineCount = 0;
var speedUpGoal = 10;
var linesToClear = [];
var lineClearX = 0;
var lineClearInterval = 50;
var lineClearTimer;
var lastSecondTimer;
var ghostY = 0;
var level = 1;
var curScore = 0;
var lineClearPts = [100, 300, 500, 800] // single, double, triple, tetris
var softDropPts = 1;
var hardDropPts = 2;
var tSpinPts = [800, 1200, 1600] //single, double, triple(but how?)
var comboIncrement = 50;
var curCombo = 0;
var labelArt;
var labelLines;
var labelScore;
var labelLevel;
var bg;
var fxPiecePlaced = null;
var fxLineClear = null;
var fxTetris = null;
var fxCombo = null;
var fxMove = null;
var fxRotate = null;
var fxHold = null;
var music = null;
var trackNames = [];
var userKeys;
var countDownCount;
var countDownTimer;
var countDownTweens;
var countDownText;
var countDownButton;
var countDownButtonLabel;
var multiplierFeedbackText;
var tSpinText;
var levelUpEmitter;

//controls popup variables
var actionTexts;
var keysButtons;
var keysLabels;
var actionLabels;
var popupPanel;
var popupText;
var isPopupShown;
var waitingKeyPress;
var keyModified;
var tmpUserKeys;


var gameover;
var softDrop;
var hardDrop;
var hardDropped;
var hardDropLock;
var cleaningLines;
var waitingLineClear;
var holdLock;
var lastValidMoveWasASpin;
var lastSecondActive;
var lastSecondAdjustmentsActive;
var floorKicked;
var preGameCountDown;
var nowPlaying;

var breadCrumbs = [];

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('play', playState);
game.state.add('singlePlayerPrep', singlePlayerPrepState);
game.state.add('menu', menuState);
game.state.add('settings', settingsState);
game.state.add('changeBgSt', changeBgState);
game.state.add('credits', creditsState);
game.state.add('controls', controlsState);
game.state.add('soundMenu', soundMenuState);
game.state.add('leaderboard', leaderboardState);
game.state.add('gameover', gameoverState);
game.state.add('singlePlayerPaused', singlePlayerPausedState);

game.state.start('boot');
