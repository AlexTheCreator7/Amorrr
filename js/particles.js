/* ═══════════════════════════════════════
   Particle System — Canvas-based
   ═══════════════════════════════════════ */

// ── Heart path (Bézier) ──
function heartPath(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.3);
  ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.15);
  ctx.bezierCurveTo(x - s * 0.5, y + s * 0.45, x, y + s * 0.55, x, y + s * 0.7);
  ctx.bezierCurveTo(x, y + s * 0.55, x + s * 0.5, y + s * 0.45, x + s * 0.5, y + s * 0.15);
  ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3);
}

// ── Petal path (ellipse) ──
function petalPath(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
}

// ── Particle class ──
class Particle {
  constructor(type, x, y, opts = {}) {
    this.type   = type;
    this.x      = x;
    this.y      = y;
    this.vx     = opts.vx     || 0;
    this.vy     = opts.vy     || 0;
    this.life   = 1;
    this.decay  = opts.decay  || 0.01;
    this.size   = opts.size   || 10;
    this.color  = opts.color  || '#7a2e3a';
    this.rot    = opts.rot    || 0;
    this.vrot   = opts.vrot   || 0;
    this.gravity= opts.gravity|| 0;
    this.style  = opts.style  || 'outline';
  }

  update() {
    this.x   += this.vx;
    this.y   += this.vy;
    this.vy  += this.gravity;
    this.rot += this.vrot;
    this.life-= this.decay;
    return this.life > 0;
  }

  draw(ctx) {
    const a = Math.max(0, this.life);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);

    if (this.type === 'heart') {
      const s = this.size;

      if (this.style === 'filled') {
        heartPath(ctx, 0, -s * 0.35, s);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = a * 0.25;
        ctx.fill();
        ctx.globalAlpha = a * 0.6;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 0.8;
        ctx.stroke();

      } else if (this.style === 'dashed') {
        heartPath(ctx, 0, -s * 0.35, s);
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = a * 0.5;
        ctx.stroke();
        ctx.setLineDash([]);

      } else if (this.style === 'double') {
        heartPath(ctx, 0, -s * 0.35, s);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = a * 0.3;
        ctx.stroke();
        heartPath(ctx, 0, -s * 0.28, s * 0.8);
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = a * 0.6;
        ctx.stroke();

      } else {
        // outline (default)
        heartPath(ctx, 0, -s * 0.35, s);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = a * 0.65;
        ctx.stroke();
      }

    } else if (this.type === 'petal') {
      petalPath(ctx, 0, 0, this.size * 0.4, this.size);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = a * 0.45;
      ctx.fill();

    } else if (this.type === 'spark') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.size * 2;
      ctx.fill();

    } else if (this.type === 'ring') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = a * 0.4;
      ctx.stroke();
    }

    ctx.restore();
  }
}
