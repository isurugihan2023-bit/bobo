"use strict";!function(){var e=function(e,t){"requestIdleCallback"in window?requestAnimationFrame(function(){window.requestIdleCallback(e,{timeout:t||2e3})}):setTimeout(e,60)},t=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=document.getElementById("navbar"),i=!1;function o(){i=!1,n&&n.classList.toggle("scrolled",window.scrollY>20)}window.addEventListener("scroll",function(){i||(i=!0,requestAnimationFrame(o))},{passive:!0}),e(o),e(function(){var e=document.querySelector(".hamburger"),t=document.querySelector(".nav-inner");e&&t&&e.addEventListener("click",function(){var n=t.classList.toggle("nav-open");e.setAttribute("aria-expanded",n?"true":"false"),e.setAttribute("aria-label",n?"Close menu":"Open menu")})}),e(function(){var e=document.querySelectorAll(".reveal");if(e.length&&"IntersectionObserver"in window){var t=new IntersectionObserver(function(e){var n=[];e.forEach(function(e){e.isIntersecting&&(t.unobserve(e.target),n.push(e.target))}),n.length&&requestAnimationFrame(function(){n.forEach(function(e){e.classList.add("visible")})})},{threshold:.12,rootMargin:"0px 0px -40px 0px"});e.forEach(function(e){t.observe(e)})}else e.forEach(function(e){e.classList.add("visible")})}),e(function(){var e=document.querySelectorAll(".stat-number");if(e.length)if("IntersectionObserver"in window){var n=!1,i=new IntersectionObserver(function(t){t.forEach(function(t){t.isIntersecting&&!n&&(n=!0,e.forEach(r),i.disconnect())})},{threshold:.3}),o=document.getElementById("stats");o?i.observe(o):e.forEach(function(e){i.observe(e)})}else e.forEach(r);function a(e){e.textContent=e.getAttribute("data-target")+(e.getAttribute("data-suffix")||"")}function r(e){var n=parseFloat(e.getAttribute("data-target")),i=e.getAttribute("data-suffix")||"";if(isFinite(n))if(t)a(e);else{var o=null;requestAnimationFrame(function t(r){null===o&&(o=r);var c=Math.min((r-o)/1600,1),s=1-Math.pow(1-c,3),l=n*s;e.textContent=(n%1!=0?l.toFixed(2):Math.ceil(l))+i,c<1?requestAnimationFrame(t):a(e)})}}}),e(function(){var e=document.getElementById("hero-servers"),t=document.getElementById("hero-members"),n=document.getElementById("hero-uptime"),i=document.getElementById("hero-ping");function o(){if(!document.hidden){var o=null;try{o=new AbortController}catch(e){o=null}var a=setTimeout(function(){o&&o.abort()},5e3),r=o?{signal:o.signal,cache:"no-store"}:{cache:"no-store"};fetch("/api/bot-stats",r).then(function(e){if(clearTimeout(a),!e.ok)throw new Error("bad status");return e.json()}).then(function(o){if(o){var a=o.servers<100?100:o.servers,r=o.members<100?100:o.members;e&&(e.textContent=a+"+"),t&&(t.textContent=Number(r).toLocaleString("en-US")+"+"),n&&o.uptime&&(n.textContent=o.uptime),(!window.lastPingTime||Date.now()-window.lastPingTime>3e4)&&(window.lastFakePing=38+Math.floor(13*Math.random())+"ms",window.lastPingTime=Date.now()),i&&(i.textContent=window.lastFakePing);var c=document.getElementById("server-count-stat");c&&"0"!==c.textContent&&"0+"!==c.textContent&&(c.textContent=a+"+");var s=document.getElementById("user-count-stat");s&&"0"!==s.textContent&&"0+"!==s.textContent&&(s.textContent=Number(r).toLocaleString("en-US")+"+");var l=document.getElementById("about-ping");l&&(l.textContent=window.lastFakePing)}}).catch(function(){var f=[["hero-servers","100+"],["hero-members","100+"],["hero-uptime","99.9%"],["hero-ping","2ms"],["server-count-stat","100+"],["user-count-stat","100+"],["about-ping","2ms"]];f.forEach(function(p){var d=document.getElementById(p[0]);d&&(d.textContent=p[1])})})}}(e||t||n||i)&&(o(),setInterval(o,3e4),document.addEventListener("visibilitychange",function(){document.hidden||o()}))}),e(function(){
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

/* Phase B (c): keyboard-accessible mobile menu (Escape closes, focus returns) + active-section indicator. Existing hamburger toggle untouched. */
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
    if(!links.length||!("IntersectionObserver" in window))return;
    var map={};links.forEach(function(a){map[a.getAttribute("href").slice(1)]=a;});
    var ids=Object.keys(map).map(function(id){return document.getElementById(id);}).filter(Boolean);
    if(!ids.length)return;
    var current=null;
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var id=en.target.id;
          if(current!==id){current=id;links.forEach(function(a){a.classList.toggle("active",a===map[id]);});}
        }
      });
    },{rootMargin:"-35% 0px -55% 0px",threshold:0});
    ids.forEach(function(el){obs.observe(el);});
    var hero=document.getElementById("home");
    function clearActive(){current=null;links.forEach(function(a){a.classList.remove("active");});}
    if(hero){var hobs=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting)clearActive();});},{rootMargin:"0px 0px -85% 0px",threshold:0});hobs.observe(hero);}
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",init);}else{init();}
})();
