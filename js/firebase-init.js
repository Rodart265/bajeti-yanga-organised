let db, auth;
try{
  firebase.initializeApp({
    apiKey:"AIzaSyA5TdvAFE0cFkme7O--LtJNKIikM-KXFdM",
    authDomain:"bajeti-yanga.firebaseapp.com",
    projectId:"bajeti-yanga",
    storageBucket:"bajeti-yanga.firebasestorage.app",
    messagingSenderId:"585037359165",
    appId:"1:585037359165:web:01b831d5277faed34be254"
  });
  db = firebase.firestore();
  auth = firebase.auth();
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(()=>{});
  // Previously this failure was swallowed completely silently ({}=>{}), so on any device where
  // IndexedDB persistence can't be enabled (private/incognito browsing, some in-app browsers,
  // Safari's storage eviction on home-screen PWAs, etc.) offline mode would just quietly not
  // work with zero indication to the user or in the console.
  window._offlinePersistenceOk = null; // null = pending, true/false once settled
  db.enablePersistence({synchronizeTabs:true})
    .then(()=>{ window._offlinePersistenceOk = true; })
    .catch((err)=>{
      window._offlinePersistenceOk = false;
      console.warn('[Bajeti] Offline persistence unavailable ('+(err&&err.code)+') -- app data will not be cached for offline use on this device/browser.');
    });
}catch(e){
  // firebase is undefined / init threw -- the SDK scripts above never loaded
  // (blocked domain, ad-blocker, dead connection before first paint, captive
  // portal). #boot-splash doesn't exist in the DOM yet at this point in <head>,
  // so we can't show the message directly from here -- flag it and let the
  // boot-splash script further down pick it up immediately instead of making
  // people sit through its full 9s timeout to find out the same thing.
  window._firebaseBootError = true;
}
