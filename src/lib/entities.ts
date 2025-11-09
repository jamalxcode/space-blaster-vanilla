// Game entities: Player, Invaders, Bullets, Shields, UFO

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

// Player cannon
export class Player {
  x: number;
  y: number;
  width: number = 32;
  height: number = 24;
  speed: number = 4;
  lives: number = 3;
  canShoot: boolean = true;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = canvasWidth / 2 - this.width / 2;
    this.y = canvasHeight - 60;
  }

  moveLeft(canvasWidth: number) {
    this.x = Math.max(20, this.x - this.speed);
  }

  moveRight(canvasWidth: number) {
    this.x = Math.min(canvasWidth - this.width - 20, this.x + this.speed);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#FFFFFF';
    // Base
    ctx.fillRect(this.x, this.y + 16, 32, 8);
    // Barrel
    ctx.fillRect(this.x + 12, this.y, 8, 16);
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}

// Bullet class for both player and invader shots
export class Bullet {
  x: number;
  y: number;
  width: number = 3;
  height: number = 12;
  speed: number;
  isPlayerBullet: boolean;

  constructor(x: number, y: number, isPlayerBullet: boolean = true) {
    this.x = x;
    this.y = y;
    this.isPlayerBullet = isPlayerBullet;
    this.speed = isPlayerBullet ? -6 : 3;
  }

  update() {
    this.y += this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.isPlayerBullet ? '#FFFFFF' : '#FF6B9D';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  isOffScreen(canvasHeight: number) {
    return this.y < 0 || this.y > canvasHeight;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}

// Invader types with pixel art patterns
export type InvaderType = 'small' | 'medium' | 'large';

export class Invader {
  x: number;
  y: number;
  type: InvaderType;
  width: number = 32;
  height: number = 24;
  isAlive: boolean = true;
  animFrame: number = 0;

  constructor(x: number, y: number, type: InvaderType) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  getColor(): string {
    switch (this.type) {
      case 'small': return '#66FF66'; // Green
      case 'medium': return '#00FFFF'; // Cyan
      case 'large': return '#FF6BD5'; // Magenta
    }
  }

  getPoints(): number {
    switch (this.type) {
      case 'small': return 30;
      case 'medium': return 20;
      case 'large': return 10;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isAlive) return;

    ctx.fillStyle = this.getColor();
    const offset = this.animFrame * 4;

    // Draw pixel art based on type
    if (this.type === 'small') {
      // Small squat invader
      ctx.fillRect(this.x + 8, this.y + 4, 16, 4);
      ctx.fillRect(this.x + 4 + offset % 8 - 4, this.y + 8, 8, 8);
      ctx.fillRect(this.x + 20 - offset % 8 + 4, this.y + 8, 8, 8);
      ctx.fillRect(this.x + 8, this.y + 16, 4, 4);
      ctx.fillRect(this.x + 20, this.y + 16, 4, 4);
    } else if (this.type === 'medium') {
      // Medium invader
      ctx.fillRect(this.x + 12, this.y, 8, 4);
      ctx.fillRect(this.x + 8, this.y + 4, 16, 8);
      ctx.fillRect(this.x + 4, this.y + 12, 24, 4);
      ctx.fillRect(this.x + offset % 12, this.y + 16, 8, 4);
      ctx.fillRect(this.x + 24 - offset % 12, this.y + 16, 8, 4);
    } else {
      // Large invader with antennae
      ctx.fillRect(this.x + 4, this.y, 4, 4);
      ctx.fillRect(this.x + 24, this.y, 4, 4);
      ctx.fillRect(this.x + 8, this.y + 4, 16, 4);
      ctx.fillRect(this.x + 4, this.y + 8, 24, 8);
      ctx.fillRect(this.x + 8, this.y + 16, 4, 4);
      ctx.fillRect(this.x + 20, this.y + 16, 4, 4);
    }
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}

// Shield block
export class ShieldBlock {
  x: number;
  y: number;
  size: number = 8;
  isAlive: boolean = true;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isAlive) return;
    ctx.fillStyle = '#66FF66';
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size
    };
  }
}

// Shield made of multiple blocks
export class Shield {
  blocks: ShieldBlock[] = [];

  constructor(x: number, y: number) {
    // Create shield pattern
    const pattern = [
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 0, 0, 0, 0, 1, 1],
    ];

    pattern.forEach((row, rowIndex) => {
      row.forEach((block, colIndex) => {
        if (block === 1) {
          this.blocks.push(new ShieldBlock(x + colIndex * 8, y + rowIndex * 8));
        }
      });
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.blocks.forEach(block => block.draw(ctx));
  }

  checkCollision(bullet: Bullet): boolean {
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      if (!block.isAlive) continue;

      const blockBounds = block.getBounds();
      const bulletBounds = bullet.getBounds();

      if (
        bulletBounds.x < blockBounds.x + blockBounds.width &&
        bulletBounds.x + bulletBounds.width > blockBounds.x &&
        bulletBounds.y < blockBounds.y + blockBounds.height &&
        bulletBounds.y + bulletBounds.height > blockBounds.y
      ) {
        block.isAlive = false;
        return true;
      }
    }
    return false;
  }
}

// Bonus UFO
export class UFO {
  x: number;
  y: number;
  width: number = 48;
  height: number = 20;
  speed: number = 2;
  isActive: boolean = false;
  direction: number = 1;

  constructor(canvasWidth: number) {
    this.x = -this.width;
    this.y = 40;
  }

  activate(canvasWidth: number) {
    this.isActive = true;
    this.direction = Math.random() > 0.5 ? 1 : -1;
    this.x = this.direction > 0 ? -this.width : canvasWidth;
  }

  update(canvasWidth: number) {
    if (!this.isActive) return;

    this.x += this.speed * this.direction;

    if (this.x > canvasWidth + this.width || this.x < -this.width) {
      this.isActive = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isActive) return;

    ctx.fillStyle = '#FFD700';
    // UFO body
    ctx.fillRect(this.x + 8, this.y + 8, 32, 4);
    ctx.fillRect(this.x + 4, this.y + 12, 40, 4);
    ctx.fillRect(this.x + 16, this.y + 4, 16, 4);
    // Windows
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(this.x + 12, this.y + 12, 4, 4);
    ctx.fillRect(this.x + 20, this.y + 12, 4, 4);
    ctx.fillRect(this.x + 28, this.y + 12, 4, 4);
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  getPoints(): number {
    return 100 + Math.floor(Math.random() * 201); // 100-300 points
  }
}
