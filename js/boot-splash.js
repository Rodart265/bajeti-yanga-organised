(function(){
  var splash = document.getElementById('boot-splash');
  var shownAt = Date.now();
  var MIN_DISPLAY_MS = 500; // give the icon/name a real moment on screen, even on a cached/instant load
  var ids = ['scr-auth','scr-setup','scr-pin','scr-welcome','scr-verify','app'];
  function els(){ return ids.map(function(id){ return document.getElementById(id); }).filter(Boolean); }
  function anyVisible(){
    return els().some(function(el){ return !el.classList.contains('hide'); });
  }
  function removeSplash(){
    if(!splash || !splash.parentNode) return;
    if(observer) observer.disconnect();
    clearTimeout(timeoutTimer);
    var wait = Math.max(0, MIN_DISPLAY_MS - (Date.now() - shownAt));
    setTimeout(function(){
      splash.classList.add('boot-splash-out');
      setTimeout(function(){ if(splash.parentNode) splash.parentNode.removeChild(splash); }, 260);
    }, wait);
  }
  if(anyVisible()){ removeSplash(); return; }
  var observer = new MutationObserver(function(){ if(anyVisible()) removeSplash(); });
  els().forEach(function(el){ observer.observe(el, {attributes:true, attributeFilter:['class']}); });
  // Safety net: slow/no network and nothing cached yet — don't leave people
  // staring at a spinner forever.
  function showConnectionIssue(){
    if(anyVisible()){ removeSplash(); return; }
    var offline = !navigator.onLine;
    var msgEl = document.getElementById('boot-splash-msg');
    var spinEl = document.getElementById('boot-splash-spin');
    if(spinEl) spinEl.style.display = 'none';
    if(msgEl){
      msgEl.innerHTML = (offline
        ? "You're offline and this device hasn't loaded Bajeti Yanga before, so it needs a connection the first time."
        : "This is taking longer than usual. Check your connection and try again.")
        + '<br><br><button class="bs-retry" onclick="location.reload()">Retry</button>';
    }
  }
  var timeoutTimer = setTimeout(showConnectionIssue, 9000);
  // If Firebase itself failed to load, that's already known to be fatal --
  // no reason to make people wait out the full 9s above to find out.
  if(window._firebaseBootError){
    clearTimeout(timeoutTimer);
    showConnectionIssue();
  }
})();
