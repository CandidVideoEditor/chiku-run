import { VIDEOS, type SpriteBank, type SpriteKey } from "./assets";
import { VideoSprite } from "./videoSprite";

export type PowerKind = "shield" | "x3" | "slow" | "life" | "super";

export interface GameStatus {
  score: number;
  coins: number;
  lives: number;
  distance: number;
  combo: number;
  shield: number;
  x3: number;
  slow: number;
  super: number;
  best: number;
}

interface Entity {
  kind: "obstacle" | "enemy" | "coin" | "power";
  sprite: SpriteKey;
  x: number;
  y: number;
  w: number;
  h: number;
  baseY: number;
  bob: number;
  phase: number;
  value: number;
  power?: PowerKind;
  dead?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  hue: number;
}

interface FloatText {
  x: number;
  y: number;
  life: number;
  text: string;
  gold: boolean;
}

interface Decor {
  sprite: SpriteKey;
  x: number;
  y: number;
  w: number;
  depth: number;
  phase: number;
}

const GROUND_ENEMIES: SpriteKey[] = [
  "e_cactus",
  "e_rock",
  "e_spike",
  "e_mushroom",
  "e_log",
  "e_snail",
  "e_plant",
];
const FLYING_ENEMIES: SpriteKey[] = ["e_bat", "e_bee", "e_crow", "e_ghost"];
const OBSTACLES: SpriteKey[] = [
  "o_stump",
  "o_rocks",
  "o_post",
  "o_bush",
  "o_crate",
  "o_spikeball",
  "o_cone",
  "o_hole",
  "o_vine",
];
const COINS: SpriteKey[] = ["coin_paw", "coin_chiku", "coin_heart"];

const pick = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)]!;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

const BEST_KEY = "run-chiku-run:best";

export class ChikuGame {
  private ctx: CanvasRenderingContext2D;
  private raf = 0;
  private last = 0;
  private w = 960;
  private h = 540;
  private dpr = 1;

  private entities: Entity[] = [];
  private particles: Particle[] = [];
  private texts: FloatText[] = [];
  private decor: Decor[] = [];

  private speed = 430;
  private travelled = 0;
  private spawnGap = 520;
  private sinceSpawn = 0;
  private coinRun = 0;

  private score = 0;
  private coins = 0;
  private lives = 3;
  private combo = 1;
  private best = 0;

  private timers: Record<"shield" | "x3" | "slow" | "super", number> = {
    shield: 0,
    x3: 0,
    slow: 0,
    super: 0,
  };
  private invuln = 0;

  private playerY = 0;
  private vy = 0;
  private jumps = 0;
  private sliding = false;
  private slideTime = 0;
  private groundedTime = 0;

  private runner: VideoSprite;
  private jumper: VideoSprite;
  private hero: VideoSprite;

  private running = false;
  private paused = false;
  private over = false;
  private shakeTime = 0;
  private flashTime = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private sprites: SpriteBank,
    private onStatus: (s: GameStatus) => void,
    private onGameOver: (s: GameStatus) => void,
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.runner = new VideoSprite(VIDEOS.run, 288);
    this.jumper = new VideoSprite(VIDEOS.jump, 288);
    this.hero = new VideoSprite(VIDEOS.super, 320);
    this.runner.setRate(1.45);
    this.jumper.setRate(1.1);
    this.hero.setRate(1.15);
    if (typeof localStorage !== "undefined") {
      this.best = Number(localStorage.getItem(BEST_KEY) ?? 0);
    }
    this.resize();
  }

  /* ---------------------------------------------------------------- layout */

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = Math.max(320, rect.width);
    this.h = Math.max(240, rect.height);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (this.decor.length === 0) this.seedDecor();
  }

  private get groundY() {
    return this.h * 0.84;
  }

  private get playerH() {
    return Math.min(190, Math.max(110, this.h * 0.3));
  }

  private get playerX() {
    return this.w * 0.17;
  }

  private playerBox() {
    const h = this.playerH * (this.sliding ? 0.55 : 1);
    const w = h * 0.78;
    const y = this.groundY - h - this.playerY;
    return { x: this.playerX - w / 2, y, w, h };
  }

  /* ----------------------------------------------------------------- decor */

  private seedDecor() {
    this.decor = [];
    const add = (sprite: SpriteKey, count: number, yA: number, yB: number, w: number, depth: number) => {
      for (let i = 0; i < count; i++) {
        this.decor.push({
          sprite,
          x: rand(0, this.w * 2),
          y: rand(yA, yB) * this.h,
          w,
          depth,
          phase: rand(0, Math.PI * 2),
        });
      }
    };
    add("d_sun", 1, 0.04, 0.08, 130, 0.05);
    add("d_cloud1", 3, 0.06, 0.28, 160, 0.12);
    add("d_cloud2", 2, 0.05, 0.24, 220, 0.16);
    add("d_rainbow", 1, 0.1, 0.2, 300, 0.2);
    add("d_butterfly1", 2, 0.3, 0.6, 70, 0.45);
    add("d_butterfly2", 3, 0.25, 0.62, 48, 0.55);
    add("d_wind", 3, 0.35, 0.7, 200, 0.75);
  }

  /* ----------------------------------------------------------- game control */

  start() {
    this.entities = [];
    this.particles = [];
    this.texts = [];
    this.speed = 430;
    this.travelled = 0;
    this.sinceSpawn = 0;
    this.spawnGap = 520;
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.combo = 1;
    this.coinRun = 0;
    this.timers = { shield: 0, x3: 0, slow: 0, super: 0 };
    this.invuln = 0;
    this.playerY = 0;
    this.vy = 0;
    this.jumps = 0;
    this.sliding = false;
    this.over = false;
    this.paused = false;
    this.running = true;
    this.runner.play();
    this.jumper.play();
    this.hero.play();
    this.last = performance.now();
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(this.tick);
    this.emit();
  }

  pause() {
    if (!this.running || this.over) return;
    this.paused = true;
    this.runner.pause();
    this.jumper.pause();
    this.hero.pause();
  }

  resume() {
    if (!this.running || this.over) return;
    this.paused = false;
    this.runner.play();
    this.jumper.play();
    this.hero.play();
    this.last = performance.now();
  }

  get isPaused() {
    return this.paused;
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.running = false;
    this.runner.pause();
    this.jumper.pause();
    this.hero.pause();
  }

  /* ----------------------------------------------------------------- input */

  jump() {
    if (!this.running || this.paused || this.over) return;
    const maxJumps = 2;
    if (this.jumps < maxJumps) {
      this.jumps++;
      this.vy = this.jumps === 1 ? -this.h * 1.45 : -this.h * 1.2;
      this.sliding = false;
      this.jumper.reset();
      this.burst(this.playerX, this.groundY - 8, 10, 48);
    }
  }

  slide() {
    if (!this.running || this.paused || this.over) return;
    if (this.playerY > 4) {
      this.vy = this.h * 2.2; // fast fall into a slide
    }
    this.sliding = true;
    this.slideTime = 0.65;
  }

  /* ------------------------------------------------------------------ loop */

  private tick = (now: number) => {
    this.raf = requestAnimationFrame(this.tick);
    const dt = Math.min(0.033, (now - this.last) / 1000);
    this.last = now;
    if (!this.paused && !this.over) this.update(dt);
    this.render(dt);
  };

  private update(dt: number) {
    // difficulty ramp + slow-motion power
    const target = 430 + Math.min(620, this.travelled / 26);
    this.speed += (target - this.speed) * Math.min(1, dt * 0.8);
    let speed = this.speed * (this.timers.slow > 0 ? 0.62 : 1) * (this.timers.super > 0 ? 1.3 : 1);
    const move = speed * dt;
    this.travelled += move;

    for (const key of ["shield", "x3", "slow", "super"] as const) {
      if (this.timers[key] > 0) this.timers[key] = Math.max(0, this.timers[key] - dt);
    }
    if (this.invuln > 0) this.invuln -= dt;
    if (this.slideTime > 0) {
      this.slideTime -= dt;
      if (this.slideTime <= 0) this.sliding = false;
    }

    // physics
    this.vy += this.h * 4.6 * dt;
    this.playerY -= this.vy * dt;
    if (this.playerY <= 0) {
      if (this.vy > 0 && this.jumps > 0) this.burst(this.playerX, this.groundY, 8, 40);
      this.playerY = 0;
      this.vy = 0;
      this.jumps = 0;
      this.groundedTime += dt;
    } else {
      this.groundedTime = 0;
    }

    // score
    this.score += (move * 0.05 + dt * 6) * (this.timers.x3 > 0 ? 3 : 1);

    // spawning
    this.sinceSpawn += move;
    this.spawnGap = Math.max(300, 620 - this.travelled / 90);
    if (this.sinceSpawn >= this.spawnGap) {
      this.sinceSpawn = 0;
      this.spawn();
    }

    // entities
    const box = this.playerBox();
    for (const e of this.entities) {
      e.x -= move * (e.kind === "enemy" ? 1.12 : 1);
      e.phase += dt * 3;
      if (e.bob) e.y = e.baseY + Math.sin(e.phase) * e.bob;
      if (e.dead) continue;
      if (this.hits(box, e)) this.resolveHit(e);
    }
    this.entities = this.entities.filter((e) => !e.dead && e.x + e.w > -140);

    // particles + text
    for (const p of this.particles) {
      p.life -= dt;
      p.x += p.vx * dt - move * 0.35;
      p.y += p.vy * dt;
      p.vy += 320 * dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
    for (const t of this.texts) {
      t.life -= dt;
      t.y -= 46 * dt;
      t.x -= move * 0.6;
    }
    this.texts = this.texts.filter((t) => t.life > 0);

    // decor drift
    for (const d of this.decor) {
      d.x -= move * d.depth;
      d.phase += dt;
      if (d.x + d.w < -60) d.x = this.w + rand(40, this.w);
    }

    if (this.shakeTime > 0) this.shakeTime -= dt;
    if (this.flashTime > 0) this.flashTime -= dt;
    this.emit();
  }

  /* --------------------------------------------------------------- spawning */

  private spawn() {
    const roll = Math.random();
    const unit = this.playerH;
    if (roll < 0.3) {
      this.spawnCoinRun();
    } else if (roll < 0.52) {
      const sprite = pick(OBSTACLES);
      const h = unit * rand(0.45, 0.68);
      this.push({
        kind: "obstacle",
        sprite,
        w: h * 1.15,
        h,
        y: this.groundY - h,
        value: 0,
      });
      if (Math.random() < 0.35) this.spawnCoinRun(this.w + h * 3);
    } else if (roll < 0.78) {
      const flying = Math.random() < 0.45;
      const sprite = flying ? pick(FLYING_ENEMIES) : pick(GROUND_ENEMIES);
      const h = unit * (flying ? rand(0.42, 0.55) : rand(0.5, 0.72));
      const y = flying ? this.groundY - unit * rand(1.0, 1.35) : this.groundY - h;
      this.push({
        kind: "enemy",
        sprite,
        w: h * 1.1,
        h,
        y,
        bob: flying ? unit * 0.09 : 0,
        value: 0,
      });
    } else if (roll < 0.86) {
      const h = unit * 0.62;
      this.push({
        kind: "coin",
        sprite: "chest",
        w: h * 1.15,
        h,
        y: this.groundY - h,
        value: 25,
      });
    } else {
      const powers: PowerKind[] = ["shield", "x3", "slow", "life", "super"];
      const weights = [0.26, 0.24, 0.2, 0.14, 0.16];
      let r = Math.random();
      let power: PowerKind = "shield";
      for (let i = 0; i < powers.length; i++) {
        r -= weights[i]!;
        if (r <= 0) {
          power = powers[i]!;
          break;
        }
      }
      const sprite: SpriteKey =
        power === "shield"
          ? "p_shield"
          : power === "x3"
            ? "p_3x"
            : power === "slow"
              ? "p_slow"
              : power === "life"
                ? "p_heart"
                : "p_lollipop";
      const h = unit * 0.5;
      this.push({
        kind: "power",
        sprite,
        w: h,
        h,
        y: this.groundY - unit * rand(0.85, 1.25),
        bob: unit * 0.08,
        power,
        value: 0,
      });
    }
  }

  private spawnCoinRun(startX = this.w + 60) {
    const count = Math.floor(rand(4, 8));
    const sprite = Math.random() < 0.15 ? "coin_chiku" : pick(COINS);
    const size = this.playerH * (sprite === "coin_chiku" ? 0.4 : 0.3);
    const arc = Math.random() < 0.55;
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0 : i / (count - 1);
      const lift = arc
        ? Math.sin(t * Math.PI) * this.playerH * 1.05
        : this.playerH * rand(0.35, 0.55);
      this.push({
        kind: "coin",
        sprite,
        w: size,
        h: size,
        y: this.groundY - size - this.playerH * 0.15 - lift,
        x: startX + i * size * 1.7,
        value: sprite === "coin_chiku" ? 5 : 1,
        bob: size * 0.08,
      });
    }
    this.coinRun++;
  }

  private push(e: Omit<Entity, "baseY" | "bob" | "phase" | "x"> & { x?: number; bob?: number }) {
    const x = e.x ?? this.w + 60;
    this.entities.push({
      ...e,
      x,
      bob: e.bob ?? 0,
      baseY: e.y,
      phase: rand(0, Math.PI * 2),
    });
  }

  /* -------------------------------------------------------------- collision */

  private hits(box: { x: number; y: number; w: number; h: number }, e: Entity) {
    const pad = e.kind === "obstacle" || e.kind === "enemy" ? 0.7 : 0.95;
    const ex = e.x + (e.w * (1 - pad)) / 2;
    const ey = e.y + (e.h * (1 - pad)) / 2;
    const ew = e.w * pad;
    const eh = e.h * pad;
    const bx = box.x + box.w * 0.16;
    const bw = box.w * 0.68;
    return bx < ex + ew && bx + bw > ex && box.y < ey + eh && box.y + box.h > ey;
  }

  private resolveHit(e: Entity) {
    if (e.kind === "coin") {
      e.dead = true;
      const gained = e.value * (this.timers.x3 > 0 ? 3 : 1) * this.combo;
      this.coins += e.value;
      this.score += gained * 10;
      this.combo = Math.min(8, this.combo + (e.sprite === "chest" ? 2 : 0.25));
      this.burst(e.x + e.w / 2, e.y + e.h / 2, e.sprite === "chest" ? 26 : 10, 60);
      this.texts.push({
        x: e.x,
        y: e.y,
        life: 0.8,
        text: `+${Math.round(gained * 10)}`,
        gold: true,
      });
      return;
    }
    if (e.kind === "power" && e.power) {
      e.dead = true;
      this.applyPower(e.power, e);
      return;
    }
    // obstacle or enemy
    if (this.timers.super > 0) {
      e.dead = true;
      this.score += 60;
      this.burst(e.x + e.w / 2, e.y + e.h / 2, 24, 110);
      this.texts.push({ x: e.x, y: e.y, life: 0.8, text: "+60", gold: false });
      return;
    }
    if (this.invuln > 0) return;
    if (this.timers.shield > 0) {
      this.timers.shield = 0;
      e.dead = true;
      this.invuln = 1;
      this.flashTime = 0.25;
      this.burst(e.x + e.w / 2, e.y + e.h / 2, 22, 90);
      this.texts.push({ x: e.x, y: e.y, life: 0.9, text: "SHIELD!", gold: false });
      return;
    }
    e.dead = true;
    this.lives -= 1;
    this.combo = 1;
    this.invuln = 1.6;
    this.shakeTime = 0.4;
    this.flashTime = 0.3;
    this.burst(e.x + e.w / 2, e.y + e.h / 2, 20, 120);
    if (this.lives <= 0) this.finish();
  }

  private applyPower(power: PowerKind, e: Entity) {
    const label: Record<PowerKind, string> = {
      shield: "SHIELD",
      x3: "3X SCORE!",
      slow: "SLOW 15s",
      life: "+1 LIFE",
      super: "SUPER!",
    };
    if (power === "life") this.lives = Math.min(5, this.lives + 1);
    if (power === "shield") this.timers.shield = 10;
    if (power === "x3") this.timers.x3 = 10;
    if (power === "slow") this.timers.slow = 15;
    if (power === "super") {
      this.timers.super = 8;
      this.hero.reset();
    }
    this.flashTime = 0.3;
    this.burst(e.x + e.w / 2, e.y + e.h / 2, 26, 120);
    this.texts.push({ x: e.x - 20, y: e.y, life: 1.1, text: label[power], gold: false });
  }

  private finish() {
    this.over = true;
    this.running = false;
    if (this.score > this.best) {
      this.best = Math.round(this.score);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(BEST_KEY, String(this.best));
      }
    }
    this.onGameOver(this.status());
  }

  private burst(x: number, y: number, count: number, spread: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: rand(-spread, spread),
        vy: rand(-spread * 1.6, spread * 0.4),
        life: rand(0.3, 0.8),
        max: 0.8,
        size: rand(3, 9),
        hue: rand(300, 360),
      });
    }
  }

  private status(): GameStatus {
    return {
      score: Math.round(this.score),
      coins: this.coins,
      lives: this.lives,
      distance: Math.round(this.travelled / 40),
      combo: Math.round(this.combo * 10) / 10,
      shield: this.timers.shield,
      x3: this.timers.x3,
      slow: this.timers.slow,
      super: this.timers.super,
      best: this.best,
    };
  }

  private emit() {
    this.onStatus(this.status());
  }

  /* ---------------------------------------------------------------- render */

  private render(dt: number) {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);

    if (this.shakeTime > 0) {
      const s = this.shakeTime * 18;
      ctx.translate(rand(-s, s), rand(-s, s));
    }

    // parallax decor
    for (const d of this.decor) {
      const img = this.sprites[d.sprite];
      if (!img?.width) continue;
      const h = (d.w / img.width) * img.height;
      ctx.globalAlpha = d.depth < 0.3 ? 0.85 : 0.95;
      ctx.drawImage(d.sprite.startsWith("d_butterfly") ? img : img, d.x, d.y + Math.sin(d.phase) * 8, d.w, h);
      ctx.globalAlpha = 1;
    }

    this.drawGround();

    // entities
    for (const e of this.entities) {
      const img = this.sprites[e.sprite];
      if (!img?.width) continue;
      const spin = e.kind === "coin" ? Math.sin(e.phase * 1.6) : 0;
      ctx.save();
      ctx.translate(e.x + e.w / 2, e.y + e.h / 2);
      if (e.kind === "coin" || e.kind === "power") {
        ctx.scale(1 - Math.abs(spin) * 0.25, 1);
        ctx.shadowColor = "rgba(255, 214, 92, 0.9)";
        ctx.shadowBlur = 22;
      }
      ctx.drawImage(img, -e.w / 2, -e.h / 2, e.w, e.h);
      ctx.restore();
    }

    this.drawPlayer();

    // particles
    for (const p of this.particles) {
      const a = Math.max(0, p.life / p.max);
      ctx.globalAlpha = a;
      ctx.fillStyle = `hsl(${p.hue} 95% ${60 + a * 20}%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // floating texts
    ctx.textAlign = "center";
    for (const t of this.texts) {
      ctx.globalAlpha = Math.min(1, t.life * 1.6);
      ctx.font = `900 ${Math.round(this.h * 0.045)}px 'Baloo 2', system-ui, sans-serif`;
      ctx.lineWidth = 6;
      ctx.strokeStyle = "rgba(120, 26, 78, 0.85)";
      ctx.strokeText(t.text, t.x, t.y);
      ctx.fillStyle = t.gold ? "#ffd75e" : "#ffffff";
      ctx.fillText(t.text, t.x, t.y);
    }
    ctx.globalAlpha = 1;

    if (this.flashTime > 0) {
      ctx.fillStyle = `rgba(255,255,255,${this.flashTime * 0.5})`;
      ctx.fillRect(-40, -40, this.w + 80, this.h + 80);
    }
    void dt;
  }

  private drawGround() {
    const ctx = this.ctx;
    const gy = this.groundY;
    const grad = ctx.createLinearGradient(0, gy, 0, this.h);
    grad.addColorStop(0, "rgba(255, 138, 199, 0.85)");
    grad.addColorStop(1, "rgba(126, 32, 100, 0.92)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, gy, this.w, this.h - gy);

    // candy stripes scrolling with the world
    const stripe = 56;
    const offset = -(this.travelled % (stripe * 2));
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, gy, this.w, this.h - gy);
    ctx.clip();
    ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
    for (let x = offset; x < this.w + stripe * 2; x += stripe * 2) {
      ctx.beginPath();
      ctx.moveTo(x, gy);
      ctx.lineTo(x + stripe, gy);
      ctx.lineTo(x + stripe - 26, this.h);
      ctx.lineTo(x - 26, this.h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    ctx.fillStyle = "rgba(255, 240, 250, 0.9)";
    ctx.fillRect(0, gy - 4, this.w, 5);
  }

  private drawPlayer() {
    const ctx = this.ctx;
    const box = this.playerBox();
    const sprite =
      this.timers.super > 0 ? this.hero : this.playerY > 6 ? this.jumper : this.runner;
    const frame = sprite.frame();

    // shadow
    const shrink = 1 - Math.min(0.55, this.playerY / (this.h * 0.5));
    ctx.save();
    ctx.globalAlpha = 0.28 * shrink;
    ctx.fillStyle = "#3d0b2c";
    ctx.beginPath();
    ctx.ellipse(this.playerX, this.groundY + 4, box.w * 0.4 * shrink, 10 * shrink, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (this.timers.super > 0) {
      const t = performance.now() / 300;
      ctx.save();
      ctx.globalAlpha = 0.55;
      const g = ctx.createRadialGradient(
        this.playerX,
        box.y + box.h / 2,
        box.w * 0.2,
        this.playerX,
        box.y + box.h / 2,
        box.w * (1.1 + Math.sin(t) * 0.08),
      );
      g.addColorStop(0, "rgba(255, 214, 92, 0.75)");
      g.addColorStop(1, "rgba(255, 138, 199, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(this.playerX - box.w * 1.4, box.y - box.h * 0.4, box.w * 2.8, box.h * 1.8);
      ctx.restore();
    }

    if (this.timers.shield > 0) {
      ctx.save();
      ctx.strokeStyle = "rgba(120, 214, 255, 0.9)";
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.7 + Math.sin(performance.now() / 120) * 0.2;
      ctx.beginPath();
      ctx.ellipse(this.playerX, box.y + box.h / 2, box.w * 0.75, box.h * 0.62, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    if (this.invuln > 0) ctx.globalAlpha = 0.4 + Math.abs(Math.sin(performance.now() / 70)) * 0.6;
    if (frame) {
      const scale = box.h / (this.sliding ? 1 : 1) / frame.height;
      const dw = frame.width * scale * (this.sliding ? 1.25 : 1);
      const dh = box.h;
      ctx.translate(this.playerX, box.y + dh / 2);
      if (this.sliding) ctx.rotate(-0.35);
      ctx.drawImage(frame, -dw / 2, -dh / 2, dw, dh);
    } else {
      ctx.fillStyle = "rgba(255, 138, 199, 0.9)";
      ctx.beginPath();
      ctx.roundRect(box.x, box.y, box.w, box.h, 18);
      ctx.fill();
    }
    ctx.restore();
  }
}
