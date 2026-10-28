/* Writing Focus — student-facing lesson panel, art slots and lesson Present mode.
   Art: images/focus/t1/t1w01.webp (week), images/focus/t1/t1-cover.webp (term),
        images/focus/shared/f-ido.webp etc. (.webp, .png or .jpg all work). */
(function(){
  var EXTS=["webp","png","jpg"];
  var known={};
  function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
  function pad(n){return n<10?"0"+n:""+n;}

  /* ---------- art ---------- */
  function weekArt(T,W){return "images/focus/t"+T+"/t"+T+"w"+pad(W);}
  function termArt(T){return "images/focus/t"+T+"/t"+T+"-cover";}
  function shared(n){return "images/focus/shared/"+n;}
  function fail(img){
    var base=img.getAttribute("data-base"), i=+(img.getAttribute("data-try")||0)+1;
    if(i<EXTS.length){img.setAttribute("data-try",i);img.src=base+"."+EXTS[i];}
    else{known[base]=null;if(img.parentNode)img.parentNode.classList.add("empty");}
  }
  function ok(img){ known[img.getAttribute("data-base")]=img.getAttribute("src"); }
  function art(base,cls,ico){
    var k=known[base], empty=(k===null), name=base.split("/").pop();
    return '<div class="wf-art '+(cls||"")+(empty?" empty":"")+'">'+
      (empty?'':'<img alt="" data-base="'+base+'" data-try="'+(k?EXTS.length:0)+'" src="'+(k||base+"."+EXTS[0])+'" onload="WFUI._ok(this)" onerror="WFUI._fail(this)">')+
      '<div class="wf-empty"><span class="ico">'+(ico||"🖼️")+'</span><span class="lbl">Image to come</span><span class="fn">'+name+'</span></div></div>';
  }

  /* ---------- student panel on the lesson page ---------- */
  function kid(T,W,D){ var t=(window.__WF_KIDS||{})[T]; return t&&t[W]&&t[W][D]; }
  function kidsPanel(k){
    if(!k) return '';
    return '<section class="wf-kids" id="kids"><div class="wf-kids__head"><h2>FOR STUDENTS</h2><span>what we’re doing today, in plain words</span>'+
      '<button class="tbtn tbtn--present" id="pPresent2">▶ Present to the class</button></div>'+
      '<div class="wf-kids__learn"><div class="k">Today we are learning to…</div><div class="l">'+esc(k.l)+'</div>'+
      '<div class="y"><b>Why?</b> '+esc(k.y)+'</div></div>'+
      '<div class="wf-kids__grid"><div class="wf-kids__col"><div class="wf-kids__lbl">✅ I CAN…</div><ul class="wf-ican">'+
        k.s.map(function(x){return '<li>'+esc(x.replace(/^I can\s*/i,""))+'</li>';}).join("")+'</ul>'+
        (k.k&&k.k.length?'<div class="wf-words">'+k.k.map(function(w){return '<div class="wf-word"><b>'+esc(w[0])+'</b> — '+esc(w[1])+'</div>';}).join("")+'</div>':'')+
      '</div><div class="wf-kids__col"><div class="wf-kids__lbl">✏️ WHAT WE WILL DO</div><ol class="wf-steps">'+
        k.d.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ol></div></div>'+
      '<div class="wf-close"><b>BEFORE WE GO:</b> '+esc(k.c)+'</div></section>';
  }
  function kidsPrint(k){
    if(!k) return '';
    return '<div class="pr-box"><h3>For students</h3><div><b>Today we are learning to</b> '+esc(k.l)+'</div><div><i>Why: '+esc(k.y)+'</i></div>'+
      '<div class="pr-label">I can…</div><ul>'+k.s.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ul>'+
      '<div class="pr-label">What we will do</div><ol>'+k.d.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ol>'+
      (k.k&&k.k.length?'<div class="pr-label">Key words</div><div>'+k.k.map(function(w){return '<b>'+esc(w[0])+'</b> — '+esc(w[1]);}).join(" · ")+'</div>':'')+
      '<div class="pr-label">Before we go</div><div>'+esc(k.c)+'</div></div>';
  }

  /* ---------- deck runner (1920×1080, scaled) ---------- */
  function deck(slides, extraCls){
    var wrap=document.createElement("div"); wrap.className="wpp "+(extraCls||"");
    wrap.innerHTML='<div class="wpp__stage"><div class="wpp__bg"></div><div class="wpp__layer"></div><div class="wpp__chrome">'+
      '<div class="wpp__prog"><i></i></div><div class="wpp__count"></div>'+
      '<div class="wpp__ctrl"><button data-a="prev">◀</button><button data-a="next">▶</button><button data-a="full">⛶</button><button data-a="exit">✕ Exit</button></div></div></div>';
    document.body.appendChild(wrap);
    var stage=wrap.querySelector(".wpp__stage"), layer=wrap.querySelector(".wpp__layer"), bg=wrap.querySelector(".wpp__bg");
    var idx=0, tick=null;
    function fit(){var s=Math.min(innerWidth/1920,innerHeight/1080);stage.style.transform="scale("+s+") translate(-50%,-50%)";}
    function stopTimer(){ if(tick){clearInterval(tick);tick=null;} }
    function wireTimer(){
      [].forEach.call(layer.querySelectorAll(".timer"),function(t){wireOne(t);});
      fitAll();
    }
    function fitAll(){
      [].forEach.call(layer.querySelectorAll(".fit"),function(el){
        var fs=parseFloat(getComputedStyle(el).fontSize), n=0;
        while(el.scrollHeight>el.clientHeight+2 && fs>20 && n<40){fs-=2;el.style.fontSize=fs+"px";n++;}
      });
    }
    function wireOne(t){
      var left=+t.getAttribute("data-secs"), run=false, num=t.querySelector("span");
      function show(){var m=Math.floor(left/60),s=left%60;num.textContent=m+":"+(s<10?"0":"")+s;}
      show();
      t.addEventListener("click",function(e){
        e.stopPropagation();
        if(t.classList.contains("done")){left=+t.getAttribute("data-secs");t.classList.remove("done");show();return;}
        run=!run; t.querySelector("small").textContent=run?"tap to pause":"tap to start";
        stopTimer();
        if(run) tick=setInterval(function(){ left--; show(); if(left<=0){stopTimer();run=false;t.classList.add("done");t.querySelector("small").textContent="time! tap to reset";} },1000);
      });
    }
    function show(i,all){
      stopTimer();
      idx=Math.max(0,Math.min(slides.length-1,i));
      var sl=slides[idx]; bg.style.setProperty("--c",sl.c||"#a855f7");
      layer.innerHTML='<div class="wpp__slide">'+sl.html+'</div>';
      if(all)[].forEach.call(layer.querySelectorAll(".rv"),function(e){e.classList.add("on");});
      wrap.querySelector(".wpp__prog i").style.width=((idx+1)/slides.length*100)+"%";
      wrap.querySelector(".wpp__count").textContent=(idx+1)+" / "+slides.length;
      wireTimer();
    }
    function next(){var r=layer.querySelector(".rv:not(.on)");if(r){r.classList.add("on");return;}if(idx<slides.length-1)show(idx+1);}
    function prev(){if(idx>0)show(idx-1,true);}
    function exit(){stopTimer();removeEventListener("resize",fit);document.removeEventListener("keydown",key,true);if(document.fullscreenElement)document.exitFullscreen().catch(function(){});wrap.remove();}
    function full(){if(document.fullscreenElement)document.exitFullscreen();else if(wrap.requestFullscreen)wrap.requestFullscreen().catch(function(){});}
    function key(e){
      e.stopPropagation(); var k=e.key;
      if(k==="ArrowRight"||k===" "||k==="PageDown"||k==="Enter"){e.preventDefault();next();}
      else if(k==="ArrowLeft"||k==="PageUp"){e.preventDefault();prev();}
      else if(k==="Escape")exit(); else if(k==="f"||k==="F")full();
    }
    wrap.addEventListener("click",function(e){
      var b=e.target.closest("button[data-a]");
      if(b){var a=b.getAttribute("data-a");if(a==="prev")prev();else if(a==="next")next();else if(a==="full")full();else exit();return;}
      next();
    });
    var tx=null;
    wrap.addEventListener("touchstart",function(e){tx=e.touches[0].clientX;},{passive:true});
    wrap.addEventListener("touchend",function(e){if(tx==null)return;var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50){dx<0?next():prev();}tx=null;});
    document.addEventListener("keydown",key,true);
    addEventListener("resize",fit);fit();show(0);
  }

  /* ---------- lesson slides ---------- */
  function strip(t){return String(t||"").replace(/^(I Do|We Do|You Do)\s*—\s*/,"");}
  function presentLesson(ctx){
    var T=ctx.T,W=ctx.W,D=ctx.D,data=ctx.data,wk=data.weeks[W],day=wk.days[D],k=kid(T,W,D)||{l:day.walt.replace(/^We are learning to\s*/i,""),y:"",s:[],d:[],c:day.close};
    var st=data.process.stages[(day.process.stage||1)-1];
    var BLUE="#3b82f6",GREEN="#10b981",ORANGE="#f97316";
    var S=[];
    S.push({c:"#a855f7",html:art(weekArt(T,W),"s-art kb","✍️")+
      '<div class="s-title"><div class="k">Term '+T+' · Week '+W+' · '+esc(D)+'</div>'+
      '<h1 style="font-size:'+(day.focus.length>34?110:140)+'px">'+esc(day.focus)+'</h1>'+
      '<span class="stage-chip" style="background:'+st.colour+'">'+st.icon+' STAGE '+st.n+' · '+st.key+'</span></div>'});
    S.push({c:"#FFD36B",html:art(shared("f-learn"),"s-art kb","💡")+'<div class="s-learn"><div class="k">Today we are learning to…</div><div class="lbig">'+esc(k.l)+'</div>'+
      (k.y?'<div class="why rv"><b>WHY?</b><span>'+esc(k.y)+'</span></div>':'')+'</div>'});
    if(k.s&&k.s.length) S.push({c:"#7CE38B",html:'<div class="s-head">SUCCESS LOOKS LIKE… I CAN</div><div class="s-list ican">'+
      k.s.map(function(x){return '<div class="it rv"><i>✔</i><span>'+esc(x)+'</span></div>';}).join("")+'</div>'});
    if(k.d&&k.d.length) S.push({c:BLUE,html:'<div class="s-head">WHAT WE WILL DO TODAY</div><div class="s-list">'+
      k.d.map(function(x,i){return '<div class="it rv" style="--c:'+[BLUE,GREEN,ORANGE,ORANGE,ORANGE][i]+'"><i>'+(i+1)+'</i><span>'+esc(x)+'</span></div>';}).join("")+'</div>'});
    S.push({c:st.colour,html:'<div class="s-here"><div class="big">HANDS UP!</div><div class="sub">Which stage are we in?</div>'+
      '<div class="ans rv" style="background:'+st.colour+'">STAGE '+st.n+' · '+st.key+'</div><div class="sub rv">“'+esc(st.question)+'”</div></div>'});
    var sc=((window.__WF_SCRIPT||{})[T]||{})[W]; sc=sc&&sc[D];
    function say(t){return t?'<div class="tsay rv"><b>TEACHER</b><span>'+esc(t)+'</span></div>':'';}
    // ---------- I Do ----------
    var model=(sc&&sc.i&&sc.i.m)||(day.iDo.example&&!/^\[/.test(day.iDo.example)?day.iDo.example:"");
    S.push({c:BLUE,html:'<div class="s-phase" style="--c:'+BLUE+'">'+art(shared("f-ido"),"kb","👁")+'<div class="r">'+
      '<div class="ph">WATCH ME</div><div class="pt">'+esc(strip(day.iDo.title))+'</div>'+
      (sc&&sc.i?sc.i.s.map(say).join(""):'')+
      (model?'<div class="model rv fit">'+esc(model)+'</div>':'')+
      (!sc&&day.iDo.tip?'<div class="tip rv"><span>💡</span><span>'+esc(day.iDo.tip)+'</span></div>':'')+'</div></div>'});
    if(sc&&sc.i&&sc.i.t&&sc.i.t.length){
      S.push({c:BLUE,html:'<div class="s-head">WHY DID THAT WORK?</div><div class="s-why">'+
        sc.i.t.map(function(x,i){return '<div class="it rv"><i>'+(i+1)+'</i><span>'+esc(x)+'</span></div>';}).join("")+
        (day.iDo.tip&&!sc.i.t.some(function(x){var n=function(v){return v.toLowerCase().replace(/[^a-z ]/g,'');};return n(x).indexOf(n(day.iDo.tip).slice(0,30))>-1;})?'<div class="rule rv"><b>REMEMBER</b><span>'+esc(day.iDo.tip)+'</span></div>':'')+'</div>'});
    }
    // ---------- We Do ----------
    if(sc&&sc.w&&sc.w.length){
      S.push({c:GREEN,html:'<div class="s-phase" style="--c:'+GREEN+'">'+art(shared("f-wedo"),"kb","🤝")+'<div class="r">'+
        '<div class="ph">TOGETHER</div><div class="pt">'+esc(strip(day.weDo.title))+'</div>'+
        say(sc.wi||day.weDo.instruction)+
        '<div class="ask rv">🗣 For each question: think → tell your partner → share. Then we look at a strong answer.</div></div></div>'});
      sc.w.forEach(function(x,i){
        S.push({c:GREEN,html:'<div class="s-head">TOGETHER · '+(i+1)+' OF '+sc.w.length+'</div><div class="s-we">'+
          '<div class="qrow"><div class="q fit">'+esc(x[0])+'</div>'+
          '<div class="talk"><span>💬 Turn and talk</span><div class="timer mini" data-secs="30"><span></span><small>tap</small></div></div></div>'+
          '<div class="ans rv"><b>A STRONG ANSWER</b><div class="fit">'+esc(x[1])+'</div></div>'+
          '<div class="why rv"><b>WHY IT WORKS</b><div class="fit">'+esc(x[2])+'</div></div></div>'});
      });
    } else {
      var qs=(day.weDo.sentences||[]).slice(0,5);
      S.push({c:GREEN,html:'<div class="s-phase" style="--c:'+GREEN+'">'+art(shared("f-wedo"),"kb","🤝")+'<div class="r">'+
        '<div class="ph">TOGETHER</div><div class="pt">'+esc(strip(day.weDo.title))+'</div>'+
        (qs.length?'<div class="qs">'+qs.map(function(q){return '<div class="rv">'+esc(q)+'</div>';}).join("")+'</div>':'')+
        (day.weDo.prompt?'<div class="ask rv">💬 '+esc(day.weDo.prompt)+'</div>':'')+'</div></div>'});
    }
    // ---------- You Do ----------
    var yd=(k.d||[]).slice(2); if(!yd.length) yd=(day.youDo.tasks||[]).slice(0,4);
    var bonus=(day.youDo.tasks||[]).filter(function(t){return /^✦/.test(t);}).slice(0,1);
    if(sc&&sc.y&&sc.y.e){
      S.push({c:ORANGE,html:'<div class="s-head">BEFORE YOU START: WHAT A GOOD ONE LOOKS LIKE</div><div class="s-eg">'+
        say(sc.y.s)+'<div class="eg rv fit">'+esc(sc.y.e)+'</div>'+
        '<div class="why rv"><b>WHY IT’S GOOD</b><div class="fit">'+esc(sc.y.w)+'</div></div></div>'});
    }
    S.push({c:ORANGE,html:'<div class="s-phase" style="--c:'+ORANGE+'">'+art(shared("f-youdo"),"kb","✍️")+'<div class="r">'+
      '<div class="ph">YOUR TURN</div><div class="pt">'+esc(strip(day.youDo.title))+'</div>'+
      '<div class="qs">'+yd.concat(bonus).map(function(q){return '<div class="rv">'+esc(q)+'</div>';}).join("")+'</div>'+
      (day.youDo.mins?'<div class="timer" data-secs="'+(day.youDo.mins*60)+'"><span></span><small>tap to start</small></div>':'')+'</div></div>'});
    if(k.k&&k.k.length) S.push({c:"#FF5A4F",html:'<div class="s-head">KEY WORDS</div><div class="s-words">'+
      k.k.map(function(w){return '<div class="w rv"><b>'+esc(w[0])+'</b><span>'+esc(w[1])+'</span></div>';}).join("")+'</div>'});
    var cq=(sc&&sc.c)?sc.c:null;
    S.push({c:"#a855f7",html:art(shared("f-close"),"s-art","⭐")+'<div class="s-close"><div class="ttl">BEFORE WE GO…</div><div class="q rv">'+esc(cq?cq[0]:k.c)+'</div>'+
      (cq&&cq[1]?'<div class="sample rv"><b>FOR EXAMPLE</b> '+esc(cq[1])+'</div>':'')+'</div>'});
    deck(S,"wfp");
  }

  window.WFUI={art:art,weekArt:weekArt,termArt:termArt,shared:shared,kid:kid,kidsPanel:kidsPanel,kidsPrint:kidsPrint,presentLesson:presentLesson,_fail:fail,_ok:ok};
})();
