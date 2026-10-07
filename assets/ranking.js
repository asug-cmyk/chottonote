// 詳細ページ等を開いたとき、前のスクロール位置を引き継がず先頭から表示する
try{if(!location.hash){history.scrollRestoration='manual';window.scrollTo({top:0,behavior:'instant'});window.addEventListener('load',function(){if(!location.hash)window.scrollTo({top:0,behavior:'instant'})});}}catch(e){}
// スコア表の並べ替え（試作）。JS が無効でも表は総合順のまま読める。
(function(){var t=document.getElementById('rk-score-table');if(!t)return;
var tb=t.tBodies[0],btns=document.querySelectorAll('.rk-sort button');
btns.forEach(function(b){b.addEventListener('click',function(){var k=b.dataset.key;
btns.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
var rows=[].slice.call(tb.rows).filter(function(r){return r.dataset[k]!==undefined});
var pend=[].slice.call(tb.rows).filter(function(r){return r.dataset[k]===undefined});
rows.sort(function(a,b2){return parseFloat(b2.dataset[k])-parseFloat(a.dataset[k])});
rows.forEach(function(r,i){var c=r.querySelector('.rk-rank');if(c){c.textContent=i+1;c.className='rk-rank r'+(i+1)}tb.appendChild(r)});
pend.forEach(function(r){tb.appendChild(r)});})});})();

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
