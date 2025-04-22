export const initialGameState = {
  mario: { x: 50, y: 320, vx: 0, vy: 0, width: 32, height: 32, isBig: false, isJumping: false, isCrouching: false, onGround: true, alive: true },
  enemies: [{ id: 1, x: 400, y: 336, vx: -1, width: 32, height: 32, alive: true }],
  mushrooms: [{ id: 1, x: 200, y: 336, vx: 1, width: 32, height: 32, visible: true }],
  flag: { x: 800, y: 272, width: 24, height: 96, reached: false },
  keys: {},
  finished: false,
  score: 0,
};

export function gameReducer(state, action) {
  if (state.finished) return state;
  switch (action.type) {
    case 'KEY_DOWN':
      return { ...state, keys: { ...state.keys, [action.key]: true } };
    case 'KEY_UP':
      return { ...state, keys: { ...state.keys, [action.key]: false } };
    case 'TICK':
      return tick(state);
    default:
      return state;
  }
}

const GRAVITY = 1.5;
const MOVE_SPEED = 3;
const JUMP_POWER = 18;
const BIG_JUMP_POWER = 20;
const MUSHROOM_SPEED = 2;

function tick(state) {
  let { mario, enemies, mushrooms, flag, keys, finished, score } = state;
  if (!mario.alive) return { ...state };

  let vx = 0;
  if (keys['ArrowLeft']) vx -= MOVE_SPEED;
  if (keys['ArrowRight']) vx += MOVE_SPEED;

  let isCrouching = !!keys['ArrowDown'] && mario.onGround;
  let vy = mario.vy;
  let isJumping = mario.isJumping;
  let onGround = mario.onGround;
  if (keys[' '] || keys['ArrowUp']) {
    if (onGround && !isJumping) {
      vy = mario.isBig ? -BIG_JUMP_POWER : -JUMP_POWER;
      isJumping = true;
      onGround = false;
    }
  }

  vy += GRAVITY;
  let newY = mario.y + vy;
  if (newY >= 320) {
    newY = 320;
    vy = 0;
    onGround = true;
    isJumping = false;
  }

  let newMario = { ...mario, x: Math.max(0, Math.min(mario.x + vx, 900 - (mario.isBig ? 48 : 32))), y: newY, vx, vy, isJumping, isCrouching, onGround };
  if (mario.isBig) { newMario.width = 48; newMario.height = 48; } else { newMario.width = 32; newMario.height = 32; }

  let newMushrooms = mushrooms.map(m => {
    if (!m.visible) return m;
    let mx = m.x + MUSHROOM_SPEED;
    if (mx > 900 - m.width) mx = 900 - m.width;
    return { ...m, x: mx };
  });
  for (let m of newMushrooms) { if (m.visible && collide(newMario, m)) { newMario.isBig = true; m.visible = false; } }

  let newEnemies = enemies.map(e => {
    if (!e.alive) return e;
    let ex = e.x + e.vx;
    if (ex < 0 || ex > 900 - e.width) e.vx *= -1;
    return { ...e, x: ex };
  });
  for (let e of newEnemies) {
    if (e.alive && collide(newMario, e)) {
      if (newMario.vy > 0 && newMario.y + newMario.height - e.y < 20) { e.alive = false; newMario.vy = -10; score += 100; } else { if (newMario.isBig) { newMario.isBig = false; newMario.x -= 30; } else { newMario.alive = false; } } }
  }

  if (collide(newMario, flag)) { flag.reached = true; finished = true; score += 500; }

  return { ...state, mario: newMario, enemies: newEnemies, mushrooms: newMushrooms, flag: { ...flag }, finished, score };
}

function collide(a, b) { return (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y); }

export function drawGame(ctx, state) {
  ctx.clearRect(0, 0, 900, 400);
  ctx.fillStyle = '#b7b7a4'; ctx.fillRect(0, 352, 900, 48);
  for (const m of state.mushrooms) { if (m.visible) drawSprite(ctx, m.x, m.y, m.width, m.height, '/mushroom.svg'); }
  for (const e of state.enemies) { if (e.alive) drawSprite(ctx, e.x, e.y, e.width, e.height, '/goomba.svg'); }
  if (state.mario.alive) { drawSprite(ctx, state.mario.x, state.mario.y, state.mario.width, state.mario.height, state.mario.isBig ? '/mario-big.svg' : '/mario.svg'); } else { ctx.font = 'bold 48px Arial'; ctx.fillStyle = 'red'; ctx.fillText('GAME OVER', 320, 200); }
  drawSprite(ctx, state.flag.x, state.flag.y, state.flag.width, state.flag.height, '/flag.svg');
  ctx.font = '20px Arial'; ctx.fillStyle = '#222'; ctx.fillText('分数: ' + state.score, 20, 30);
  if (state.finished) { ctx.font = 'bold 48px Arial'; ctx.fillStyle = '#38b000'; ctx.fillText('通关成功！', 320, 120); }
}

function drawSprite(ctx, x, y, w, h, src) {
  const img = new window.Image(); img.src = src; img.onload = () => ctx.drawImage(img, x, y, w, h);
  if (img.complete) ctx.drawImage(img, x, y, w, h);
}
