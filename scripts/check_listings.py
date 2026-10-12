#!/usr/bin/env python3
"""記事が「どこかの一覧から抜け落ちる」のを止める検査。

2026-09-25 に追加。きっかけは2つ:

1. 公開中の記事3本が**トップページから抜けていた**。ファイルもsitemapもあるのに
   トップページにだけ無く、誰も気づかないまま公開されていた（うち2本は収益記事）。
2. marketing が同じ日に、**食い違う記録を根拠にして2回間違えた**。
   「同じ穴が blog 側にもあるのでは」という指摘を受けて測ったら、実際にあった。

記事の所在を示す場所が4つ（ファイル本体・sitemap・トップページ・カテゴリページ）あり、
**どれか1つだけずれても誰も気づかない**のが原因。そこをここで突き合わせる。

さらに 2026-09-25 から、**HP の Blog ページがこのブログの sitemap とカテゴリページを
毎朝読んでカードを自動生成している**（D-HP-011）。カテゴリページの構造が崩れると
HP 側が止まって新しい記事が載らなくなるので、その構造もここで守る。

2026-10-12 追記: 2026-10-07 のテンプレ刷新（90efcf8）で、比較（hikaku）記事の下に
商品詳細ページ articles/<category>-hikaku/<brand-model>.html が追加された。これは
sitemap.xml には載るが、index.html・カテゴリページには載らない（読者はランキング記事
自体のリンクから詳細ページへ進む設計。index/カテゴリが直接リンクするのはランキング
記事そのものだけ）。そのため、トップレベルの記事とネストした商品詳細ページを分けて
突き合わせる。

使い方:
    python3 scripts/check_listings.py
終了コード 0 = 問題なし / 1 = 問題あり（内容を標準出力に出す）
"""
import glob
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FAIL = []


def fail(msg):
    FAIL.append(msg)


def read(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
        return f.read()


def article_links(html, en):
    """そのページが指している記事ファイル名の集合。"""
    prefix = r'/en/articles/' if en else r'/articles/'
    names = set(re.findall(prefix + r'([a-z0-9\-]+\.html)', html))
    if not en:
        # 日本語ページから英語記事への言語切り替えリンクは数えない
        names -= set(re.findall(r'/en/articles/([a-z0-9\-]+\.html)', html))
    return names


def check_side(en):
    label = '英語' if en else '日本語'
    adir = 'en/articles' if en else 'articles'
    index = 'en/index.html' if en else 'index.html'
    cats = sorted(glob.glob(os.path.join(ROOT, 'en/category-*.html' if en
                                         else 'category-*.html')))
    base = 'https://blog.asdevstudio.com/' + ('en/' if en else '')

    adir_abs = os.path.join(ROOT, adir)
    # トップレベルの記事（ランキング記事・情報記事）。index/カテゴリページが
    # 直接リンクするのはこれだけ。
    files_top = {os.path.basename(p) for p in
                 glob.glob(os.path.join(adir_abs, '*.html'))}
    # ランキング記事の下にある商品詳細ページ（<category>-hikaku/<brand-model>.html）。
    # sitemap には載るが、index/カテゴリページには載らない（ランキング記事自身の
    # リンクから進む設計）。
    files_nested = {os.path.relpath(p, adir_abs) for p in
                     glob.glob(os.path.join(adir_abs, '*', '*.html'))}
    files_all = files_top | files_nested
    if not files_all:
        fail(f'{label}: {adir}/ に記事が1本も無い（検査の前提が崩れている）')
        return

    sitemap = read('sitemap.xml')
    locs = set(re.findall(r'<loc>([^<]+)</loc>', sitemap))
    in_sitemap = {u[len(base + 'articles/'):] for u in locs
                  if u.startswith(base + 'articles/')}

    in_index = article_links(read(index), en)

    in_cat = set()
    for c in cats:
        in_cat |= article_links(open(c, encoding='utf-8').read(), en)

    # sitemap.xml はトップレベル記事・商品詳細ページの両方を載せる（クローラーが
    # 直接ここから見つけられる必要がある）。
    missing = sorted(files_all - in_sitemap)
    if missing:
        fail(f'{label}: 記事ファイルはあるのに sitemap.xml に載っていない: {missing}')
    ghost = sorted(in_sitemap - files_all)
    if ghost:
        fail(f'{label}: sitemap.xml が指している記事ファイルが存在しない: {ghost}')

    # index.html・カテゴリページはトップレベル記事だけを直接リンクする（商品詳細
    # ページはランキング記事自身のリンクから読者が進む）。
    for name, where in ((index, in_index), ('カテゴリページ', in_cat)):
        missing = sorted(files_top - where)
        if missing:
            fail(f'{label}: 記事ファイルはあるのに {name} に載っていない: {missing}')
        ghost = sorted(where - files_top)
        if ghost:
            fail(f'{label}: {name} が指している記事ファイルが存在しない: {ghost}')

    # HP がカテゴリページを読むので、sitemap にカテゴリページ自身も要る
    for c in cats:
        url = base + os.path.basename(c)
        if url not in locs:
            fail(f'{label}: カテゴリページが sitemap に無い: {url}'
                 f'（HP の自動カード生成がこれを読む）')

    # HP が読む構造（D-HP-011）
    for c in cats:
        html = open(c, encoding='utf-8').read()
        rel = os.path.relpath(c, ROOT)
        if '<section class="article-group' not in html:
            fail(f'{rel}: <section class="article-group"> が無い'
                 f'（HP の自動カード生成がこれを読む）')
        n_art = len(re.findall(r'<h3><a href="/(?:en/)?articles/', html))
        n_exc = len(re.findall(r'<p class="excerpt">', html))
        if n_art != n_exc:
            fail(f'{rel}: 記事の見出し {n_art} 件に対して説明文（excerpt）が {n_exc} 件。'
                 f'数が合わない（HP はこの説明文をカードに使う）')


def main():
    check_side(en=False)
    check_side(en=True)
    if FAIL:
        print('FAIL  一覧の食い違いが見つかりました')
        for f in FAIL:
            print('   -', f)
        return 1
    print('PASS  記事・sitemap・トップページ・カテゴリページはすべて一致しています')
    return 0


if __name__ == '__main__':
    sys.exit(main())
