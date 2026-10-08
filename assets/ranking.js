// 詳細ページ等を開いたとき、前のスクロール位置を引き継がず先頭から表示する
try{if(!location.hash){history.scrollRestoration='manual';if(window.scrollY>0)window.scrollTo({top:0,behavior:'instant'});window.addEventListener('load',function(){if(!location.hash&&window.scrollY>0)window.scrollTo({top:0,behavior:'instant'})});}}catch(e){}
// スコア表の並べ替え。ボタンと、表の見出し（総合・各項目）のどちらからでも並べ替えられる。JS が無効でも表は総合順のまま読める。
// 順位の列は「総合の順位」のまま変えない（項目別に並べ替えても、順位の数字は動かない）。
(function(){var t=document.getElementById('rk-score-table');if(!t)return;
var tb=t.tBodies[0],btns=[].slice.call(document.querySelectorAll('.rk-sort button')),ths=[].slice.call(t.querySelectorAll('.rk-th-sort'));
function sortBy(k,dir){
  var all=[].slice.call(tb.rows),has=all.filter(function(r){return r.dataset[k]!==undefined}),no=all.filter(function(r){return r.dataset[k]===undefined});
  has.sort(function(a,b){var d=parseFloat(a.dataset[k])-parseFloat(b.dataset[k]);if(dir!=='asc')d=-d;return d||(parseFloat(b.dataset.total)-parseFloat(a.dataset.total))});
  has.concat(no).forEach(function(r){tb.appendChild(r)});
  btns.forEach(function(x){x.setAttribute('aria-pressed',x.dataset.key===k?'true':'false')});
  ths.forEach(function(x){x.parentNode.setAttribute('aria-sort',x.dataset.key===k?(dir==='asc'?'ascending':'descending'):'none')});
}
btns.forEach(function(b){b.addEventListener('click',function(){sortBy(b.dataset.key,b.dataset.dir||'desc')})});
ths.forEach(function(b){b.addEventListener('click',function(){sortBy(b.dataset.key,'desc')})});
sortBy('total','desc');
})();

// 2〜3商品の選択比較（表の「比較に追加」にチェック → 表の下に並べて表示。最大3商品、4つ目はチェックできない）。
(function(){
  var dataEl=document.getElementById('rk-cmp-data'),view=document.getElementById('rk-cmp-view');if(!dataEl||!view)return;
  var D;try{D=JSON.parse(dataEl.textContent)}catch(e){return}
  var boxes=[].slice.call(document.querySelectorAll('.rk-cmp-box')),msg=document.getElementById('rk-cmp-msg'),MAX=3;
  function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
  function selected(){return boxes.filter(function(b){return b.checked}).map(function(b){return b.dataset.model})}
  function render(){
    var sel=selected();view.textContent='';
    boxes.forEach(function(b){b.disabled=!b.checked&&sel.length>=MAX});
    msg.textContent=sel.length>=MAX?D.ui.cmp_max:(sel.length===1?D.ui.cmp_one:'');
    if(sel.length<2)return;
    var it=sel.map(function(m){return D.items[m]}),wrap=el('div','rk-cmp-wrap'),tbl=el('table','rk-cmp-table'),cap=el('caption','sr-only');
    var th=el('thead'),tr=el('tr');tr.appendChild(el('th'));
    sel.forEach(function(m,i){
      var x=it[i],h=el('th'),img=el('img');img.src=x.img;img.alt=x.name;img.width=72;img.height=72;img.loading='lazy';
      var a=el('a',null,x.name);a.href=x.url;var rm=el('button','rk-cmp-rm',D.ui.cmp_remove);rm.type='button';rm.setAttribute('aria-label',D.ui.cmp_remove+': '+x.name);
      rm.addEventListener('click',function(){var b=boxes.filter(function(c){return c.dataset.model===m})[0];if(b){b.checked=false;render()}});
      h.scope='col';h.appendChild(img);h.appendChild(a);h.appendChild(document.createElement('br'));h.appendChild(rm);tr.appendChild(h)});
    th.appendChild(tr);tbl.appendChild(th);
    var tb=el('tbody');
    function row(label,vals,cls){var r=el('tr',cls),c=el('th',null,label);c.scope='row';r.appendChild(c);vals.forEach(function(v){r.appendChild(el('td',null,v))});tb.appendChild(r)}
    row(D.ui.crit_total,it.map(function(x){return x.total}),'rk-cmp-total');
    it[0].sc.forEach(function(c,i){row(c[0],it.map(function(x){var v=x.sc[i]&&x.sc[i][1];return v==null?D.ui.dash:v+' / 5'}))});
    var labels=[];it.forEach(function(x){x.rows.forEach(function(r){if(labels.indexOf(r[0])<0)labels.push(r[0])})});
    labels.forEach(function(l){row(l,it.map(function(x){var f=x.rows.filter(function(r){return r[0]===l})[0];return f?f[1]:D.ui.dash}))});
    tbl.appendChild(tb);wrap.appendChild(tbl);view.appendChild(wrap);
    var clr=el('button','rk-cmp-clear',D.ui.cmp_clear);clr.type='button';clr.addEventListener('click',function(){boxes.forEach(function(b){b.checked=false});render()});view.appendChild(clr);
  }
  boxes.forEach(function(b){b.addEventListener('change',function(){if(selected().length>MAX){b.checked=false}render()})});
  render();
})();

// ナビゲーション: 目次を折りたたみにする（スマホは閉じる、PCは開く）／いま見ている節を強調／ページ先頭へ戻るボタン
(function(){
  var body=document.querySelector('.rk-wrap');if(!body)return;
  var toc=body.querySelector('nav.toc');
  if(toc&&!toc.closest('details')){
    var d=document.createElement('details'),s=document.createElement('summary'),ti=toc.querySelector('.toc-title');
    d.className='rk-toc';s.textContent=ti?ti.textContent:'目次';d.appendChild(s);toc.parentNode.insertBefore(d,toc);d.appendChild(toc);
  }
  var links=[].slice.call(document.querySelectorAll('.rk-subnav a')),secs=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))});
  var top=document.querySelector('.rk-totop'),tick=false;
  function upd(){tick=false;var y=window.pageYOffset,cur=-1;
    secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<200)cur=i});
    links.forEach(function(a,i){var on=i===cur;a.classList.toggle('is-current',on);if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});
    if(top)top.hidden=y<700;}
  window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd();
  if(top)top.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});var h=document.querySelector('h1');if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}});
})();

// 商品詳細ポップアップ（一覧ページ上でだけ有効）。
// 詳細ページは単体のページとしてそのまま存在する（検索・共有・JS無効でも開ける）。一覧でクリックしたときだけ、
// そのページの本文を取り出して一覧の上に重ねる。アドレスも詳細ページのものに変わり、戻る操作で閉じる。
(function(){
  if(!document.getElementById('rk-score-table'))return;
  var re=/\/articles\/[a-z0-9-]+\/[a-z0-9-]+\.html$/, modal, body, opener, listUrl=location.href;
  function build(){
    if(modal)return;
    modal=document.createElement('div');modal.className='rk-modal';modal.hidden=true;
    modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','商品詳細');
    modal.innerHTML='<div class="rk-modal-panel"><div class="rk-modal-bar"><span>商品詳細</span><button type="button" class="rk-modal-x" aria-label="閉じる">×</button></div><div class="rk-modal-body"></div></div>';
    document.body.appendChild(modal);body=modal.querySelector('.rk-modal-body');
    modal.addEventListener('click',function(e){
      if(e.target===modal||e.target.closest('.rk-modal-x')||e.target.closest('[data-rk-close]')){e.preventDefault();close();}
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!modal.hidden)close();});
    window.addEventListener('popstate',function(){hide();});
  }
  function abs(root,base){ // 取り出した本文の相対パスを、取り出し元ページ基準で解決する
    [].forEach.call(root.querySelectorAll('[src],[href]'),function(el){
      ['src','href'].forEach(function(a){var v=el.getAttribute(a);if(v&&v.charAt(0)!=='#'&&!/^(https?:|mailto:)/.test(v))el.setAttribute(a,new URL(v,base).href);});
    });
  }
  function hide(){if(!modal||modal.hidden)return;modal.hidden=true;document.documentElement.classList.remove('rk-lock');if(opener&&opener.focus)try{opener.focus()}catch(e){}}
  function close(){var pushed=history.state&&history.state.rk;if(pushed){try{history.back();return}catch(e){}}hide();}
  function open(url){
    build();
    fetch(url).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(t){
      var d=new DOMParser().parseFromString(t,'text/html'),c=d.querySelector('.rk-detail');if(!c)throw 0;
      var wrap=document.createElement('div');wrap.className='article-body rk-wrap';wrap.innerHTML=c.innerHTML;abs(wrap,url);
      body.innerHTML='';body.appendChild(wrap);
      modal.hidden=false;document.documentElement.classList.add('rk-lock');body.scrollTop=0;
      try{history.pushState({rk:1},'',url)}catch(e){}
      modal.querySelector('.rk-modal-x').focus();
    }).catch(function(){location.href=url;});
  }
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;
    var a=e.target.closest&&e.target.closest('a[href]');if(!a||a.target==='_blank'||!re.test(a.pathname))return;
    e.preventDefault();opener=a;open(a.href);
  });
})();
