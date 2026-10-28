/* Writing Focus — Weekly Rubric tab: one-page A4 marking sheet per week.
   Data: window.__WF_RUBRIC[T][W] (focus-rubric-t12.js, focus-rubric-t34.js) */
(function(){
  var KEY="wf-rubric-opts";
  function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
  function opts(){var o={thisWk:true,nextWk:true,names:"",comment:true};try{var s=JSON.parse(localStorage.getItem(KEY)||"{}");for(var k in s)o[k]=s[k];}catch(e){}return o;}
  function saveOpts(o){try{localStorage.setItem(KEY,JSON.stringify(o));}catch(e){}}
  function R(T,W){return ((window.__WF_RUBRIC||{})[T]||{})[W];}
  function nextFocus(T,W){
    var N=window.__WF_RUBRIC_NEXT||{};
    function up(x){return x.charAt(0).toUpperCase()+x.slice(1);}
    if(W<10){var n=(N[T]||{})[W+1];return n?{lbl:"Next week (Week "+(W+1)+")",f:"Next week "+n}:null;}
    if(T<4){var m=(N[T+1]||{})[1];return m?{lbl:"Next term (Term "+(T+1)+")",f:"Next term "+m}:null;}
    return {lbl:"Over the summer",f:"Keep a holiday 'noticing jotter': write down three small things you notice each day, and keep reading every day. Next year's writing will build on everything we learned this year."};
  }
  /* ---------- the A4 sheet ---------- */
  function sheet(T,W,o,name,ticks){
    var d=window.__WF_DATA[T], wk=d.weeks[W], r=R(T,W); if(!r) return '<div class="rb-sheet"><p>No rubric for this week yet.</p></div>';
    ticks=ticks||{};
    var st=d.process.stages[(wk.stageNum||1)-1];
    var h='<div class="rb-sheet">';
    h+='<div class="rb-head"><div><div class="rb-kick">Writing Focus · Weekly Writing Check</div>'+
       '<div class="rb-title">Week '+W+': '+esc(wk.title)+'</div>'+
       '<div class="rb-sub">Term '+T+' · '+esc(d.meta.topic)+' · Stage '+st.n+' '+esc(st.key)+'</div></div>'+
       '<div class="rb-key"><span><i class="k-d"></i>Developing<br><small>needs more practice</small></span><span><i class="k-a"></i>Achieved<br><small>shows the skill</small></span><span><i class="k-f"></i>Flying<br><small>beyond expectations</small></span></div></div>';
    h+='<div class="rb-name"><span>Name: <b>'+esc(name||"")+'</b></span><span>Date:</span></div>';
    h+='<div class="rb-ev"><b>Writing looked at this week:</b> '+esc(r.ev)+'</div>';
    h+='<table class="rb-t"><colgroup><col style="width:22%"><col><col><col></colgroup><tr><th>This week’s skill</th><th class="h-d">Developing</th><th class="h-a">Achieved</th><th class="h-f">Flying</th></tr>';
    r.r.forEach(function(c,i){
      function cell(lvl,txt,ex,nxt){
        var on=ticks[i]===lvl;
        return '<td class="c-'+lvl+(on?' on':'')+'" data-i="'+i+'" data-l="'+lvl+'"><span class="bx">'+(on?'✔':'')+'</span>'+esc(txt)+
          '<em>e.g. '+esc(ex)+'</em>'+(nxt?'<span class="nx"><b>Next step:</b> '+esc(nxt)+'</span>':'')+'</td>';
      }
      h+='<tr><td class="crit"><b>'+esc(c[0])+'</b><span class="nz">NZC: '+esc(c[1])+'</span></td>'+
         cell("d",c[2],c[3],c[4])+cell("a",c[5],c[6])+cell("f",c[7],c[8])+'</tr>';
    });
    h+='</table>';
    var ov=ticks.ov||"";
    h+='<div class="rb-overall"><b>Overall this week:</b>'+
      ['d','a','f'].map(function(l){return '<span class="ov'+(ov===l?' on':'')+'" data-ov="'+l+'"><span class="bx">'+(ov===l?'✔':'')+'</span>'+{d:"Developing",a:"Achieved",f:"Flying"}[l]+'</span>';}).join("")+'</div>';
    if(o.comment) h+='<div class="rb-com"><b>Teacher comment / next step:</b><div class="ln"></div><div class="ln"></div></div>';
    var nf=nextFocus(T,W);
    if(o.thisWk||o.nextWk){
      h+='<div class="rb-parent"><div class="rb-ph">Kia ora whānau — a note about our writing</div>';
      if(o.thisWk) h+='<p><b>This week’s focus:</b> '+esc(r.f)+'</p>';
      if(o.nextWk&&nf) h+='<p><b>'+esc(nf.lbl)+':</b> '+esc(nf.f)+'</p>';
      h+='</div>';
    }
    return h+'</div>';
  }

  /* ---------- the tab ---------- */
  var ticks={};
  function render(main,ctx){
    var T=ctx.T,W=ctx.W,o=opts(); ticks={};
    var wk=ctx.data.weeks[W];
    var h='<div class="lh"><div class="lh__meta"><span class="badge" style="background:#7CE38B">Weekly Rubric</span>'+
      '<span class="meta-txt">Term '+T+' · Week '+W+'</span></div><h1 class="lh__topic">'+esc(wk.title)+'</h1></div>';
    h+='<div class="rb-ctrl panel"><div class="panel__head"><span style="font-size:1.3rem">🖨</span><h2>Print options</h2></div><div class="panel__body">'+
      '<div class="rb-opts">'+
        '<label><input type="checkbox" id="rbThis"'+(o.thisWk?' checked':'')+'> Parent note: <b>this week’s focus</b></label>'+
        '<label><input type="checkbox" id="rbNext"'+(o.nextWk?' checked':'')+'> Parent note: <b>next week’s focus</b></label>'+
        '<label><input type="checkbox" id="rbCom"'+(o.comment?' checked':'')+'> Teacher comment lines</label>'+
      '</div>'+
      '<div class="rb-names"><label for="rbNames"><b>Class list (optional)</b> — one name per line. Prints one named sheet per student. Saved on this computer only.</label>'+
        '<textarea id="rbNames" rows="4" placeholder="Ana&#10;Nikau&#10;Ruby">'+esc(o.names)+'</textarea></div>'+
      '<div class="toolbar" style="margin:.8rem 0 0">'+
        '<button class="tbtn tbtn--solid" id="rbPrint1">🖨 Print this sheet (with my ticks)</button>'+
        '<button class="tbtn" id="rbPrintAll">🖨 Print a blank sheet for each student</button>'+
        '<button class="tbtn" id="rbClear">↺ Clear ticks</button></div>'+
      '<p class="rb-tip">Tip: click any box on the sheet below to tick it (Developing, Achieved or Flying), then print — handy for marking one student at a time. Or print blank named sheets and mark by hand.</p>'+
      '</div></div>';
    h+='<div class="rb-paper" id="rbPaper"></div>';
    main.innerHTML=h;
    var paper=document.getElementById("rbPaper"), name="";
    function draw(){ paper.innerHTML=sheet(T,W,opts(),name,ticks); }
    draw();
    paper.addEventListener("click",function(e){
      var td=e.target.closest("td[data-l]"), ov=e.target.closest("[data-ov]");
      if(td){var i=td.getAttribute("data-i"),l=td.getAttribute("data-l");ticks[i]=(ticks[i]===l)?null:l;draw();}
      else if(ov){var l2=ov.getAttribute("data-ov");ticks.ov=(ticks.ov===l2)?null:l2;draw();}
    });
    function upd(){var n=opts();n.thisWk=document.getElementById("rbThis").checked;n.nextWk=document.getElementById("rbNext").checked;
      n.comment=document.getElementById("rbCom").checked;n.names=document.getElementById("rbNames").value;saveOpts(n);draw();}
    ["rbThis","rbNext","rbCom"].forEach(function(id){document.getElementById(id).onchange=upd;});
    document.getElementById("rbNames").oninput=upd;
    document.getElementById("rbClear").onclick=function(){ticks={};draw();};
    document.getElementById("rbPrint1").onclick=function(){ctx.doPrint('<div class="rb-print">'+sheet(T,W,opts(),"",ticks)+'</div>');};
    document.getElementById("rbPrintAll").onclick=function(){
      var names=opts().names.split(/\n/).map(function(s){return s.trim();}).filter(Boolean);
      if(!names.length) names=[""];
      ctx.doPrint('<div class="rb-print">'+names.map(function(n){return sheet(T,W,opts(),n,{});}).join("")+'</div>');
    };
  }
  window.WFR={render:render,sheet:sheet};
})();
