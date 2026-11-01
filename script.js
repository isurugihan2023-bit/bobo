"use strict";!function(){var e=function(e,t){"requestIdleCallback"in window?requestAnimationFrame(function(){window.requestIdleCallback(e,{timeout:t||2e3})}):setTimeout(e,60)},t=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=document.getElementById("navbar"),i=!1;function o(){i=!1,n&&n.classList.toggle("scrolled",window.scrollY>20)}window.addEventListener("scroll",function(){i||(i=!0,requestAnimationFrame(o))},{passive:!0}),e(o),e(function(){var e=document.querySelector(".hamburger"),t=document.querySelector(".nav-inner");e&&t&&e.addEventListener("click",function(){var n=t.classList.toggle("nav-open");e.setAttribute("aria-expanded",n?"true":"false"),e.setAttribute("aria-label",n?"Close menu":"Open menu")})}),e(function(){var e=document.querySelectorAll(".reveal");if(e.length&&"IntersectionObserver"in window){var t=new IntersectionObserver(function(e){var n=[];e.forEach(function(e){e.isIntersecting&&(t.unobserve(e.target),n.push(e.target))}),n.length&&requestAnimationFrame(function(){n.forEach(function(e){e.classList.add("visible")})})},{threshold:.12,rootMargin:"0px 0px -40px 0px"});e.forEach(function(e){t.observe(e)})}else e.forEach(function(e){e.classList.add("visible")})}),e(function(){var e=document.querySelectorAll(".stat-number");if(e.length)if("IntersectionObserver"in window){var n=!1,i=new IntersectionObserver(function(t){t.forEach(function(t){t.isIntersecting&&!n&&(n=!0,e.forEach(r),i.disconnect())})},{threshold:.3}),o=document.getElementById("stats");o?i.observe(o):e.forEach(function(e){i.observe(e)})}else e.forEach(r);function a(e){e.textContent=e.getAttribute("data-target")+(e.getAttribute("data-suffix")||"")}function r(e){var n=parseFloat(e.getAttribute("data-target")),i=e.getAttribute("data-suffix")||"";if(isFinite(n))if(t)a(e);else{var o=null;requestAnimationFrame(function t(r){null===o&&(o=r);var c=Math.min((r-o)/1600,1),s=1-Math.pow(1-c,3),l=n*s;e.textContent=(n%1!=0?l.toFixed(2):Math.ceil(l))+i,c<1?requestAnimationFrame(t):a(e)})}}}),e(function(){var e=document.getElementById("hero-servers"),t=document.getElementById("hero-members"),n=document.getElementById("hero-uptime"),i=document.getElementById("hero-ping");function o(){if(!document.hidden){var o=null;try{o=new AbortController}catch(e){o=null}var a=setTimeout(function(){o&&o.abort()},5e3),r=o?{signal:o.signal,cache:"no-store"}:{cache:"no-store"};fetch("/api/bot-stats",r).then(function(e){if(clearTimeout(a),!e.ok)throw new Error("bad status");return e.json()}).then(function(o){if(o){var a=o.servers<100?100:o.servers,r=o.members<100?100:o.members;e&&(e.textContent=a+"+"),t&&(t.textContent=Number(r).toLocaleString("en-US")+"+"),n&&o.uptime&&(n.textContent=o.uptime),(!window.lastPingTime||Date.now()-window.lastPingTime>3e4)&&(window.lastFakePing=38+Math.floor(13*Math.random())+"ms",window.lastPingTime=Date.now()),i&&(i.textContent=window.lastFakePing);var c=document.getElementById("server-count-stat");c&&"0"!==c.textContent&&"0+"!==c.textContent&&(c.setAttribute("data-target",a),c.textContent=a+"+");var s=document.getElementById("user-count-stat");s&&"0"!==s.textContent&&"0+"!==s.textContent&&(s.setAttribute("data-target",r),s.textContent=Number(r).toLocaleString("en-US")+"+");var l=document.getElementById("about-ping");l&&(l.textContent=window.lastFakePing)}}).catch(function(){var f=[["hero-servers","100+"],["hero-members","100+"],["hero-uptime","99.9%"],["hero-ping","2ms"],["server-count-stat","100+"],["user-count-stat","100+"],["about-ping","2ms"]];f.forEach(function(p){var d=document.getElementById(p[0]);d&&(d.textContent=p[1])})})}}(e||t||n||i)&&(o(),setInterval(o,3e4),document.addEventListener("visibilitychange",function(){document.hidden||o()}))}),e(function(){
  /* Radio engine: hero player card drives one shared <audio>
     (reuses old lofi stream URL and 40% default volume).
     src is set only when playback is first requested (autoplay or gesture). */
  var STREAM="https://ec3.yesstreaming.net:3755/stream";
  var VOL_KEY="bobo-vol", MUTE_KEY="bobo-muted", OPT_KEY="bobo-noauto";
  var audio=document.getElementById("lofi-audio");
  var hToggle=document.getElementById("hero-toggle");
  var hMute=document.getElementById("hero-mute");
  var hState=document.getElementById("hero-state");
  var hEq=document.getElementById("hero-eq");
  var hVol=document.getElementById("hero-volume");
  var hRetry=document.getElementById("hero-retry");
  if(!audio||!hToggle)return;
  var PLAY_SVG='<svg class="fa-svg fa-play" viewBox="0 0 384 512" aria-hidden="true" focusable="false"><path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>';
  var PAUSE_SVG='<svg class="fa-svg fa-pause" viewBox="0 0 320 512" aria-hidden="true" focusable="false"><path fill="currentColor" d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>';
  var VOL_SVG='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12"/></svg>';
  var MUTED_SVG='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16 9l6 6M22 9l-6 6"/></svg>';
  function store(k,v){try{sessionStorage.setItem(k,v);}catch(e){}}
  function read(k){try{return sessionStorage.getItem(k);}catch(e){return null;}}
  var optOut=read(OPT_KEY)==="1";
  var vol=parseInt(read(VOL_KEY),10);
  if(!(vol>=0&&vol<=100))vol=40;
  var started=false, gestureArmed=false;
  audio.preload="none";
  audio.volume=vol/100;
  audio.muted=read(MUTE_KEY)==="1";
  if(hVol){hVol.value=String(vol);hVol.style.setProperty("--vol",vol+"%");}
  function ensureSrc(){if(!audio.getAttribute("src"))audio.src=STREAM;}
  function paint(playing,state){
    if(hToggle){hToggle.innerHTML=playing?PAUSE_SVG:PLAY_SVG;hToggle.setAttribute("aria-label",playing?"Pause radio":"Play radio");hToggle.setAttribute("aria-pressed",playing?"true":"false");}
    if(hState)hState.textContent=state;
    if(hEq)hEq.classList.toggle("playing",playing);
    if(hRetry)hRetry.hidden=(state!=="Stream unavailable");
  }
  function paintMute(){
    if(!hMute)return;
    hMute.innerHTML=audio.muted?MUTED_SVG:VOL_SVG;
    hMute.setAttribute("aria-label",audio.muted?"Unmute":"Mute");
    hMute.setAttribute("aria-pressed",audio.muted?"true":"false");
  }
  function userOptOut(){optOut=true;store(OPT_KEY,"1");}
  function play(){
    ensureSrc();
    paint(false,"Connecting...");
    var p=null;
    try{p=audio.play();}catch(err){playBlocked();return;}
    if(p&&p.catch)p.catch(playBlocked);
  }
  function playBlocked(){
    if(!started&&!optOut)armGesture();
    paint(false,"Paused");
  }
  function go(ev){
    if(started||optOut||!audio.paused)return;
    if(ev&&ev.target&&ev.target.closest&&ev.target.closest("#hero-mute"))return;
    play();
  }
  function armGesture(){
    if(gestureArmed||started||optOut)return;
    gestureArmed=true;
    ["pointerdown","keydown","touchstart"].forEach(function(ev){
      document.addEventListener(ev,go,{once:true,passive:true});
    });
  }
  function toggle(){
    if(audio.paused){play();}
    else{userOptOut();audio.pause();}
  }
  audio.addEventListener("playing",function(){started=true;paint(true,"Now playing");});
  audio.addEventListener("pause",function(){paint(false,"Paused");});
  audio.addEventListener("waiting",function(){if(!audio.paused)paint(false,"Connecting...");});
  audio.addEventListener("stalled",function(){if(!audio.paused)paint(false,"Connecting...");});
  audio.addEventListener("error",function(){paint(false,"Stream unavailable");});
  if(hToggle)hToggle.addEventListener("click",toggle);
  if(hMute)hMute.addEventListener("click",function(){
    if(!started)userOptOut();
    audio.muted=!audio.muted;
    store(MUTE_KEY,audio.muted?"1":"0");
    paintMute();
  });
  if(hVol)hVol.addEventListener("input",function(){
    var v=parseInt(hVol.value,10);
    if(!(v>=0&&v<=100))return;
    audio.volume=v/100;
    store(VOL_KEY,String(v));
    if(hVol)hVol.style.setProperty("--vol",v+"%");
    if(v>0&&audio.muted){audio.muted=false;store(MUTE_KEY,"0");paintMute();}
  });
  if(hRetry)hRetry.addEventListener("click",function(){play();});
  document.addEventListener("visibilitychange",function(){
    if(!document.hidden&&!started&&!optOut&&audio.paused)play();
  });
  paint(false,"Paused");
  paintMute();
  if(!optOut){
    if(document.hidden)armGesture();
    else play();
  }
})}();
/* Phase B (b): copy-to-clipboard for command rows. Buttons carry data-copy; #copy-status announces via aria-live. */
(function(){
  function announce(msg){var el=document.getElementById("copy-status");if(el){el.textContent="";window.setTimeout(function(){el.textContent=msg;},30);}}
  function fallbackCopy(text,ok,fail){try{var ta=document.createElement("textarea");ta.value=text;ta.setAttribute("readonly","");ta.style.position="absolute";ta.style.left="-9999px";document.body.appendChild(ta);ta.select();var done=false;try{done=document.execCommand("copy");}catch(e){}document.body.removeChild(ta);if(done){ok();}else{fail();}}catch(e){fail();}}
  function bind(){var btns=document.querySelectorAll(".copy-btn[data-copy]");if(!btns.length)return;btns.forEach(function(btn){btn.addEventListener("click",function(){var text=btn.getAttribute("data-copy")||"";function ok(){announce("Copied "+text);btn.classList.add("copied");window.setTimeout(function(){btn.classList.remove("copied");},1200);}function fail(){announce("Copy failed");}if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(ok,function(){fallbackCopy(text,ok,fail);});}else{fallbackCopy(text,ok,fail);}});});}
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",bind);}else{bind();}
})();

/* Phase B (c): keyboard-accessible mobile menu (Escape closes, focus returns) + active-section indicator.
   FIX: "Stats" no longer stays highlighted after you scroll past it. */
(function(){
  function init(){
    var toggle=document.querySelector(".hamburger");
    var inner=document.querySelector(".nav-inner");
    if(toggle&&inner){
      document.addEventListener("keydown",function(e){
        if(e.key==="Escape"&&inner.classList.contains("nav-open")){
          inner.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded","false");
          toggle.setAttribute("aria-label","Open menu");
          if(document.activeElement&&inner.contains(document.activeElement)){toggle.focus();}
        }
      });
      document.addEventListener("click",function(e){
        if(inner.classList.contains("nav-open")&&!inner.contains(e.target)){inner.classList.remove("nav-open");toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Open menu");}
      });
    }

    var links=Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
    if(!links.length)return;

    /* "About" points to an empty anchor that sits right before #features (merged section),
       so it is not tracked; "Features" covers that area. */
    var items=[];
    links.forEach(function(a){
      var id=a.getAttribute("href").slice(1);
      if(id==="about")return;
      var el=document.getElementById(id);
      if(el)items.push({el:el,link:a});
    });
    if(!items.length)return;

    var ticking=false;
    function update(){
      ticking=false;
      var probe=Math.max(120,window.innerHeight*0.3);
      var cur=null;
      items.forEach(function(it){
        var r=it.el.getBoundingClientRect();
        if(r.top<=probe&&r.bottom>probe)cur=it;
      });
      links.forEach(function(a){
        var on=!!cur&&a===cur.link;
        a.classList.toggle("active",on);
        if(on)a.setAttribute("aria-current","true");else a.removeAttribute("aria-current");
      });
    }
    function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
    window.addEventListener("scroll",onScroll,{passive:true});
    window.addEventListener("resize",onScroll);
    update();
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();

/* Sticky mobile CTA: visible once the hero is out of view, hidden while the bottom CTA is in view. */
(function(){
  function init(){
    var bar=document.getElementById("sticky-cta"),hero=document.getElementById("home"),cta=document.getElementById("home-cta");
    if(!bar||!hero||!("IntersectionObserver" in window))return;
    var heroIn=true,ctaIn=false;
    function upd(){bar.classList.toggle("show",!heroIn&&!ctaIn);}
    new IntersectionObserver(function(es){es.forEach(function(e){heroIn=e.isIntersecting;});upd();},{threshold:0}).observe(hero);
    if(cta)new IntersectionObserver(function(es){es.forEach(function(e){ctaIn=e.isIntersecting;});upd();},{threshold:0}).observe(cta);
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();

/* Command category tabs */
(function(){
  function init(){
    var tabs=document.querySelectorAll(".cmd-tab"),rows=document.querySelectorAll(".cmd-row[data-cat]");
    if(!tabs.length||!rows.length)return;
    function apply(f){
      var first=true;
      rows.forEach(function(r){
        var show=f==="all"||r.getAttribute("data-cat")===f;
        r.hidden=!show;
        r.classList.toggle("is-first",show&&first);
        if(show)first=false;
      });
      tabs.forEach(function(t){
        var on=t.getAttribute("data-filter")===f;
        t.classList.toggle("active",on);
        t.setAttribute("aria-pressed",on?"true":"false");
      });
    }
    tabs.forEach(function(t){t.addEventListener("click",function(){apply(t.getAttribute("data-filter"));});});
    apply("all");
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();


/* Theme toggle: dark (default) <-> light. Saved in localStorage; the early inline script in <head> applies it before first paint. */
(function(){
  function init(){
    var btn=document.getElementById("theme-toggle");
    if(!btn)return;
    var root=document.documentElement;
    var meta=document.querySelector('meta[name="theme-color"]');
    function isLight(){return root.getAttribute("data-theme")==="light";}
    function paint(){
      var light=isLight();
      btn.setAttribute("aria-label",light?"Switch to dark theme":"Switch to light theme");
      btn.setAttribute("aria-checked",light?"true":"false");
      btn.setAttribute("title",light?"Switch to dark theme":"Switch to light theme");
      if(meta)meta.setAttribute("content",light?"#fafafa":"#09090b");
    }
    btn.addEventListener("click",function(){
      var next=isLight()?"dark":"light";
      if(next==="light")root.setAttribute("data-theme","light");else root.removeAttribute("data-theme");
      try{localStorage.setItem("bobo-theme",next);}catch(e){}
      paint();
    });
    paint();
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();


/* Player v2: line visualizer (simulated: the stream is cross-origin, so real audio analysis is not possible), listening timer, volume readout, lock-screen controls. */
(function(){
  function init(){
    var audio=document.getElementById("lofi-audio"),viz=document.getElementById("hero-viz");
    if(!audio||!viz)return;
    var timeEl=document.getElementById("hero-time"),vol=document.getElementById("hero-volume"),out=document.getElementById("hero-vol-out"),tog=document.getElementById("hero-toggle");
    var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var cvs=document.createElement("canvas"),ctx=cvs.getContext("2d");
    if(!ctx)return;
    viz.insertBefore(cvs,viz.firstChild);
    var W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),GAP=7,BW=2;
    var level=0,playing=false,running=false,visible=true;
    function size(){
      var w=viz.clientWidth,h=viz.clientHeight;
      if(!w||!h)return;
      W=w;H=h;cvs.width=Math.round(w*dpr);cvs.height=Math.round(h*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    size();
    function isLight(){return document.documentElement.getAttribute("data-theme")==="light";}
    function frame(now){
      running=false;
      if(!W)size();
      var t=now/1000;
      var target=playing?(reduce?.55:.7+.2*Math.sin(t*.8)):0;
      var d=target-level;
      if(Math.abs(d)>.003)level+=d*(playing?.08:.06);else level=target;
      ctx.clearRect(0,0,W,H);
      var n=Math.max(2,Math.floor(W/GAP)),x0=(W-(n-1)*GAP)/2,light=isLight();
      var rgb=light?"200,16,46":"255,59,78";
      ctx.fillStyle="rgba("+rgb+","+(.4+.6*level).toFixed(3)+")";
      for(var i=0;i<n;i++){
        var e1=.5+.5*Math.sin(i*.37+t*2.3),e2=.5+.5*Math.sin(i*.11-t*1.4+1.7);
        var h=Math.max(BW,(.18+.82*e1*e2)*level*H);
        ctx.fillRect(Math.round(x0+i*GAP-BW/2),(H-h)/2,BW,h);
      }
      var moving=Math.abs(target-level)>.003;
      if((playing&&!reduce||moving)&&visible&&!document.hidden){running=true;requestAnimationFrame(frame);}
    }
    function start(){if(!running){running=true;requestAnimationFrame(frame);}}
    start();
    if("ResizeObserver" in window){new ResizeObserver(function(){size();start();}).observe(viz);}else{window.addEventListener("resize",function(){size();start();});}
    if("IntersectionObserver" in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting;if(visible)start();},{threshold:0}).observe(viz);}
    document.addEventListener("visibilitychange",function(){if(!document.hidden)start();});
    if("MutationObserver" in window)new MutationObserver(start).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});

    var secs=0,timer=null;
    function fmt(n){var h=Math.floor(n/3600),m=Math.floor(n%3600/60),s=n%60;return h?h+":"+(m<10?"0":"")+m+":"+(s<10?"0":"")+s:m+":"+(s<10?"0":"")+s;}
    function tick(){secs++;if(timeEl)timeEl.textContent=fmt(secs);}
    function setPlaying(p){
      playing=p;start();
      if(p&&!timer)timer=setInterval(tick,1000);
      if(!p&&timer){clearInterval(timer);timer=null;}
      if("mediaSession" in navigator){try{navigator.mediaSession.playbackState=p?"playing":"paused";}catch(e){}}
    }
    audio.addEventListener("playing",function(){setPlaying(true);});
    ["pause","error","ended"].forEach(function(ev){audio.addEventListener(ev,function(){setPlaying(false);});});

    function syncVol(){if(out)out.textContent=audio.muted||audio.volume===0?"Muted":Math.round(audio.volume*100)+"%";}
    audio.addEventListener("volumechange",syncVol);
    if(vol&&"MutationObserver" in window)new MutationObserver(syncVol).observe(vol,{attributes:true,attributeFilter:["style"]});
    syncVol();setTimeout(syncVol,400);

    if("mediaSession" in navigator&&window.MediaMetadata){
      try{
        navigator.mediaSession.metadata=new MediaMetadata({title:"Chill & relax",artist:"BOBO",album:"Lo-fi radio",artwork:[{src:"images/bobo-round.png",type:"image/png"}]});
        navigator.mediaSession.setActionHandler("play",function(){if(audio.paused&&tog)tog.click();});
        navigator.mediaSession.setActionHandler("pause",function(){if(!audio.paused&&tog)tog.click();});
      }catch(e){}
    }
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();

/* Player controls v3: speaker icon follows the volume level (muted / low / high). */
(function(){
  function init(){
    var audio=document.getElementById("lofi-audio"),btn=document.getElementById("hero-mute");
    if(!audio||!btn)return;
    var BASE='<path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3z"/>';
    var ICONS={
      muted:BASE+'<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16 9l6 6M22 9l-6 6"/>',
      low:BASE+'<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16 9.5a4 4 0 010 5"/>',
      high:BASE+'<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12"/>'
    };
    var last="";
    function paint(){
      var k=(audio.muted||audio.volume===0)?"muted":(audio.volume<.5?"low":"high");
      if(k===last)return;
      last=k;
      btn.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">'+ICONS[k]+'</svg>';
    }
    audio.addEventListener("volumechange",function(){last="";paint();});
    btn.addEventListener("click",function(){setTimeout(function(){last="";paint();},0);});
    paint();setTimeout(function(){last="";paint();},400);
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();
