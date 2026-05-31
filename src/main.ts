import { BulletSimulator, BULLET_PRESETS, type BulletPreset } from "./BulletSimulator";
// DOM要素の取得（Non-null assertion operator を使用して型安全を確保）
const canvas = document.getElementById("simCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const btnGroup = document.getElementById("preset-buttons")!;
const statsPanel = document.getElementById("stats-panel")!;

const simulator = new BulletSimulator();
let selectedBullet: BulletPreset = BULLET_PRESETS[2]; // 初期値: 9mm

/**
 * 画面描画ロジック
 */
function render(): void {
  // 仰角45度で弾道計算
  const trajectory = simulator.run(selectedBullet.initialSpeed, 45, selectedBullet.airResistance);

  const totalSteps = trajectory.length;
  const maxRange = trajectory[totalSteps - 1].x;
  const maxHeight = Math.max(...trajectory.map(p => p.y));

  // 1. UIテキストの更新
  statsPanel.innerHTML = `
    <strong>指定弾薬:</strong> ${selectedBullet.name}<br>
    <span style="color:#8e8e93; font-size:12px;">${selectedBullet.desc}</span>
    <hr style="border:0; border-top:1px solid #2e2e3f; margin:12px 0;">
    <strong>弾頭初速 (v₀):</strong> <span>${selectedBullet.initialSpeed} m/s</span><br>
    <strong>空気抵抗係数 (k):</strong> <span>${selectedBullet.airResistance.toFixed(3)}</span><br>
    <strong>最大水平射程:</strong> <span>${maxRange.toFixed(1)} m</span><br>
    <strong>最高到達高度:</strong> <span>${maxHeight.toFixed(1)} m</span>
  `;

  // 2. Canvasのリセット
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // オートスケーリングの計算
  const padding = 50;
  const scaleX = (canvas.width - padding * 2) / maxRange;
  const scaleY = scaleX; // 1:1のアスペクト比を維持

  const originX = padding;
  const originY = canvas.height - padding;

  // 背景地平線の描画
  ctx.strokeStyle = "#3a3a4a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, originY);
  ctx.lineTo(canvas.width, originY);
  ctx.stroke();

  // 弾道ラインの描画
  ctx.strokeStyle = selectedBullet.color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(originX, originY);

  trajectory.forEach(pos => {
    const cx = originX + pos.x * scaleX;
    const cy = originY - pos.y * scaleY; // Y軸反転
    ctx.lineTo(cx, cy);
  });
  ctx.stroke();

  // 着地ターゲットマーク
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(originX + maxRange * scaleX, originY, 5, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 初期化処理：ボタンの動的生成
 */
function init(): void {
  BULLET_PRESETS.forEach((bullet) => {
    const btn = document.createElement("button");
    btn.innerText = bullet.name;
    if (bullet.name === selectedBullet.name) btn.classList.add("active");
    
    btn.onclick = () => {
      document.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedBullet = bullet;
      render();
    };
    btnGroup.appendChild(btn);
  });

  render();
}

// 起動
init();