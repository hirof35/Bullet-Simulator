// 型定義
export interface Vector2D {
    x: number;
    y: number;
  }
  
  export interface BulletPreset {
    name: string;
    initialSpeed: number;  // 初速 (m/s)
    airResistance: number; // 空気抵抗係数
    color: string;
    desc: string;
  }
  
  export interface SimulationConfig {
    gravity: number;
    timeStep: number;
    maxSteps: number;
  }
  
  // 弾薬データプリセット一式
  export const BULLET_PRESETS: BulletPreset[] = [
    { name: ".380 ACP",       speed: 300, drag: 0.060, color: "#ff453a", desc: "小型護身用。パワーが弱く空気抵抗で即失速。" },
    { name: ".38 Special",    speed: 290, drag: 0.055, color: "#ff9f0a", desc: "定番リボルバー弾。低速で弾道はお辞儀しやすい。" },
    { name: "9mm Parabellum", speed: 360, drag: 0.050, color: "#ffd60a", desc: "世界標準の拳銃弾。バランスが良く素直な放物線。" },
    { name: ".40 S&W",        speed: 320, drag: 0.053, color: "#30d158", desc: "警察用ピストル弾。9mmと45口径の中間的特性。" },
    { name: ".45 ACP",        speed: 250, drag: 0.050, color: "#64d2ff", desc: "大口径の鈍足重量弾。弾道ドロップが非常に大きい。" },
    { name: "S&W .500",       speed: 630, drag: 0.045, color: "#0a84ff", desc: "最強の拳銃弾。リボルバーらしからぬ狂気的な初速。" },
    { name: "12 Gauge (Slug)",speed: 430, drag: 0.080, color: "#bf5af2", desc: "散弾銃の単体重量弾。バケツ形状のため超強烈に失速。" },
    { name: "5.45x39mm",      speed: 880, drag: 0.016, color: "#da8fff", desc: "AK-74用弾薬。細長く、極めて空気抵抗が少ない。" },
    { name: "5.56mm NATO",    speed: 900, drag: 0.015, color: "#ff9f0a", desc: "M4等に採用。超高速・軽量弾で矢のように低伸する。" },
    { name: "7.62x39mm",      speed: 715, drag: 0.025, color: "#ff3b30", desc: "AK-47用。5.56mmより重く遅いが中距離で粘る。" },
    { name: "7.62mm NATO",    speed: 800, drag: 0.020, color: "#34c759", desc: "狙撃・機関銃用。パワーがあり遠距離でも安定。" },
    { name: ".50 BMG (50口径)", speed: 850, drag: 0.012, color: "#00ffff", desc: "超大型対物ライフル弾。質量により空気の壁を切り裂く。" }
  ].map(b => ({ ...b, initialSpeed: b.speed, airResistance: b.drag })); // 内部プロパティ名の統一化
  
  /**
   * 弾道シミュレータ (型安全＆低負荷設計)
   */
  export class BulletSimulator {
    private config: SimulationConfig;
  
    constructor(config: Partial<SimulationConfig> = {}) {
      this.config = {
        gravity: 9.81,
        timeStep: 0.016, // 約60fps
        maxSteps: 12000, // 無限ループ・フリーズ防止安全弁
        ...config
      };
    }
  
    /**
     * 弾道を計算して全座標の配列を返す
     */
    public run(initialSpeed: number, angleDegree: number, airResistance: number): Vector2D[] {
      const angleRad = (angleDegree * Math.PI) / 180;
      
      const state = {
        x: 0,
        y: 0,
        vx: initialSpeed * Math.cos(angleRad),
        vy: initialSpeed * Math.sin(angleRad)
      };
  
      const trajectory: Vector2D[] = [{ x: state.x, y: state.y }];
      let steps = 0;
      const dt = this.config.timeStep;
  
      while (steps < this.config.maxSteps) {
        // 物理演算（オイラー法）
        const dragX = -airResistance * state.vx;
        const dragY = -airResistance * state.vy;
  
        state.x += state.vx * dt;
        state.y += state.vy * dt;
  
        state.vx += dragX * dt;
        state.vy += (-this.config.gravity + dragY) * dt;
  
        trajectory.push({ x: state.x, y: state.y });
        steps++;
  
        // 着地判定
        if (steps > 1 && state.y <= 0) {
          trajectory[trajectory.length - 1].y = 0;
          break;
        }
      }
      return trajectory;
    }
  }