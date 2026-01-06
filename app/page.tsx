import Link from "next/link";

const difficulties = [
  {
    id: "weak",
    label: "弱",
    description: "合法手をランダム or 反転最大で選ぶ CPU（練習向け）"
  },
  {
    id: "medium",
    label: "中",
    description: "角や辺を優先するヒューリスティック CPU"
  },
  {
    id: "strong",
    label: "強",
    description: "探索＋評価で 2 秒以内に最善手を狙う CPU"
  }
] as const;

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="home-panel">
        <p>ルール忠実なオセロをブラウザで。</p>
        <h1>Simple Othello</h1>
        <p>
          CPU対戦（弱/中/強）やローカル2人対戦で合法手をハイライトしながら遊べます。
          Undo/Restart、サウンド設定も UI で切り替え可能です。
        </p>
        <div className="home-grid">
          {difficulties.map((difficulty) => (
            <Link
              key={difficulty.id}
              href={`/game?mode=cpu&difficulty=${difficulty.id}`}
              className="difficulty-card"
            >
              <strong>CPU ({difficulty.label})</strong>
              <span>{difficulty.description}</span>
            </Link>
          ))}
          <Link className="mode-card" href="/game?mode=local">
            <strong>ローカル2人対戦</strong>
            <span>同一端末で交互に操作します（あとで実装予定）</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

