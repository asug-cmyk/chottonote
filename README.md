# くらし比較ノート — ブログ雛形

ビルド不要の静的HTMLサイトです。フレームワークなし、npm installも不要。
Vercelの無料枠で完全に0円運用できます。

## デプロイ手順(すべて無料)

1. GitHubで新しいリポジトリを作る(例: `amazon-blog`)
2. このフォルダの中身をそのままリポジトリにpush
   ```
   git init
   git add .
   git commit -m "init blog"
   git branch -M main
   git remote add origin https://github.com/あなたのユーザー名/amazon-blog.git
   git push -u origin main
   ```
3. Vercelダッシュボード → "Add New Project" → 今作ったGitHubリポジトリを選択してImport
   - Framework Preset: **Other**(静的HTMLなのでビルド設定は不要)
   - そのままDeployでOK
4. デプロイ完了後、`amazon-blog-xxxx.vercel.app` のようなURLが発行される(これが無料サブドメイン)

## 新しい記事を追加するとき

1. `articles/sample-article.html` をコピーして新しいファイル名にする(例: `articles/cable-tray-hikaku.html`)
2. タイトル・本文・比較表・Amazonリンクを差し替える
3. `index.html` の `<ul class="article-list">` 内に新しい `<li>` を追加してリンクする
4. `sitemap.xml` にも新しいURLを1行追加する
5. `REPLACE-WITH-YOUR-DOMAIN` の部分を実際のVercel URLに置き換える(全ファイル共通)
6. git commit & push すれば自動で反映される(Vercelは push するだけで自動デプロイ)

## 注意点

- `<a class="cta-link" href="#">` の `#` の部分に、実際のAmazonアソシエイトリンクを入れてください
- `rel="nofollow sponsored noopener"` は付けたままにしてください(Amazon規約・Google両方の推奨)
- 各記事に `.disclosure-note` (アフィリエイト開示文)が入っていることを確認してください。Amazon規約で必須です
- 廃番などでリンク切れが起きていないか、月1回程度チェックしてください
