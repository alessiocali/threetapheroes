class Hero {
    constructor(sprite_ref, x, y, attack_ref, attack_button_ref, slime_frames) {
        this.sprite = game.add.sprite(sprite_ref, x, y);
        this.sprite.animations.add('idle', [0], 0);
        this.sprite.animations.add('attack', [1, 2, 3, 4, 0], 12);
        this.sprite.animations.play('idle');
        this.attack_ref = attack_ref;
        this.cooldown = false;
        this.x = this.sprite.x;
        this.y = this.sprite.y;
        this.button = game.add.button(this.x - 35, this.y + 160, attack_button_ref, this.attack, this,
                               0, 0, 1, 0);
        this.button.scale.setTo(2, 2);
        this.slime_frames = slime_frames;
    }
    
    attack() {
        if (this.cooldown) return;
    
        this.sprite.animations.play('attack');
        var proj = projs.create(this.sprite.x, this.sprite.y - 10, this.attack_ref);
        proj.body.velocity.y = PROJ_SPEED;
        this.cooldown = true;
        game.time.events.add(COOLDOWN_TIME, function(){this.cooldown = false;}, this)
    }
}

const COOLDOWN_TIME = 500;
const PROJ_SPEED = -1000;

var game = new Phaser.Game(720, 1280, Phaser.AUTO, 'gamediv', { preload: preload, create: create, update: update });
var sword_btn;
var limit;
var heroes;
var projs;
var enemy_grp;
var enemies = [];
var score = 0;
var score_text;
var default_speed = 100;
var sprint_speed = 300;

var spawn_interval = 5000; //ms
var spawning = false;

function preload() {
    game.load.image('background', 'assets/map.png');
    game.load.bitmapFont('heartbit', 'assets/heartbit_0.png', 'assets/heartbit.fnt');
    game.load.spritesheet('knight', 'assets/knight-64.png', 64, 104);
    game.load.spritesheet('mage', 'assets/mage-64.png', 64, 108);
    game.load.spritesheet('ranger', 'assets/ranger-64.png', 64, 108);
    game.load.image('fireball', 'assets/fireball.png');
    game.load.image('sword_wave', 'assets/sword_wave.png');
    game.load.image('arrow', 'assets/arrow.png');
    game.load.spritesheet('slimes', 'assets/slimes.png', 18, 16, 9);
    game.load.spritesheet('book_btn', 'assets/book_btn.png', 64, 64);
    game.load.spritesheet('sword_btn', 'assets/sword_btn.png', 64, 64);
    game.load.spritesheet('bow_btn', 'assets/bow_btn.png', 64, 64);    
}

function create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.stage.backgroundColor = 'rgb(50, 50, 50)';
    
    var background = game.add.sprite(game.width / 2, 0, 'background');
    limit = background.height * 0.8;
    background.x -= background.width / 2;
    
    score_text = game.add.bitmapText(game.width * 0.80, game.height * 0.85, "heartbit", "Score: " + score);
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    var mage = new Hero(game.width / 2 - 205, game.height / 2 + 325, 'mage', 'fireball', 'book_btn', [6, 7, 8]);
    var knight = new Hero(game.width / 2 - 35, game.height / 2 + 325, 'knight', 'sword_wave', 'sword_btn', [0, 1, 2]);
    var ranger = new Hero(game.width / 2 + 145, game.height / 2 + 325, 'ranger', 'arrow', 'bow_btn', [3, 4, 5]);
    
    heroes = [mage, knight, ranger];
    
    projs = game.add.group();
    projs.enableBody = true;
    projs.setAll('checkWorldBounds', true);
    projs.setAll('outOfBoundsKill', true);
    
    enemy_grp = game.add.group();
    enemy_grp.enableBody = true;
}

function update() {
    game.physics.arcade.overlap(enemy_grp, projs, defeat, null, this);
    
    if (!spawning) {
        game.time.events.add(spawn_interval, spawn, this, heroes[Math.floor(Math.random() * heroes.length)]);
        spawning = true;
    }
    
    if (enemies.length != 0) {
        var frontmost = enemies[0];
        
        if (frontmost.y > limit) {
            frontmost.destroy();
            enemies.shift();
        }
    }
}

function spawn(hero) {
    var slime = enemy_grp.create(hero.x, -10, 'slimes');
    slime.scale.set(3.5, 3.5);
    slime.animations.add('idle', hero.slime_frames, 9, true);
    slime.animations.play('idle');
    slime.body.velocity.y = default_speed;
    spawning = false;
    enemies.push(slime);
}

function defeat(enemy, projectile) {
    projectile.destroy();
    
    if (enemy == enemies[0]) {
        score += 10;
        score_text.setText("Score: " + score);
        console.log("Score is now: " + score);
        enemy.destroy();
        enemies.shift();
    } else {
        enemy_grp.forEachExists(function(enemy) {
            enemy.body.velocity.y = sprint_speed;
        }, this);
        game.time.events.add(500, function() {
            enemy_grp.forEachExists(function(enemy) {
                enemy.body.velocity.y = default_speed;
            }, this);
        }, this);
    }
   
}