/* Writing Focus — Ready-made texts (no-prep stories, drafts, passages, poems).
   Data: window.__WF_TEXTS[T]["Week-Day"] (focus-texts-t1..t4.js). */
(function(){
  function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
  var KCOL={"Teacher's story":"#FF5A4F","Teacher's draft":"#f97316","Teacher's model":"#3b82f6","Teacher's script":"#a855f7","Teacher's poem":"#ec4899",
            "Teacher's plan":"#3b82f6","Teacher's choice":"#3b82f6","Mentor text":"#10b981","Mentor story":"#10b981","Mentor poem":"#10b981",
            "Exemplar":"#0ea5e9","Board passage":"#eab308","Bad example":"#64748b"};
  var cur=[], ctx0=null;
  function items(T,W,D,data){
    var L=((window.__WF_TEXTS||{})[T]||{})[W+"-"+D]||[];
    return L.map(function(it){
      var o={};for(var k in it)o[k]=it[k];
      if(typeof o.ex==="number"&&data&&data.exemplars&&data.exemplars[o.ex]){var e=data.exemplars[o.ex];o.txt=e.text;o.src=e.label;}
      return o;
    }).filter(function(o){return o.txt;});
  }
  function panel(T,W,D,data){
    cur=items(T,W,D,data); ctx0={T:T,W:W,D:D};
    if(!cur.length) return "";
    return '<div class="wft-panel"><div class="wft-head"><span class="wft-ic">📄</span><div><h2>READY-MADE TEXTS · NO PREP</h2>'+
      '<p>Everything this lesson asks you to tell, read or show is here. View it full-screen, or print a teacher sheet (text plus notes and answers) or a class copy.</p></div></div>'+
      '<div class="wft-list">'+cur.map(function(it,i){var c=KCOL[it.k]||"#64748b";
        return '<div class="wft-item" style="--c:'+c+'"><div class="wft-top"><span class="wft-kind">'+esc(it.k)+'</span>'+
          (it.show?'<span class="wft-slide" title="This text also appears as a slide in ▶ Present">▶ on a slide</span>':'')+'</div>'+
          '<div class="wft-t">'+esc(it.t)+'</div><div class="wft-u">'+esc(it.u)+'</div>'+
          '<div class="wft-prev">'+esc(it.txt.split("\n").filter(Boolean).slice(0,3).join(" · ")).slice(0,220)+'…</div>'+
          '<div class="wft-btns"><button class="tbtn tbtn--solid" data-wft="view" data-i="'+i+'">👁 View full-screen</button>'+
          '<button class="tbtn" data-wft="teach" data-i="'+i+'">🖨 Teacher sheet</button>'+
          '<button class="tbtn" data-wft="class" data-i="'+i+'">🖨 Class copy</button></div></div>';}).join("")+'</div></div>';
  }
  function sheet(it,mode,c){
    var h='<div class="wft-sheet'+(mode==="class"?" wft-class":"")+'"><div class="wft-sh-top"><span>WRITING FOCUS · '+(mode==="class"?"READ TOGETHER":"READY-MADE TEXT")+'</span><span>Term '+c.T+' · Week '+c.W+' · '+esc(c.D)+'</span></div>'+
      '<h1>'+esc(it.t)+'</h1>';
    if(mode!=="class") h+='<div class="wft-sh-use"><b>'+esc(it.k)+' — how to use it today</b>'+esc(it.u)+'</div>';
    h+='<div class="wft-sh-txt">'+esc(it.txt)+'</div>';
    if(mode!=="class"&&it.n&&it.n.length) h+='<div class="wft-sh-notes"><b>Teacher notes &amp; answers</b><ul>'+it.n.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ul></div>';
    return h+'</div>';
  }
  function view(it){
    var ov=document.createElement("div");ov.className="wft-view";var fs=34;
    ov.innerHTML='<div class="wft-vbar"><b>'+esc(it.t)+'</b><span><button data-z="-">A−</button><button data-z="+">A+</button><button data-x>✕ Close</button></span></div>'+
      '<div class="wft-vtxt">'+esc(it.txt)+'</div>';
    document.body.appendChild(ov);var tx=ov.querySelector(".wft-vtxt");tx.style.fontSize=fs+"px";
    function close(){ov.remove();document.removeEventListener("keydown",key);}
    function key(e){if(e.key==="Escape")close();}
    document.addEventListener("keydown",key);
    ov.onclick=function(e){var z=e.target.getAttribute("data-z");if(z){fs=Math.max(16,Math.min(80,fs+(z==="+"?4:-4)));tx.style.fontSize=fs+"px";}
      if(e.target.hasAttribute("data-x"))close();};
  }
  document.addEventListener("click",function(e){
    var b=e.target.closest&&e.target.closest("[data-wft]");if(!b)return;
    var it=cur[+b.getAttribute("data-i")],m=b.getAttribute("data-wft");if(!it)return;
    if(m==="view")return view(it);
    if(window.__wfDoPrint) window.__wfDoPrint('<div class="wft-print">'+sheet(it,m,ctx0)+'</div>');
  });
  /* slides for ▶ Present: where = "i" | "we" | "y" */
  function slides(T,W,D,data,where){
    var out=[];
    items(T,W,D,data).filter(function(it){return it.show===where;}).forEach(function(it){
      // split long texts at blank lines: about 620 characters or 15 lines per slide
      var paras=it.txt.split(/\n\n+/),chunks=[],cur="";
      function cost(t){return t.length+t.split("\n").length*40;}
      paras.forEach(function(p){var next=cur?cur+"\n\n"+p:p;if(cur&&cost(next)>1150){chunks.push(cur);cur=p;}else cur=next;});
      if(cur)chunks.push(cur);
      chunks.forEach(function(ch,i){
        out.push({c:KCOL[it.k]||"#eab308",html:'<div class="s-head">📄 '+(where==="i"?"LISTEN & WATCH":"READ TOGETHER")+(chunks.length>1?' · PART '+(i+1)+' OF '+chunks.length:'')+'</div>'+
          '<div class="s-text fit">'+esc(ch)+'</div>'});
      });
    });
    return out;
  }
  window.WFT={items:items,panel:panel,sheet:sheet,slides:slides,view:view};
})();
