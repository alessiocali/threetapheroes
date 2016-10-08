var game = new Phaser.Game(720, 1280, Phaser.AUTO, 'gamediv', { preload: preload, create: create, update: update });
var sword_btn;
var knight;
var projs;
var enemy_grp;
var enemies = [];

var spawn_interval = 5000; //ms
var spawning = true;

function preload() {
    game.load.image('background', 'assets/map.png');
    game.load.spritesheet('knight', 'assets/knight-64.png', 64, 104);
    game.load.image('sword_wave', 'assets/sword_wave.png');
    game.load.spritesheet('slimes', 'assets/slimes.png', 16, 16);
    game.load.spritesheet('sword_btn', 'assets/sword_btn.png', 64, 64);
}

function create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    var background = game.add.sprite(game.width / 2, 0, 'background');
    background.x -= background.width / 2;
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    knight = game.add.sprite(game.width / 2 - 35, game.height / 2 + 325, 'knight');
    knight.animations.add('idle', [0], 0);
    knight.animations.add('attack', [1, 2, 3, 4, 0], 12);
    knight.animations.play('idle');
    knight.cooldown = false;
    
    sword_btn = game.add.button(game.width / 2 - 70, game.height / 2 + 485, 'sword_btn', attackSword, this,
                               0, 0, 1, 0);
    sword_btn.scale.setTo(2, 2);
    
    projs = game.add.group();
    projs.enableBody = true;
    projs.setAll('checkWorldBounds', true);
    projs.setAll('outOfBoundsKill', true);
    
    enemy_grp = game.add.group();
}

function update() {
    if (!spawning) {
        setTimeout(spawn, spawn_interval);
        spawning = true;
    }
}

function attackSword() {
    if (knight.cooldown) return;
    
    knight.animations.play('attack');
    var wave = projs.create(knight.x, knight.y - 10, 'sword_wave');
    wave.body.velocity.y = -1000;
    knight.cooldown = true;
    setTimeout(function(){knight.cooldown = false;}, 500)
}

function spawn() {
    var slime = game.add.sprite(knight.x, -10, 'slimes');
    slime.animations.add('idle', [0, 1, 2]);
}