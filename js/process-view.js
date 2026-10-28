/* Writing Focus — "Our Writing Process" view, present mode and A4 wall cards.
   Art lives in images/process/v2/<name>.webp|.png|.jpg — drop a file in with the exact name and it appears.
   Until then each slot shows an "Image to come" box with the file name. */
(function(){
  var BASE = "images/process/v2/";
  var EXTS = ["webp","png","jpg"];
  var KEYS = ["fill","find","shape","share"];
  var ICON = {FILL:"🪣",FIND:"🎯",SHAPE:"🔍",SHARE:"🎁"};
  var known = {};   // name -> url | null

  function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

  /* ---------- image probing ---------- */
  function probe(name){
    if(known.hasOwnProperty(name)) return Promise.resolve(known[name]);
    return new Promise(function(res){
      var i=0;
      (function next(){
        if(i>=EXTS.length){ known[name]=null; return res(null); }
        var url=BASE+name+"."+EXTS[i++], im=new Image();
        im.onload=function(){ known[name]=url; res(url); };
        im.onerror=next; im.src=url;
      })();
    });
  }
  function fail(img){
    var name=img.getAttribute("data-name"), i=+(img.getAttribute("data-try")||0)+1;
    if(i<EXTS.length){ img.setAttribute("data-try",i); img.src=BASE+name+"."+EXTS[i]; }
    else { known[name]=null; if(img.parentNode) img.parentNode.classList.add("empty"); }
  }
  function art(name, cls, ico){
    var k=known[name];
    var src = k ? k : BASE+name+"."+EXTS[0];
    var empty = (k===null);
    return '<div class="wp-art '+(cls||"")+(empty?" empty":"")+'" data-art="'+name+'">'+
      (empty?'':'<img alt="" data-name="'+name+'" data-try="'+(k?EXTS.length:0)+'" src="'+src+'" onerror="WP._fail(this)">')+
      '<div class="wp-empty"><span class="ico">'+(ico||"🖼️")+'</span><span class="lbl">Image to come</span><span class="fn">'+name+'</span></div></div>';
  }
  function stageArt(s){ return "wp-stage-"+s.key.toLowerCase(); }
  function handArt(s){ return "wp-hands-"+s.key.toLowerCase(); }
  function col(s){ return "--c:"+s.colour; }
  function hereStage(ctx){
    var wk=ctx.data.weeks[ctx.W], day=wk&&wk.days&&wk.days[ctx.D];
    return (day&&day.process&&day.process.stage)||wk.stageNum||1;
  }
  function chantResp(r, stages){
    // colour the stage word inside "… — I FILL!"
    var out=esc(r);
    stages.forEach(function(s){ out=out.replace(new RegExp("\\b"+s.key+"\\b"),'<em style="'+col(s)+'">'+s.key+'</em>'); });
    return out;
  }

  /* ---------- cycle diagram (inline SVG) ---------- */
  function cycleSVG(stages, big){
    var xs=[80,240,400,560], y=200, r=60;
    var h='<svg viewBox="0 20 640 270" role="img" aria-label="FILL, then FIND, then SHAPE and SHARE loop round until the writing is ready">'+
      '<defs><marker id="wpArr'+(big?1:0)+'" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="'+(big?"#FFD36B":"#0B0B0F")+'"/></marker></defs>';
    var ink=big?"#FFD36B":"#0B0B0F", txt=big?"#F6F1E6":"#0B0B0F";
    for(var i=0;i<3;i++) h+='<line x1="'+(xs[i]+r+4)+'" y1="'+y+'" x2="'+(xs[i+1]-r-8)+'" y2="'+y+'" stroke="'+ink+'" stroke-width="5" marker-end="url(#wpArr'+(big?1:0)+')"/>';
    h+='<path d="M560 '+(y-r-4)+' C 560 40, 400 40, 400 '+(y-r-10)+'" fill="none" stroke="'+ink+'" stroke-width="5" stroke-dasharray="12 8" marker-end="url(#wpArr'+(big?1:0)+')"/>';
    h+='<text x="480" y="44" text-anchor="middle" font-family="Caveat, cursive" font-size="30" fill="'+txt+'">feedback → improve → again!</text>';
    stages.forEach(function(s,i){
      h+='<circle cx="'+xs[i]+'" cy="'+y+'" r="'+r+'" fill="'+s.colour+'" stroke="#0B0B0F" stroke-width="5"/>'+
         '<text x="'+xs[i]+'" y="'+(y+12)+'" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="34" letter-spacing="1.5" fill="#fff" stroke="#0B0B0F" stroke-width="1.2">'+s.key+'</text>'+
         '<text x="'+xs[i]+'" y="'+(y+r+30)+'" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="18" fill="'+txt+'">'+(i+1)+'</text>';
    });
    return h+'</svg>';
  }

  /* ================= PAGE VIEW ================= */
  function render(main, ctx){
    var data=ctx.data, pr=data.process, st=pr.stages, here=hereStage(ctx), hs=st[here-1];
    var h='<div class="wp">';

    // hero
    h+='<section class="wp-hero">'+art("wp-hero","kb","✍️")+'<div class="wp-hero__shade"></div><div class="wp-hero__body">'+
      '<div class="wp-kick">Term '+ctx.T+' · '+esc(data.meta.topic)+' · Our Writing Process</div>'+
      '<h1 class="wp-title">HOW WRITERS WORK</h1>'+
      '<div class="wp-mnemonic">'+st.map(function(s){return '<span style="background:'+s.colour+'">'+s.key+'</span>';}).join("")+'</div>'+
      '<div class="wp-hero__sub">'+esc(pr.mnemonicNote)+'</div>'+
      '<div class="wp-actions">'+
        '<button class="wp-btn primary" id="wpPresent">▶ Present to the class</button>'+
        '<button class="wp-btn" id="wpCardsBW">🖍 Print wall cards (colour-in)</button>'+
        '<button class="wp-btn" id="wpCardsCol">🖨 Print wall cards (colour)</button>'+
        '<button class="wp-btn ghost" id="wpToTeacher">📋 Teacher notes</button>'+
      '</div></div></section>';

    // where are we
    h+='<div class="wp-here" style="'+col(hs)+'"><span class="wp-here__pin">📍 WE ARE HERE</span>'+
      '<div class="wp-here__txt">Week '+ctx.W+', '+esc(ctx.D)+': <b style="color:'+hs.colour+';filter:brightness(.8)">Stage '+hs.n+' — '+hs.key+'.</b> Ask yourself: <b>“'+esc(hs.question)+'”</b></div></div>';

    // overview
    h+='<section class="wp-sec"><div class="wp-h"><h2>FOUR STAGES</h2><p>one question each</p></div><div class="wp-four">'+
      st.map(function(s,i){
        return '<button class="wp-mini'+(s.n===here?" here":"")+'" style="'+col(s)+'" data-go="wpStage'+s.n+'">'+
          art(stageArt(s),"",s.icon)+'<div class="wp-mini__band"></div><div class="wp-mini__body">'+
          '<div class="wp-mini__n">Stage '+s.n+'</div><div class="wp-mini__w">'+s.key+'</div>'+
          '<div class="wp-mini__q">'+esc(s.question)+'</div></div>'+
          (i<3?'<span class="wp-mini__arrow">➜</span>':'')+'</button>';}).join("")+
      '</div></section>';

    // each stage
    st.forEach(function(s){
      h+='<section class="wp-stage" id="wpStage'+s.n+'" style="'+col(s)+'">'+
        '<div class="wp-stage__top">'+art(stageArt(s),"kb",s.icon)+
          '<div class="wp-stage__intro"><div class="wp-stage__n"><i>'+s.n+'</i> Stage '+s.n+' of 4 · '+esc(s.weeks)+'</div>'+
          '<div class="wp-stage__w">'+s.key+'</div>'+
          '<div class="wp-bubble">'+esc(s.question)+'</div>'+
          '<div class="wp-big">'+esc(s.big)+'</div>'+
          '<p class="wp-point">'+esc(s.point)+'</p></div></div>'+
        '<div class="wp-stage__grid"><div class="wp-stage__col">'+
          '<div class="wp-lbl">✏️ WHAT I DO</div><ol class="wp-steps">'+
            s.steps.map(function(x,i){return '<li><b>'+(i+1)+'</b><span>'+esc(x)+'</span></li>';}).join("")+'</ol>'+
          '<div class="wp-notyet"><span class="stamp">NOT YET!</span>'+esc(s.notYet)+'</div>'+
          '<div class="wp-moveon"><span class="tick">✅</span><div><b>Ready to move on when…</b>'+esc(s.moveOn)+'</div></div>'+
        '</div><div class="wp-stage__col">'+
          '<div class="wp-lbl">✋ THE HAND ACTION</div>'+
          '<div class="wp-hands">'+art(handArt(s),"","✋")+'<p><b>'+esc(s.actionShort)+'</b>'+esc(s.action)+'</p></div>'+
          '<div class="wp-term"><div class="wp-term__k">THIS TERM · '+esc(ctx.data.meta.topic).toUpperCase()+'</div><p>'+esc(s.kid)+'</p>'+
          '<div class="wp-tags">'+s.looksLike.map(function(l){return '<span>'+esc(l)+'</span>';}).join("")+'</div></div>'+
        '</div></div></section>';
    });

    // chant
    h+='<section class="wp-sec"><div class="wp-h"><h2>THE CHANT</h2><p>teacher calls · class answers · 20 seconds</p></div>'+
      '<div class="wp-chant">'+art("wp-chant","kb","📣")+'<div class="wp-chant__body">'+
      pr.chant.map(function(c,i){return '<div class="wp-chant__row" style="'+col(st[i])+'"><span class="wp-call">'+esc(c.call)+'</span><span class="wp-resp">'+chantResp(c.response,st)+'</span></div>';}).join("")+
      '<div class="wp-chant__note">Do the hand action on the stage word!</div></div></div></section>';

    // cycle
    h+='<section class="wp-sec"><div class="wp-h"><h2>IT GOES ROUND</h2><p>not just in a straight line</p></div>'+
      '<div class="wp-cycle">'+cycleSVG(st,false)+'<div class="wp-cycle__txt"><p>'+esc(pr.cycle)+'</p>'+art("wp-cycle","","🔁")+'</div></div></section>';

    // analogy
    var an=pr.analogy;
    h+='<section class="wp-sec"><div class="wp-h"><h2>'+esc(an.title).toUpperCase()+'</h2><p>use this if someone can’t explain it</p></div>'+
      '<div class="wp-strip">'+art("wp-analogy-t"+ctx.T,"wp-strip__art","💡")+
      an.parts.map(function(p,i){return '<div class="wp-panel" style="'+col(st[i])+'"><div class="wp-cap">'+st[i].key+'</div><p>'+esc(p)+'</p></div>';}).join("")+
      '<div class="wp-strip__end">'+esc(an.end)+'</div></div></section>';

    // teacher notes
    h+='<details class="wp-teacher" id="wpTeacher"><summary>📋 TEACHER NOTES <small>routine · setup · schedule · assessment</small></summary><div class="wp-teacher__body">'+
      '<h4>Why we teach it</h4><p>'+esc(pr.intro)+'</p>'+
      '<h4>Teacher language for each stage</h4><div class="wp-tl">'+st.map(function(s){
        return '<div style="'+col(s)+'"><b>'+s.icon+' '+s.key+' · '+esc(s.weeks)+'</b>'+esc(s.teacherLang)+'<br><span style="opacity:.6;font-size:.82rem">'+esc(s.acs)+'</span></div>';}).join("")+'</div>';
    if(pr.routine){
      h+='<h4>'+esc(pr.routine.title)+'</h4><p>'+esc(pr.routine.intro)+'</p><ol>'+
        pr.routine.steps.map(function(s){return '<li><b>'+esc(s.label)+'</b><span class="say">'+esc(s.say)+'</span>'+esc(s.do)+'</li>';}).join("")+
        '</ol><p style="margin-top:.6rem"><i>'+esc(pr.routine.note)+'</i></p>';
    }
    if(pr.setup){
      h+='<h4>'+esc(pr.setup.title)+'</h4><ul>'+pr.setup.items.map(function(i){return '<li><b>'+esc(i.thing)+'</b> — '+esc(i.how)+'</li>';}).join("")+
        '</ul><p style="margin-top:.5rem"><b>Tip:</b> '+esc(pr.setup.note)+'</p>';
    }
    h+='<h4>Teaching &amp; recall schedule</h4><table><tr><th>Week</th><th>What happens</th></tr>'+
      pr.schedule.map(function(s){return '<tr><td><b>'+esc(s.w)+'</b></td><td>'+esc(s.what)+'</td></tr>';}).join("")+'</table>';
    h+='<h4>How we make it stick</h4><table><tr><th>Technique</th><th>How it shows up</th></tr>'+
      pr.memoryMoves.map(function(m){return '<tr><td><b>'+esc(m.name)+'</b></td><td>'+esc(m.how)+'</td></tr>';}).join("")+'</table>';
    h+='<h4>The analogy — full teacher version</h4><p>'+esc(an.teacher)+'</p>';
    h+='<h4>The cycle — teacher note</h4><p>'+esc(pr.cycleTeacher)+'</p>';
    h+='<h4>'+esc(pr.assessment.title)+'</h4><p><b>Prompt:</b> '+esc(pr.assessment.prompt)+'</p><p style="margin-top:.4rem"><b>A strong answer…</b></p><ul>'+
      pr.assessment.success.map(function(s){return '<li>'+esc(s)+'</li>';}).join("")+'</ul>';
    h+='</div></details>';

    h+='</div>';
    main.innerHTML=h;

    // wiring
    [].forEach.call(main.querySelectorAll("[data-go]"),function(b){
      b.onclick=function(){document.getElementById(b.getAttribute("data-go")).scrollIntoView({behavior:"smooth",block:"start"});};});
    document.getElementById("wpPresent").onclick=function(){present(ctx);};
    document.getElementById("wpCardsBW").onclick=function(){printCards(ctx,false);};
    document.getElementById("wpCardsCol").onclick=function(){printCards(ctx,true);};
    document.getElementById("wpToTeacher").onclick=function(){var t=document.getElementById("wpTeacher");t.open=true;t.scrollIntoView({behavior:"smooth",block:"start"});};
    allNames(ctx.T).forEach(probe);
  }

  function allNames(T){
    var n=["wp-hero","wp-chant","wp-cycle","wp-analogy-t"+T];
    KEYS.forEach(function(k){n.push("wp-stage-"+k,"wp-hands-"+k);});
    return n;
  }

  /* ================= WALL CARDS ================= */
  function printCards(ctx, colour){
    var st=ctx.data.process.stages;
    Promise.all(st.map(function(s){return probe(stageArt(s));})).then(function(urls){
      var h='<div>'+st.map(function(s,i){
        return '<div class="wc2'+(colour?" colour":"")+'" style="'+col(s)+'">'+
          '<div class="wc2__top"><span>Stage '+s.n+' of 4</span><span>'+s.icon+'</span></div>'+
          '<div class="wc2__w">'+s.key+'</div>'+
          '<div class="wc2__art'+(urls[i]?'':' empty')+'">'+(urls[i]?'<img src="'+urls[i]+'" alt="">':'')+
            '<div class="wp-empty"><span>'+s.icon+'</span><span class="lbl">Image to come</span><span class="fn">'+stageArt(s)+'</span></div></div>'+
          '<div class="wc2__q">'+esc(s.question)+'</div>'+
          '<div class="wc2__steps">'+s.steps.map(function(x,j){return '<div><b>'+(j+1)+'</b>'+esc(x)+'</div>';}).join("")+'</div></div>';
      }).join("")+'</div>';
      ctx.doPrint(h);
    });
  }

  /* ================= PRESENT MODE ================= */
  function present(ctx){
    var data=ctx.data, pr=data.process, st=pr.stages, here=hereStage(ctx), hs=st[here-1];
    var slides=[];
    slides.push({c:"#a855f7", html: art("wp-hero","s-art kb","✍️")+
      '<div class="s-title"><div class="k">Term '+ctx.T+' · '+esc(data.meta.topic)+'</div><h1>HOW WRITERS<br>WORK</h1>'+
      '<div class="chips">'+st.map(function(s){return '<span style="background:'+s.colour+'">'+s.key+'</span>';}).join("")+'</div></div>'});
    slides.push({c:"#3b82f6", html:'<div class="s-head">FOUR STAGES · ONE QUESTION EACH</div><div class="s-four">'+
      st.map(function(s){return '<div class="s-card rv" style="'+col(s)+'">'+art(stageArt(s),"",s.icon)+'<div class="b"><div class="n">Stage '+s.n+'</div><div class="w">'+s.key+'</div><div class="q">'+esc(s.question)+'</div><div class="h">✋ '+esc(s.actionShort)+'</div></div></div>';}).join("")+'</div>'});
    st.forEach(function(s){
      slides.push({c:s.colour, html:'<div class="s-stage" style="'+col(s)+'">'+art(stageArt(s),"kb",s.icon)+
        '<div class="r"><div class="n">Stage '+s.n+' · '+esc(s.big)+'</div><div class="w">'+s.key+'</div><div class="bub">'+esc(s.question)+'</div>'+
        '<div class="pt rv">'+esc(s.point)+'</div><ol>'+s.steps.map(function(x,i){return '<li class="rv"><b>'+(i+1)+'</b><span>'+esc(x)+'</span></li>';}).join("")+'</ol>'+
        '<div class="ny rv"><b>NOT YET!</b>'+esc(s.notYet)+'</div></div></div>'});
    });
    slides.push({c:"#FFD36B", html:'<div class="s-head">THE CHANT — I CALL, YOU ANSWER</div><div class="s-chant">'+
      pr.chant.map(function(c,i){return '<div class="row rv" style="'+col(st[i])+'"><span class="call">'+esc(c.call)+'</span><span class="resp">'+chantResp(c.response,st)+'</span></div>';}).join("")+'</div>'});
    slides.push({c:"#f97316", html:'<div class="s-head">IT GOES ROUND</div><div class="s-cycle">'+cycleSVG(st,true)+'<p class="rv">'+esc(pr.cycle)+'</p></div>'});
    slides.push({c:"#2ec4b6", html:'<div class="s-head">'+esc(pr.analogy.title).toUpperCase()+'</div><div class="s-an">'+
      pr.analogy.parts.map(function(p,i){return '<div class="p rv" style="'+col(st[i])+'"><div class="cap">'+st[i].key+'</div><p>'+esc(p)+'</p></div>';}).join("")+
      '</div><div class="s-an-end rv">'+esc(pr.analogy.end)+'</div>'});
    slides.push({c:hs.colour, html:'<div class="s-here"><div class="big">HANDS UP!</div><div class="sub">Which stage are we in today?</div>'+
      '<div class="ans rv" style="background:'+hs.colour+'">STAGE '+hs.n+' · '+hs.key+'</div><div class="sub rv">“'+esc(hs.question)+'”</div></div>'});

    var wrap=document.createElement("div"); wrap.className="wpp";
    wrap.innerHTML='<div class="wpp__stage"><div class="wpp__bg"></div><div class="wpp__layer"></div><div class="wpp__chrome">'+
      '<div class="wpp__prog"><i></i></div><div class="wpp__count"></div>'+
      '<div class="wpp__ctrl"><button data-a="prev">◀</button><button data-a="next">▶</button><button data-a="full">⛶</button><button data-a="exit">✕ Exit</button></div></div></div>';
    document.body.appendChild(wrap);
    var stage=wrap.querySelector(".wpp__stage"), layer=wrap.querySelector(".wpp__layer"), bg=wrap.querySelector(".wpp__bg");
    var idx=0;
    function fit(){ var s=Math.min(innerWidth/1920, innerHeight/1080); stage.style.transform="scale("+s+") translate(-50%,-50%)"; }
    function show(i, revealAll){
      idx=Math.max(0,Math.min(slides.length-1,i));
      var sl=slides[idx];
      bg.style.setProperty("--c", sl.c);
      layer.innerHTML='<div class="wpp__slide">'+sl.html+'</div>';
      if(revealAll) [].forEach.call(layer.querySelectorAll(".rv"),function(e){e.classList.add("on");});
      wrap.querySelector(".wpp__prog i").style.width=((idx+1)/slides.length*100)+"%";
      wrap.querySelector(".wpp__count").textContent=(idx+1)+" / "+slides.length;
    }
    function next(){ var r=layer.querySelector(".rv:not(.on)"); if(r){ r.classList.add("on"); return; } if(idx<slides.length-1) show(idx+1); }
    function prev(){ if(idx>0) show(idx-1,true); }
    function exit(){ removeEventListener("resize",fit); document.removeEventListener("keydown",key,true); if(document.fullscreenElement) document.exitFullscreen().catch(function(){}); wrap.remove(); }
    function full(){ if(document.fullscreenElement) document.exitFullscreen(); else if(wrap.requestFullscreen) wrap.requestFullscreen().catch(function(){}); }
    function key(e){
      var k=e.key; e.stopPropagation();
      if(k==="ArrowRight"||k===" "||k==="PageDown"||k==="Enter"){e.preventDefault();next();}
      else if(k==="ArrowLeft"||k==="PageUp"){e.preventDefault();prev();}
      else if(k==="Escape"){exit();}
      else if(k==="f"||k==="F"){full();}
    }
    wrap.addEventListener("click",function(e){
      var b=e.target.closest("button[data-a]");
      if(b){ var a=b.getAttribute("data-a"); if(a==="prev")prev(); else if(a==="next")next(); else if(a==="full")full(); else exit(); return; }
      next();
    });
    var tx=null;
    wrap.addEventListener("touchstart",function(e){tx=e.touches[0].clientX;},{passive:true});
    wrap.addEventListener("touchend",function(e){ if(tx==null)return; var dx=e.changedTouches[0].clientX-tx; if(Math.abs(dx)>50){ e.preventDefault(); dx<0?next():prev(); } tx=null; });
    document.addEventListener("keydown",key,true);
    addEventListener("resize",fit); fit(); show(0);
  }

  /* ---------- lesson view helper ---------- */
  function lessonArt(s, href){
    return art(stageArt(s),"pc-art",s.icon);
  }

  window.WP={ render:render, present:present, printCards:printCards, lessonArt:lessonArt, probe:probe, _fail:fail };
})();
