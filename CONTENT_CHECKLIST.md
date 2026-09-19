# 記事の定期チェックリスト

価格・在庫・仕様は変わるため、比較記事は放置せず定期的に見直す。このファイルは「いつ・何を確認したか」を記録する台帳。

## 運用ルール

1. **更新日を書き換えるタイミング**
   - 比較表・商品解説の中身（価格帯・スペック・在庫状況・リンク先）を実際に確認し直し、変更があった、または「変更なしを確認した」ときだけ `更新日` を書き換える。
   - 見た目だけの修正（誤字修正・CSS調整など）では更新日は変えない。
2. **更新日の書き換え箇所**（記事ごとに2箇所、JA/EN両方）
   - `.article-header` 内の `公開日: YYYY-MM-DD / 更新日: YYYY-MM-DD`
   - 該当記事の `sitemap.xml` エントリは変更不要（更新日はsitemapに含めていないため）
3. **チェック頻度の目安**
   - **月1回**: 全記事のAmazon/楽天リンクが生きているか（404・販売終了になっていないか）を軽くチェック
   - **四半期に1回（約90日ごと）**: 記事ごとに価格帯・在庫・スペックを個別に再確認し、下の表の「次回確認予定」を更新
4. **リンク切れ・廃番を見つけたとき**
   - 代替商品があれば比較表・商品解説・CTAリンクを差し替えて更新日を更新
   - 代替商品がなければ、該当行に「※販売終了」等の注記を入れ、CTAリンクは外すかトップページへのリンクに変更

## 記事別チェック台帳

| 記事 | 公開日 | 最終更新日 | 次回確認予定(目安) | 備考 |
|---|---|---|---|---|
| [monitor-arm-hikaku](articles/monitor-arm-hikaku.html) | 2026-09-02 | 2026-09-02 | 2026-12-01 | |
| [desk-cable-tray-hikaku](articles/desk-cable-tray-hikaku.html) | 2026-09-02 | 2026-09-02 | 2026-12-01 | |
| [desk-light-hikaku](articles/desk-light-hikaku.html) | 2026-09-02 | 2026-09-02 | 2026-12-01 | |
| [genkan-tsupparirack-hikaku](articles/genkan-tsupparirack-hikaku.html) | 2026-09-02 | 2026-09-02 | 2026-12-01 | |
| [genkan-bench-hikaku](articles/genkan-bench-hikaku.html) | 2026-09-02 | 2026-09-02 | 2026-12-01 | |
| [mizukiri-rack-hikaku](articles/mizukiri-rack-hikaku.html) | 2026-09-02 | 2026-09-02 | 2026-12-01 | |
| [closet-storage-case-hikaku](articles/closet-storage-case-hikaku.html) | 2026-09-04 | 2026-09-04 | 2026-12-03 | |
| [kitchen-gomibako-hikaku](articles/kitchen-gomibako-hikaku.html) | 2026-09-04 | 2026-09-04 | 2026-12-03 | |
| [wireless-charger-hikaku](articles/wireless-charger-hikaku.html) | 2026-09-04 | 2026-09-04 | 2026-12-03 | |
| [monohoshi-rack-hikaku](articles/monohoshi-rack-hikaku.html) | 2026-09-04 | 2026-09-04 | 2026-12-03 | |
| [denki-kettle-hikaku](articles/denki-kettle-hikaku.html) | 2026-09-04 | 2026-09-04 | 2026-12-03 | |
| [kashitsuki-hikaku](articles/kashitsuki-hikaku.html) | 2026-09-09 | 2026-09-09 | 2026-12-08 | |
| [cordless-vacuum-hikaku](articles/cordless-vacuum-hikaku.html) | 2026-09-09 | 2026-09-09 | 2026-12-08 | |
| [air-purifier-hikaku](articles/air-purifier-hikaku.html) | 2026-09-09 | 2026-09-09 | 2026-12-08 | |
| [jitan-kaden-hitorigurashi-matome](articles/jitan-kaden-hitorigurashi-matome.html) | 2026-09-16 | 2026-09-16 | 2026-12-15 | まとめ記事。参照先6記事の見直しに合わせて確認 |
| [rakuten-point-kangen-saidaika](articles/rakuten-point-kangen-saidaika.html) | 2026-09-16 | 2026-09-16 | 2026-12-15 | SPU制度など楽天側の仕様変更に注意 |
| [rakuten-card-kaisetsu](articles/rakuten-card-kaisetsu.html) | 2026-09-16 | 2026-09-16 | 2026-12-15 | 年会費・還元率など楽天カード規約変更に注意 |
| [robot-vacuum-hikaku](articles/robot-vacuum-hikaku.html) | 2026-09-17 | 2026-09-17 | 2026-12-16 | 楽天リンク未掲載(Amazonのみ)。楽天アフィリエイトリンクを発行でき次第追加 |
| [mattress-hikaku](articles/mattress-hikaku.html) | 2026-09-17 | 2026-09-17 | 2026-12-16 | 楽天リンク未掲載(Amazonのみ)。寝具編カテゴリの1本目。ブラックフライデー(11/20〜11/30予定)を見据えてX投稿を保留中 |
| [joshitsuki-hikaku](articles/joshitsuki-hikaku.html) | 2026-09-17 | 2026-09-17 | 2026-12-16 | 楽天リンク未掲載(Amazonのみ)。AEOCKY(¥34,999)はブラックフライデー(11/20〜11/30予定)を見据えてX投稿を保留中 |
| [joshitsuki-type-hikaku](articles/joshitsuki-type-hikaku.html) | 2026-09-18 | 2026-09-18 | 2026-12-17 | 購入前ガイド記事(方式比較)。EN版なし(hreflangはja+x-defaultのみ)。製品比較は[joshitsuki-hikaku](articles/joshitsuki-hikaku.html)を参照 |
| [monitor-arm-desk-check](articles/monitor-arm-desk-check.html) | 2026-09-18 | 2026-09-18 | 2026-12-17 | 購入前ガイド記事(取り付け可否チェック)。EN版なし(hreflangはja+x-defaultのみ)。製品比較は[monitor-arm-hikaku](articles/monitor-arm-hikaku.html)を参照 |
| [cordless-vacuum-paperpack-cyclone](articles/cordless-vacuum-paperpack-cyclone.html) | 2026-09-18 | 2026-09-18 | 2026-12-17 | 購入前ガイド記事(方式比較)。EN版なし(hreflangはja+x-defaultのみ)。製品比較は[cordless-vacuum-hikaku](articles/cordless-vacuum-hikaku.html)を参照 |

新しい記事を追加したら、この表にも1行追加すること。
