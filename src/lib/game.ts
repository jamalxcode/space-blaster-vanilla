// Main game logic for Space Invaders

import { Player, Invader, Bullet, Shield, UFO, InvaderType } from './entities';
import { AudioManager } from './audio';

export type GameState = 'start' | 'playing' | 'gameOver';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private invaders: Invader[] = [];
  private bullets: Bullet[] = [];
  private shields: Shield[] = [];
  private ufo: UFO;
  private audio: AudioManager;
  
  private state: GameState = 'start';
  private score: number = 0;
  private wave: number = 1;
  private invaderDirection: number = 1;
  private invaderSpeed: number = 0.5;
  private invaderMoveDown: boolean = false;
  private lastInvaderShot: number = 0;
  private lastUfoSpawn: number = 0;
  private animationFrame: number = 0;
  private lastStepSound: number = 0;
  
  private keys: { [key: string]: boolean } = {};

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.player = new Player(canvas.width, canvas.height);
    this.ufo = new UFO(canvas.width);
    this.audio = new AudioManager();
    
    this.setupEventListeners();
    this.createShields();
  }

  private setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      
      if (e.key === 'Enter') {
        if (this.state === 'start' || this.state === 'gameOver') {
          this.reset();
        }
      }
      
      if (e.key === ' ' && this.state === 'playing') {
        e.preventDefault();
        this.playerShoot();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  private reset() {
    this.state = 'playing';
    this.score = 0;
    this.wave = 1;
    this.player = new Player(this.canvas.width, this.canvas.height);
    this.bullets = [];
    this.invaders = [];
    this.invaderSpeed = 0.5;
    this.createWave();
    this.createShields();
    this.ufo.isActive = false;
    this.audio.stopUfoSound();
  }

  private createWave() {
    this.invaders = [];
    const startX = 60;
    const startY = 80;
    const spacingX = 48;
    const spacingY = 40;
    const cols = 11;

    // Top row - small invaders
    for (let col = 0; col < cols; col++) {
      this.invaders.push(new Invader(startX + col * spacingX, startY, 'small'));
    }

    // Middle rows - medium invaders
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < cols; col++) {
        this.invaders.push(new Invader(startX + col * spacingX, startY + (row + 1) * spacingY, 'medium'));
      }
    }

    // Bottom rows - large invaders
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < cols; col++) {
        this.invaders.push(new Invader(startX + col * spacingX, startY + (row + 3) * spacingY, 'large'));
      }
    }

    this.invaderSpeed = 0.5 + (this.wave - 1) * 0.2;
  }

  private createShields() {
    this.shields = [];
    const shieldY = this.canvas.height - 150;
    const spacing = this.canvas.width / 5;
    
    for (let i = 0; i < 4; i++) {
      this.shields.push(new Shield(spacing * (i + 1) - 32, shieldY));
    }
  }

  private playerShoot() {
    if (!this.player.canShoot) return;
    
    const playerBullets = this.bullets.filter(b => b.isPlayerBullet);
    if (playerBullets.length >= 1) return;
    
    this.bullets.push(new Bullet(
      this.player.x + this.player.width / 2,
      this.player.y,
      true
    ));
    
    this.audio.playPlayerShoot();
  }

  private invaderShoot() {
    const now = Date.now();
    if (now - this.lastInvaderShot < 1000) return;

    // Find bottom invaders in each column
    const aliveInvaders = this.invaders.filter(inv => inv.isAlive);
    if (aliveInvaders.length === 0) return;

    const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
    this.bullets.push(new Bullet(
      shooter.x + shooter.width / 2,
      shooter.y + shooter.height,
      false
    ));

    this.lastInvaderShot = now;
  }

  private updateInvaders() {
    let changeDirection = false;
    const aliveInvaders = this.invaders.filter(inv => inv.isAlive);

    aliveInvaders.forEach(invader => {
      invader.x += this.invaderSpeed * this.invaderDirection;
      
      if (invader.x <= 20 || invader.x >= this.canvas.width - invader.width - 20) {
        changeDirection = true;
      }
    });

    if (changeDirection) {
      this.invaderDirection *= -1;
      aliveInvaders.forEach(invader => {
        invader.y += 20;
        
        // Check if invaders reached player zone
        if (invader.y + invader.height >= this.player.y) {
          this.gameOver();
        }
      });
    }

    // Animation frame for invaders
    this.animationFrame++;
    if (this.animationFrame % 30 === 0) {
      aliveInvaders.forEach(invader => {
        invader.animFrame = (invader.animFrame + 1) % 2;
      });
      
      // Play step sound
      const now = Date.now();
      if (now - this.lastStepSound > 500 / (1 + this.wave * 0.1)) {
        this.audio.playInvaderStep(1 + aliveInvaders.length / 50);
        this.lastStepSound = now;
      }
    }

    // Random shooting
    if (Math.random() < 0.02) {
      this.invaderShoot();
    }

    // Check if all invaders destroyed
    if (aliveInvaders.length === 0) {
      this.nextWave();
    }
  }

  private updateBullets() {
    this.bullets = this.bullets.filter(bullet => {
      bullet.update();
      return !bullet.isOffScreen(this.canvas.height);
    });
  }

  private updateUFO() {
    const now = Date.now();
    
    if (!this.ufo.isActive && now - this.lastUfoSpawn > 15000 && Math.random() < 0.001) {
      this.ufo.activate(this.canvas.width);
      this.audio.startUfoSound();
      this.lastUfoSpawn = now;
    }

    if (this.ufo.isActive) {
      this.ufo.update(this.canvas.width);
      if (!this.ufo.isActive) {
        this.audio.stopUfoSound();
      }
    }
  }

  private checkCollisions() {
    // Player bullets vs invaders
    this.bullets.forEach((bullet, bulletIndex) => {
      if (!bullet.isPlayerBullet) return;

      this.invaders.forEach(invader => {
        if (!invader.isAlive) return;

        const bulletBounds = bullet.getBounds();
        const invaderBounds = invader.getBounds();

        if (this.checkBoundsCollision(bulletBounds, invaderBounds)) {
          invader.isAlive = false;
          this.bullets.splice(bulletIndex, 1);
          this.score += invader.getPoints();
          this.audio.playInvaderHit();
        }
      });

      // Player bullet vs UFO
      if (this.ufo.isActive) {
        const bulletBounds = bullet.getBounds();
        const ufoBounds = this.ufo.getBounds();

        if (this.checkBoundsCollision(bulletBounds, ufoBounds)) {
          this.ufo.isActive = false;
          this.bullets.splice(bulletIndex, 1);
          this.score += this.ufo.getPoints();
          this.audio.playUfoHit();
        }
      }
    });

    // Enemy bullets vs player
    this.bullets.forEach((bullet, bulletIndex) => {
      if (bullet.isPlayerBullet) return;

      const bulletBounds = bullet.getBounds();
      const playerBounds = this.player.getBounds();

      if (this.checkBoundsCollision(bulletBounds, playerBounds)) {
        this.bullets.splice(bulletIndex, 1);
        this.player.lives--;
        this.audio.playPlayerHit();

        if (this.player.lives <= 0) {
          this.gameOver();
        }
      }
    });

    // Bullets vs shields
    this.bullets.forEach((bullet, bulletIndex) => {
      this.shields.forEach(shield => {
        if (shield.checkCollision(bullet)) {
          this.bullets.splice(bulletIndex, 1);
        }
      });
    });
  }

  private checkBoundsCollision(a: any, b: any): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  private nextWave() {
    this.wave++;
    this.createWave();
    this.bullets = [];
  }

  private gameOver() {
    this.state = 'gameOver';
    this.audio.stopUfoSound();
    this.audio.playGameOver();
  }

  private drawStarfield() {
    this.ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 50; i++) {
      const x = (i * 97 % this.canvas.width);
      const y = (i * 131 % this.canvas.height);
      const size = (i % 3) * 0.5 + 0.5;
      this.ctx.fillRect(x, y, size, size);
    }
  }

  private drawUI() {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '20px "Courier New", monospace';
    
    // Score
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`SCORE: ${this.score.toString().padStart(6, '0')}`, 20, 30);
    
    // Wave
    this.ctx.fillText(`WAVE: ${this.wave}`, this.canvas.width / 2 - 50, 30);
    
    // Lives
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`LIVES: ${this.player.lives}`, this.canvas.width - 20, 30);
  }

  private drawStartScreen() {
    this.ctx.fillStyle = '#66FF66';
    this.ctx.font = 'bold 48px "Courier New", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('SPACE INVADERS', this.canvas.width / 2, this.canvas.height / 2 - 40);
    
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '24px "Courier New", monospace';
    this.ctx.fillText('PRESS ENTER TO START', this.canvas.width / 2, this.canvas.height / 2 + 20);
    
    this.ctx.font = '16px "Courier New", monospace';
    this.ctx.fillText('ARROW KEYS OR A/D TO MOVE', this.canvas.width / 2, this.canvas.height / 2 + 60);
    this.ctx.fillText('SPACEBAR TO SHOOT', this.canvas.width / 2, this.canvas.height / 2 + 85);
  }

  private drawGameOverScreen() {
    this.ctx.fillStyle = '#FF0000';
    this.ctx.font = 'bold 48px "Courier New", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 40);
    
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '24px "Courier New", monospace';
    this.ctx.fillText(`FINAL SCORE: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
    this.ctx.fillText('PRESS ENTER TO PLAY AGAIN', this.canvas.width / 2, this.canvas.height / 2 + 60);
  }

  update() {
    if (this.state === 'playing') {
      // Player movement
      if (this.keys['arrowleft'] || this.keys['a']) {
        this.player.moveLeft(this.canvas.width);
      }
      if (this.keys['arrowright'] || this.keys['d']) {
        this.player.moveRight(this.canvas.width);
      }

      this.updateInvaders();
      this.updateBullets();
      this.updateUFO();
      this.checkCollisions();
    }
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = '#0A0A1A';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw starfield
    this.drawStarfield();

    if (this.state === 'start') {
      this.drawStartScreen();
    } else if (this.state === 'gameOver') {
      this.drawGameOverScreen();
    } else {
      // Draw game entities
      this.shields.forEach(shield => shield.draw(this.ctx));
      this.invaders.forEach(invader => invader.draw(this.ctx));
      this.bullets.forEach(bullet => bullet.draw(this.ctx));
      this.player.draw(this.ctx);
      this.ufo.draw(this.ctx);
      this.drawUI();
    }
  }

  getAudioManager() {
    return this.audio;
  }

  getState() {
    return this.state;
  }
}
