Markdown
# 弾薬物理軌道シミュレータ (Bullet Ballistics Simulator)
<img width="1919" height="982" alt="スクリーンショット 2026-06-01 075034" src="https://github.com/user-attachments/assets/3b9816bf-4815-4925-9809-34426a0b1f1f" />

TypeScriptとHTML5 Canvasを使用した、安全かつ軽量な2D弾道シミュレータです。
ハンドガン弾（9mm、.45ACP等）から、散弾（12ゲージ）、超高速のライフル弾（5.56mm、.50BMG）まで、全11種類のリアルな弾道特性を視覚的に比較できます。

## ✨ 特徴
- **型安全な物理エンジン:** TypeScriptによる厳格な型定義（`verbatimModuleSyntax` 準拠）。
- **オイラー法による物理演算:** 重力と空気抵抗を考慮したリアルな放物線。
- **安全弁機能 (防フリーズ):** `maxSteps` による無限ループ防止機構を搭載。
- **動的オートスケーリング:** 弾種の最大射程に合わせてアスペクト比を維持したまま描画サイズを自動最適化。

## 🚀 開発環境の起動

### インストール
```bash
npm install
ローカルサーバー起動
Bash
npm run dev
🛠️ 技術スタック
TypeScript 5.x

Vite (ビルドツール)

HTML5 Canvas API (描画)
