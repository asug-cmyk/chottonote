# アフィリエイト記事 構造統一レポート

作業日: 2026-09-18
対象: 5記事(monitor-arm-hikaku / wireless-charger-hikaku / desk-light-hikaku / cordless-vacuum-hikaku / denki-kettle-hikaku)

## 背景

`monitor-arm-hikaku.html` に先行して追加されていた新しい記事構成(調査方法の明記・結論早見表・向き不向き・購入判断フロー・まとめのfinal-cta化・クリック計測)を、残り4記事(`wireless-charger-hikaku.html` / `desk-light-hikaku.html` / `cordless-vacuum-hikaku.html` / `denki-kettle-hikaku.html`)にも同じ構造で展開し、5記事すべての構成を揃えた。あわせて5記事全体でクリック計測タグとHTML/リンクの整合性を確認した。

**商品ファクト・既存の外部リンク(Amazon `dp/` ID、楽天アフィリエイトURL)は一切変更していない。** 新規追加したquick-answer/decision-aidブロックのAmazonリンクも、同記事の比較表・商品解説で使っている既存URLをそのまま再利用している(新しいURLの発行なし)。

## 変更したファイル

| ファイル | 変更内容 |
|---|---|
| `articles/desk-light-hikaku.html` | 調査方法note・結論早見表(quick-answer)・向き不向き(suitability)・購入判断フロー(decision-aid)を追加。まとめセクションを`final-cta`でラップし価格変動注記(`price-check-note`)を追加。計測スクリプトを追加 |
| `articles/cordless-vacuum-hikaku.html` | 同上 |
| `articles/denki-kettle-hikaku.html` | 同上 |
| `articles/wireless-charger-hikaku.html` | 前回セッションで調査方法note・quick-answer・suitability・計測スクリプトまでは追加済みだったが、`decision-aid`と`final-cta`ラップ・`price-check-note`が欠けていたため、今回追加して他4記事と構造を完全に一致させた |
| `articles/monitor-arm-hikaku.html` | 変更なし(参照テンプレートとして使用) |
| `assets/affiliate-tracking.js` | 変更なし(既存の計測スクリプトをそのまま5記事で共有) |

## 追加・統一した構造要素(5記事共通)

1. `methodology-note` — 「公式スペック・価格情報とレビューを確認して執筆した比較記事であり、実機試用記事ではない」という調査方法の明記
2. `quick-answer` — 3タイプ分の「結論だけ先に知りたい人」向け早見カード(各カードはAmazonリンクのみ、同記事内アンカー`#product-N`にも遷移可能)
3. 「こんな人におすすめ・こんな人は他の選択肢も検討を」— メリット/デメリットと重複しない、購入判断寄りの向き不向きセクション
4. `decision-aid` — Q1〜Q3形式の購入判断フローチャート(各記事のカテゴリ特性に合わせて内容を作成。wireless-chargerはMagSafe/複数端末/価格重視の3問構成)
5. `final-cta`ラップ + `price-check-note` — まとめセクションを`final-cta`クラスでラップし、「価格はセール・ポイント還元で変動するため購入前に両モールを確認」の注記を追加(quick-pickにも同じ注記を追加)
6. `<script src="/assets/affiliate-tracking.js" defer></script>` — 共有クリック計測タグ(`header.js` → `toc.js` → `affiliate-tracking.js`の順で5記事とも統一)

商品カード内のCTA文言(「Amazonで〇〇を見る」など、商品名入り)は既存パターンのまま変更していない。

## 検証結果

- **計測スクリプトの読み込み**: 5記事すべてで`/assets/affiliate-tracking.js`の読み込みを1件ずつ確認(`grep -c`で全ファイル1件)。読み込み順序(`header.js` → `toc.js` → `affiliate-tracking.js`)も5記事で統一。
- **`assets/affiliate-tracking.js`のロジック確認**: `getCtaPosition`は`.quick-answer`(→`feature-card`)・`.product-card`・`.quick-pick`・`.final-cta`・`<td>`(比較表)の5系統を判定し、`getProductName`は`.product-card .product-name`、表の行内リンク、`.feature-card h3 a`から商品名を取得する実装。5記事すべてのCTAリンクがこの5系統のコンテナ内にのみ存在することを目視・grepで確認し、`affiliate_click`イベントが`article`・`product`・`store`・`cta_position`を正しく送信できることを確認した。
- **HTMLタグバランス**: 5記事すべてで`<div>`/`</div>`の出現数が一致(desk-light: 48/48、cordless-vacuum: 48/48、denki-kettle: 48/48、wireless-charger: 48/48、monitor-arm: 60/60)。`monitor-arm`は`decision-aid`に加え`stat-callout`・`trust-checklist`・`pain-points`カード構造など独自要素が多い分、div数が他記事より多い(構造差は正常)。
- **アンカーリンク**: `desk-light` / `cordless-vacuum` / `denki-kettle`の`quick-answer`内`href="#product-N"`が同記事内`id="product-N"`(商品解説カード)にすべて解決することを確認。
- **既存リンクの非破壊確認**: 各記事の`dp/`(Amazon商品ID)と`hb.afl.rakuten.co.jp`(楽天アフィリエイトURL)を`grep`で抽出し、記事内で使われるIDが商品数と一致し、既存の値のまま増減がないことを確認。`git diff`で3記事の変更差分を確認し、追加行以外に既存URL・文言の変更がないことも確認(まとめセクションが`final-cta`内に再インデントされた際も文言・URLとも無変更)。
- **利用したツール**: `grep`/`git diff --stat`/`git diff`による構造・リンク検査。環境の制約により`tidy`等のHTML構文チェッカー、Pythonスクリプトの実行は許可が得られず利用不可だったため、タグの開閉数一致・属性値・アンカー解決をテキストベースで手動検証した。

## 未実施・残課題(ブロッカー)

- **英語版(en/)は対象外のまま**: `en/articles/`配下の対応記事は旧構成のまま。`en/articles/monitor-arm-hikaku.html`のみ既存の未コミット差分で一部更新済みだが、今回の指示は日本語版5本が対象のため着手していない。
- **CONTENT_CHECKLIST.md**: 運用ルール上、更新日は価格・在庫・スペックを再確認したときのみ書き換える運用のため、今回のような構造追加(見た目・計測タグの変更)では更新日を書き換えていない。記事本文の`article-meta`(公開日/更新日)も同様の理由で変更していない。
- **ブラウザでの実表示確認は未実施**: ローカルサーバーを立てての目視確認(quick-answer・suitability・decision-aidのモバイル幅での表示崩れがないか)は今回のセッションでは行っていない。
- **デプロイ・公開は未実施**: ローカルの編集のみで、コミット・pushは行っていない。

## 次のステップ(提案)

1. 英語版5本(en/articles配下)へ同じ構造をいつ展開するかを決める。
2. ブラウザでのビジュアル確認(quick-answer・suitability・decision-aidの表示崩れがないか、特にモバイル幅)。
3. 問題なければ`git add`→コミット(このセッションでは未コミット・未pushで、ユーザーの指示どおりデプロイは行っていない)。
