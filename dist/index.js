var e=require("lodash"),t=require("firebase/storage"),r=require("path-browserify"),a=require("firebase/app"),n=require("firebase/auth"),o=require("firebase/firestore"),s=require("buffer");function i(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var c=/*#__PURE__*/i(r);function l(t,r,a){t.sort((t,n)=>{const o=e.get(t,r),s=e.get(n,r),i="asc"===a;return Number.isFinite(o)&&Number.isFinite(s)?u(o,s,i):"string"==typeof o&&"string"==typeof s?u(o.toLowerCase(),s.toLowerCase(),i):o instanceof Date&&s instanceof Date?u(o,s,i):u(!!o,!!s,i)})}function u(e,t,r){return e>t?r?1:-1:e<t?r?-1:1:0}function d(t,r){if(!r||e.isEmpty(r))return t;const a=[];return Object.keys(r).map(e=>{const t=function(e,t){if(!t||"string"==typeof t||"number"==typeof t||"boolean"==typeof t)return[{searchField:e,searchValue:t}];const r={};return r[e]=t,function(e){var t=[],r=(e,a)=>{for(var n in a=a||"",e)if(e.hasOwnProperty(n)){const o=e&&e[n],s=a?a+"."+n:n;"object"==typeof o||o instanceof Array?r(o,s):t.push({searchField:s,searchValue:o})}};return r(e,null),t}(r)}(e,r[e]);a.push(...t)}),t.filter(t=>a.reduce((r,a)=>{const n=function(t,r,a){const n=e.get(t,r);return!n&&!a||!!n&&("string"==typeof a?n.toString().toLowerCase().includes(a.toLowerCase()):"boolean"==typeof a||"number"==typeof a?n===a:!!Array.isArray(a)&&a.includes(n))}(t,a.searchField,a.searchValue);return n&&r},!0))}const p=(...e)=>null;class h{title;cacheEnabledKey;constructor(e,t){this.title=e,this.cacheEnabledKey=t}isEnabled(){return!!localStorage.getItem(this.cacheEnabledKey)}SetEnabled(e){e?localStorage.setItem(this.cacheEnabledKey,"true"):localStorage.removeItem(this.cacheEnabledKey)}get log(){return this.isEnabled()?console.log.bind(console,this.title):p}get warn(){return this.isEnabled()?console.warn.bind(console,this.title):p}get error(){return this.isEnabled()?console.error.bind(console,this.title):p}}const g=new h("💸firestore-costs:","LOGGING_FIRESTORE_COSTS_ENABLED"),f="firecosts-single-reads",y=new h("🔥raf:","LOGGING_ENABLED"),m=y.log,w=y.error,b=y.warn;function P(e,t,r){const a=document.getElementById("eventMonitor");if(!a)return void m(`eventMonitor not found to dispatch event ${e} for ${t}`);let n=new CustomEvent(e,{detail:{fileName:t,data:r}});a.dispatchEvent(n)}const D="___REF_FULLPATH_";function R(e){const t={parsedDoc:{},refdocs:[]};return!e||"object"!=typeof e||(Object.keys(e).map(r=>{e[r]=L(e[r],r,t)}),t.parsedDoc=e),t}function L(e,t,r){if(!e)return e;if("object"!=typeof e)return e;if(e.toDate&&"function"==typeof e.toDate)return e.toDate();if(Array.isArray(e))return e.map((e,a)=>L(e,`${t}.${a}`,r));if(F(e)){const a=e;return r.refdocs.push({fieldPath:t,refDocPath:a.path}),a.id}return"object"==typeof e?(Object.keys(e).map(t=>{e[t]=L(e[t],t,r)}),e):e}function F(e){return"string"==typeof e.id&&"object"==typeof e.firestore&&"object"==typeof e.parent&&"string"==typeof e.path}const T=async(r,a)=>{if(!a||"object"!=typeof a)return a;if(e.has(a,"src"))try{const e=await t.getDownloadURL(t.ref(r.storage(),a.src));return{...a,src:e}}catch(e){return w("Error when getting download URL",{error:e}),a}const n=Array.isArray(a);return n?Promise.all(a.map(async(e,t)=>{a[t]=await T(r,e)})):F(a)?a:n||"object"!=typeof a?void 0:Promise.all(Object.keys(a).map(async e=>{const t=a[e];a[e]=await T(r,t)}))};function G(t){if(!t)return b("parseFireStoreDocument: no doc",{doc:t}),{};const r=R(t.data()),a=function(t,r){return r.map(r=>{e.set(t,D+r.fieldPath,r.refDocPath)}),t}(r.parsedDoc,r.refdocs);return{id:t.id,...a}}function E(e,t){if(!e)return t+"";if(!t)throw new Error("Resource name must be a string of length greater than 0 characters");const r="string"==typeof e?e:e(),a=c.default.join("/",r,"/",t,"/");if((a.split("/").length-1)%2)throw new Error('The rootRef path must point to a "document"\n    not a "collection"e.g. /collection/document/ or\n    /collection/document/collection/document/');return a.slice(1,-1)}function v(...e){return c.default.join(...e)}function A(e){const t={uploads:[],refdocs:[],parsedDoc:{}};return!e||"object"!=typeof e||(Object.keys(e).map(r=>{U(e[r],r,t)}),t.parsedDoc=e),t}function U(e,t,r){return e?"string"==typeof t&&t.includes(D)?void r.refdocs.push({fieldDotsPath:t,refPath:e}):"object"!=typeof e?e:e.toDate&&"function"==typeof e.toDate?e.toDate():Array.isArray(e)?e.map((e,a)=>U(e,`${t}.${a}`,r)):e&&e.hasOwnProperty("rawFile")?(r.uploads.push({fieldDotsPath:t,fieldSlashesPath:t.split(".").join("/"),rawFile:e.rawFile}),void delete e.rawFile):(Object.keys(e).map(a=>{U(e[a],`${t}.${a}`,r)}),e):e}class I{_app;_firestore;_storage;_auth;options;constructor(e,r){const s=e||{};this.options=s,this._app=window._app=function(e,t){return t.app?t.app:a.getApps()?.length?a.getApp():a.initializeApp(e)}(r,s),this._firestore=o.getFirestore(this._app),this._storage=t.getStorage(this._app),this._auth=n.getAuth(this._app)}dbGetCollection(e){return o.collection(this._firestore,e)}dbCreateBatch(){return o.writeBatch(this._firestore)}dbMakeNewId(){return o.doc(o.collection(this._firestore,"collections")).id}OnUserLogout(e){this._auth.onAuthStateChanged(t=>{const r=!t;m("FirebaseWrapper.OnUserLogout",{user:t,isLoggedOut:r}),r&&e(t)})}putFile(e,r){const a=t.uploadBytesResumable(t.ref(this._storage,e),r),n=new Promise((e,t)=>a.then(e).catch(t)),o=n.then(e=>t.getDownloadURL(e.ref)).then(e=>e);return{task:a,taskResult:n,downloadUrl:o}}async getStorageDownloadUrl(e){return t.getDownloadURL(t.ref(this._storage,e))}serverTimestamp(){return o.serverTimestamp()}async authSetPersistence(e){let t;switch(e){case"local":t=n.browserLocalPersistence;break;case"none":t=n.inMemoryPersistence;break;default:t=n.browserSessionPersistence}return m("setPersistence",{persistenceInput:e,persistenceResolved:t}),this._auth.setPersistence(t).catch(e=>console.error(e))}async authSigninEmailPassword(e,t){return await n.signInWithEmailAndPassword(this._auth,e,t)}async authSignOut(){return n.signOut(this._auth)}async authGetUserLoggedIn(){return new Promise((e,t)=>{const r=this._auth;if(r.currentUser)return e(r.currentUser);const a=n.onAuthStateChanged(this._auth,r=>{a(),r?e(r):t()})})}async GetUserLogin(){return this.authGetUserLoggedIn()}auth(){return this._auth}storage(){return this._storage}GetApp(){return this._app}db(){return this._firestore}}class S{fireWrapper;constructor(e,t){const r=t||{};m("Auth Client: initializing...",{firebaseConfig:e,options:r}),this.fireWrapper=new I(r,e),r.persistence&&this.setPersistence(r.persistence)}setPersistence(e){return this.fireWrapper.authSetPersistence(e)}async HandleAuthLogin(e){const{username:t,password:r}=e;if(!t||!r)return this.getUserLogin();try{const e=await this.fireWrapper.authSigninEmailPassword(t,r);return m("HandleAuthLogin: user sucessfully logged in",{user:e}),e}catch(t){throw m("HandleAuthLogin: invalid credentials",{params:e}),new Error("Login error: invalid credentials")}}HandleAuthLogout(){return this.fireWrapper.authSignOut()}HandleAuthError(e){return m("HandleAuthLogin: invalid credentials",{errorHttp:e}),"ok"===function(e){if(e>=200&&e<300)return"ok";switch(e){case 401:case 403:return"unauthenticated";default:return"ok"}}(!!e&&e.status)?(m("API is actually authenticated"),Promise.resolve()):(b("Received authentication error from API"),Promise.reject())}async HandleAuthCheck(){return this.getUserLogin()}getUserLogin(){return this.fireWrapper.authGetUserLoggedIn()}async HandleGetPermissions(){try{const e=await this.getUserLogin();return(await e.getIdTokenResult()).claims}catch(e){return m("HandleGetPermission: no user is logged in or tokenResult error",{e:e}),null}}async HandleGetIdentity(){try{const{uid:e,displayName:t,photoURL:r}=await this.getUserLogin();return{id:e,fullName:`${t??""}`,avatar:`${r??""}`}}catch(e){return m("HandleGetIdentity: no user is logged in",{e:e}),null}}async HandleGetJWTAuthTime(){try{const e=await this.getUserLogin();return(await e.getIdTokenResult()).authTime}catch(e){return m("HandleGetJWTAuthTime: no user is logged in or tokenResult error",{e:e}),null}}async HandleGetJWTExpirationTime(){try{const e=await this.getUserLogin();return(await e.getIdTokenResult()).expirationTime}catch(e){return m("HandleGetJWTExpirationTime: no user is logged in or tokenResult error",{e:e}),null}}async HandleGetJWTSignInProvider(){try{const e=await this.getUserLogin();return(await e.getIdTokenResult()).signInProvider}catch(e){return m("HandleGetJWTSignInProvider: no user is logged in or tokenResult error",{e:e}),null}}async HandleGetJWTIssuedAtTime(){try{const e=await this.getUserLogin();return(await e.getIdTokenResult()).issuedAtTime}catch(e){return m("HandleGetJWTIssuedAtTime: no user is logged in or tokenResult error",{e:e}),null}}async HandleGetJWTToken(){try{const e=await this.getUserLogin();return(await e.getIdTokenResult()).token}catch(e){return m("HandleGetJWTToken: no user is logged in or tokenResult error",{e:e}),null}}}class _{fireWrapper;options;flogger;resources={};constructor(e,t,r){this.fireWrapper=e,this.options=t,this.flogger=r,this.fireWrapper.OnUserLogout(()=>{this.resources={}})}async TryGetResource(e,t,r){return t&&await this.RefreshResource(e,r),this.TryGetResourcePromise(e,r)}GetResource(e){const t=this.resources[e];if(!t)throw new Error(`react-admin-firebase: Can't find resource: "${e}"`);return t}async TryGetResourcePromise(e,t){m("resourceManager.TryGetResourcePromise",{relativePath:e,collectionQuery:t}),await this.initPath(e);const r=this.resources[e];if(!r)throw new Error(`react-admin-firebase: Cant find resource: "${e}"`);return r}async RefreshResource(e,t){if(this.options?.lazyLoading?.enabled)throw b("resourceManager.RefreshResource",{warn:"RefreshResource is not available in lazy loading mode"}),new Error("react-admin-firebase: RefreshResource is not available in lazy loading mode");m("resourceManager.RefreshResource",{relativePath:e,collectionQuery:t}),await this.initPath(e);const r=this.resources[e],a=r.collection,n=this.applyQuery(a,t),s=await o.getDocs(n);r.list=[],s.forEach(e=>r.list.push(G(e))),this.flogger.logDocument(s.docs.length)(),m("resourceManager.RefreshResource",{newDocs:s,resource:r,collectionPath:a.path})}async GetSingleDoc(e,t){await this.initPath(e);const r=this.GetResource(e);this.flogger.logDocument(1)();const a=await o.getDoc(o.doc(r.collection,t));if(!a.exists)throw new Error("react-admin-firebase: No id found matching: "+t);const n=G(a);return m("resourceManager.GetSingleDoc",{relativePath:e,resource:r,docId:t,docSnap:a,result:n}),n}async initPath(e){const t=E(this.options&&this.options.rootRef,e),r=!!this.resources[e];if(m("resourceManager.initPath()",{absolutePath:t,hasBeenInited:r}),r)return void m("resourceManager.initPath() has been initialized already...");const a=this.fireWrapper.dbGetCollection(t),n={collection:a,list:[],path:e,pathAbsolute:t};this.resources[e]=n,m("resourceManager.initPath() setting resource...",{resource:n,allResources:this.resources,collection:a,collectionPath:a.path})}async getUserIdentifier(){return this.options.associateUsersById?await this.getCurrentUserId():await this.getCurrentUserEmail()}async getCurrentUserEmail(){const e=await this.fireWrapper.authGetUserLoggedIn();return e?e.email:"annonymous user"}async getCurrentUserId(){const e=await this.fireWrapper.authGetUserLoggedIn();return e?e.uid:"annonymous user"}applyQuery(e,t){const r=t?t(e):e;return m("resourceManager.applyQuery() ...",{collection:e,collectionQuery:(t||"-").toString(),collRef:r}),r}}class k{fireWrapper;options;flogger;rm;constructor(e,t,r){this.fireWrapper=e,this.options=t,this.flogger=r,this.rm=new _(this.fireWrapper,this.options,this.flogger)}checkRemoveIdField(e,t){this.options.dontAddIdFieldToDoc||(e.id=t)}transformToDb(e,t,r){return"function"==typeof this.options.transformToDb?this.options.transformToDb(e,t,r):t}async parseDataAndUpload(t,r,a){if(!a)return a;const n=o.doc(t.collection,r).path,s=A(a).uploads;return await Promise.all(s.map(async t=>{const r=function(e,t,r,a){const n=e instanceof File?e.name.split("."):[],o=n?.length?"."+n.pop():"";return a?v(t,r,e.name):v(t,r+o)}(t.rawFile,n,t.fieldDotsPath,!!this.options.useFileNamesInStorage),o=await this.saveFile(r,t.rawFile);e.set(a,t.fieldDotsPath+".src",o)})),a}async addCreatedByFields(e){return async function(e,t,r,a){if(a.disableMeta)return;const n=await r.getUserIdentifier(),o=function(e){if(e.renameMetaFields&&e.renameMetaFields.created_at)return e.renameMetaFields.created_at;const t=e.metaFieldCasing,r="createdate";return t?"camel"===t?"createDate":"snake"===t?"create_date":"pascal"===t?"CreateDate":"kebab"===t?"create-date":r:r}(a),s=function(e){if(e.renameMetaFields&&e.renameMetaFields.created_by)return e.renameMetaFields.created_by;const t=e.metaFieldCasing,r="createdby";return t?"camel"===t?"createdBy":"snake"===t?"created_by":"pascal"===t?"CreatedBy":"kebab"===t?"created-by":r:r}(a);e[o]=t.serverTimestamp(),e[s]=n}(e,this.fireWrapper,this.rm,this.options)}async addUpdatedByFields(e){return async function(e,t,r,a){if(a.disableMeta)return;const n=await r.getUserIdentifier(),o=function(e){if(e.renameMetaFields&&e.renameMetaFields.updated_at)return e.renameMetaFields.updated_at;const t=e.metaFieldCasing,r="lastupdate";return t?"camel"===t?"lastUpdate":"snake"===t?"last_update":"pascal"===t?"LastUpdate":"kebab"===t?"last-update":r:r}(a),s=function(e){if(e.renameMetaFields&&e.renameMetaFields.updated_by)return e.renameMetaFields.updated_by;const t=e.metaFieldCasing,r="updatedby";return t?"camel"===t?"updatedBy":"snake"===t?"updated_by":"pascal"===t?"UpdatedBy":"kebab"===t?"updated-by":r:r}(a);e[o]=t.serverTimestamp(),e[s]=n}(e,this.fireWrapper,this.rm,this.options)}async saveFile(t,r){m("saveFile() saving file...",{storagePath:t,rawFile:r});try{const{task:e,taskResult:a,downloadUrl:n}=this.fireWrapper.putFile(t,r),{name:o}=r;P("FILE_UPLOAD_WILL_START",o),e.on("state_changed",e=>{const t=e.bytesTransferred/e.totalBytes*100;switch(m("Upload is "+t+"% done"),P("FILE_UPLOAD_PROGRESS",o,t),e.state){case"paused":m("Upload is paused"),P("FILE_UPLOAD_PAUSED",o);break;case"running":m("Upload is running"),P("FILE_UPLOAD_RUNNING",o);break;case"cancelled":m("Upload has been canceled"),P("FILE_UPLOAD_CANCELED",o)}});const[s]=await Promise.all([n,a]);return P("FILE_UPLOAD_COMPLETE",o),P("FILE_SAVED",o),m("saveFile() saved file",{storagePath:t,taskResult:a,getDownloadURL:s}),this.options.relativeFilePaths?t:s}catch(t){"storage/unknown"===e.get(t,"code")?w('saveFile() error saving file, No bucket found! Try clicking "Get Started" in firebase -> storage',{storageError:t}):w("saveFile() error saving file",{storageError:t})}}}async function C(e,t,r,a){const n=s.Buffer.from(JSON.stringify({...t,resourceName:r}),"base64").toString(),i=localStorage.getItem(n);if(!i)return!1;const c=await o.getDoc(o.doc(e,i));return a.logDocument(1)(),!!c.exists()&&c}const M={filters:!0,sort:!0,pagination:!0};async function W(e,t,r,a,n=M){const s=n.filters?(i=t.filter,Object.entries(i).flatMap(([e,t])=>Array.isArray(t)?[o.where(e,"array-contains-any",t)]:"object"==typeof t?Object.entries(t).map(([t,r])=>o.where(e+"."+t,"==",r)):1===Object.keys(i).length&&isNaN(t)&&"string"!=typeof t?[o.where(e,">=",t),o.where(e,"<",t+"z")]:[o.where(e,"==",t)])):[];var i;const c=n.sort?function(e){if(null!=e&&"id"!==e.field){const{field:t,order:r}=e,a=r.toLocaleLowerCase();return[o.orderBy(t,a)]}return[]}(t.sort):[],l=n.pagination?await async function(e,t,r,a,n){const{page:s,perPage:i}=r.pagination;if(1===s)return[o.limit(i)];{let s=await C(e,r,a,n);return s||(s=await async function(e,t,r,a,n){const{page:s,perPage:i}=r.pagination;let c=!1,l=s-1;const u={...r,pagination:{...r.pagination}};for(;!c&&l>1;)l--,u.pagination.page=l,console.log("getting query cursor currentPage=",l),c=await C(e,u,a,n);const d=(s-l)*i,p=1===l?o.query(e,...t,o.limit(d)):o.query(e,...t,o.startAfter(c),o.limit(d)),h=await o.getDocs(p),g=h.docs.length;return n.logDocument(g)(),h.docs[g-1]}(e,t,r,a,n)),[o.startAfter(s),o.limit(i)]}}(e,[...s,...c],t,r,a):[];return{noPagination:o.query(e,...s,...c),withPagination:o.query(e,...s,...c,...l)}}function N(e,t){return{...e,filter:t?{deleted:!1,...e.filter}:e.filter}}class O{options;rm;client;constructor(e,t,r){this.options=e,this.rm=t,this.client=r}async apiGetList(e,t){const r=await this.tryGetResource(e),a=N(t,!!this.options.softDelete);m("apiGetListLazy",{resourceName:e,params:a});const{noPagination:n,withPagination:i}=await W(r.collection,a,e,this.client.flogger),c=await o.getDocs(i),l=c.docs.length;if(!l)return m("apiGetListLazy",{message:"There are not records for given query"}),{data:[],total:0};this.client.flogger.logDocument(l)();const u=c.docs.map(e=>G(e));!function(e,t,r){const a=s.Buffer.from(JSON.stringify({...t,resourceName:r})).toString("base64");localStorage.setItem(a,e.id);const n=`ra-firebase-cursor-keys_${r}`,o=localStorage.getItem(n);if(o){const e=JSON.parse(o).concat(a);localStorage.setItem(n,JSON.stringify(e))}else localStorage.setItem(n,JSON.stringify([a]))}(c.docs[c.docs.length-1],function(e){return{...e,pagination:{...e.pagination,page:e.pagination.page+1}}}(a),e);let d=await o.getCountFromServer(n);if(this.options.relativeFilePaths){const e=await Promise.all(u.map(async e=>{for(let t in e)e[t]=await T(this.client.fireWrapper,e[t]);return e}));return m("apiGetListLazy result",{docs:e,resource:r,collectionPath:r.collection.path}),{data:e,total:d.data().count}}return m("apiGetListLazy result",{docs:u,resource:r,collectionPath:r.collection.path}),{data:u,total:d.data().count}}async apiGetManyReference(e,t){const r=await this.tryGetResource(e);m("apiGetManyReferenceLazy",{resourceName:e,resource:r,reactAdminParams:t});const a={...t.filter,[t.target]:t.id},n=N({...t,filter:a},!!this.options.softDelete),{withPagination:s}=await W(r.collection,n,e,this.client.flogger),i=await o.getDocs(s);this.client.flogger.logDocument(i.docs.length)();const c=i.docs.map(G);if(this.options.relativeFilePaths){const e=await Promise.all(c.map(async e=>{for(let t in e)e[t]=await T(this.client.fireWrapper,e[t]);return e}));return m("apiGetManyReferenceLazy result",{docs:e,resource:r,collectionPath:r.collection.path}),{data:e,total:c.length}}return m("apiGetManyReferenceLazy result",{docs:c,resource:r,collectionPath:r.collection.path}),{data:c,total:c.length}}async tryGetResource(e,t){return this.rm.TryGetResourcePromise(e,t)}}exports.FirebaseAuthProvider=function(e,t){!function(e,t){if(!(e||t&&t.app))throw new Error("Please pass the Firebase firebaseConfig object or options.app to the FirebaseAuthProvider")}(e,t),y.SetEnabled(!!t?.logging);const r=new S(e,t);return{login:e=>r.HandleAuthLogin(e),logout:()=>r.HandleAuthLogout(),checkAuth:()=>r.HandleAuthCheck(),checkError:e=>r.HandleAuthError(e),getPermissions:()=>r.HandleGetPermissions(),getIdentity:()=>r.HandleGetIdentity(),getAuthUser:()=>r.getUserLogin(),getJWTAuthTime:()=>r.HandleGetJWTAuthTime(),getJWTExpirationTime:()=>r.HandleGetJWTExpirationTime(),getJWTSignInProvider:()=>r.HandleGetJWTSignInProvider(),getJWTClaims:()=>r.HandleGetPermissions(),getJWTToken:()=>r.HandleGetJWTToken()}},exports.FirebaseDataProvider=function(e,t){const r=t||{};!function(e,t){if(!(e||t&&t.app))throw new Error("Please pass the Firebase firebaseConfig object or options.app to the FirebaseAuthProvider");t&&t.rootRef&&E(t.rootRef,"test")}(e,r);const a=function(e){return{SetEnabled(e){g.SetEnabled(e)},ResetCount(e){e&&localStorage.removeItem(f)},logDocument(t){if(!e?.lazyLoading?.enabled)return p;const r=function(e=1){const t=localStorage.getItem(f)||"",r=(parseInt(t)||0)+e;return localStorage.setItem(f,r+""),r}(t);return g.log.bind(console,`+${t} (session total=${r} documents read)`)}}}(r);y.SetEnabled(!!r?.logging),a.SetEnabled(!!r?.firestoreCostsLogger?.enabled),a.ResetCount(!r?.firestoreCostsLogger?.persistCount),m("Creating FirebaseDataProvider",{firebaseConfig:e,options:r});const n=new I(t,e);async function s(e){let t;try{return t=await e(),t}catch(e){const r=(e||"").toString(),a=function(e){const t=/\[code\=([\w-]*)/g.exec(e),r=Array.isArray(t)&&t[1];switch(r||w("unknown StatusCode ",{statusTxt:e}),r){case"unauthenticated":return 401;case"permission-denied":return 403;case"internal":return 0;case"invalid-argument":return 400;case"not-found":return 404;case"aborted":return 409;case"resource-exhausted":return 429;case"cancelled":return 499;case"internal":return 500;case"unimplemented":return 501;case"unavailable":return 503;case"deadline-exceeded":return 504;default:return 200}}(r),n={status:a,message:r,json:t};throw w("DataProvider:",e,{errorMsg:r,code:a,errorObj:n}),n}}const i=new k(n,r,a);return{app:n.GetApp(),getList:(e,t)=>s(()=>async function(e,t,r){m("GetList",{resourceName:e,params:t});const{rm:a,fireWrapper:n,options:o}=r;if(o?.lazyLoading?.enabled)return new O(o,a,r).apiGetList(e,t);const s=t.filter||{},i=s.collectionQuery;delete s.collectionQuery;const c=(await a.TryGetResource(e,"REFRESH",i)).list;if(null!=t.sort){const{field:e,order:r}=t.sort;l(c,e,"ASC"===r?"asc":"desc")}let u=c;o.softDelete&&!Object.keys(s).includes("deleted")&&(u=c.filter(e=>!e.deleted));const p=d(u,s),h=(t.pagination.page-1)*t.pagination.perPage,g=p.slice(h,h+t.pagination.perPage),f=p.length;return o.relativeFilePaths?{data:await Promise.all(g.map(e=>T(n,e))),total:f}:{data:g,total:f}}(e,t,i)),getOne:(e,t)=>s(()=>async function(e,t,r){m("GetOne",{resourceName:e,params:t});const{rm:a}=r;try{const n=t.id+"",o=await a.GetSingleDoc(e,n);return r.flogger.logDocument(1)(),{data:o}}catch(r){throw new Error("Error getting id: "+t.id+" from collection: "+e)}}(e,t,i)),getMany:(e,t)=>s(()=>async function(e,t,r){const{rm:a,options:n,fireWrapper:s}=r,i=await a.TryGetResource(e),c=t.ids;m("GetMany",{resourceName:e,resource:i,params:t,ids:c});const l=await Promise.all(c.map(e=>o.getDoc(o.doc(i.collection,"string"==typeof e?e:e.___refid))));r.flogger.logDocument(c.length)();const u=l.map(e=>({...e.data(),id:e.id})),d=n.softDelete?u.filter(e=>!e.deleted):u;return n.relativeFilePaths?{data:await Promise.all(d.map(e=>T(s,e)))}:{data:d}}(e,t,i)),getManyReference:(e,t)=>s(()=>async function(e,t,r){const{rm:a,options:n,fireWrapper:o}=r;m("GetManyReference",{resourceName:e,params:t});const s=t.filter||{},i=s.collectionQuery,c=await a.TryGetResource(e,"REFRESH",i);delete s.collectionQuery,m("apiGetManyReference",{resourceName:e,resource:c,params:t});const u=c.list,p=t.target,h=t.id;let g=u;n.softDelete&&(g=u.filter(e=>!e.deleted));const f=d(g,s),y={};y[p]=h;const w=d(f,y);if(null!=t.sort){const{field:e,order:r}=t.sort;l(w,e,"ASC"===r?"asc":"desc")}const b=(t.pagination.page-1)*t.pagination.perPage,P=w.slice(b,b+t.pagination.perPage),D=w.length;return n.relativeFilePaths?{data:await Promise.all(w.map(e=>T(o,e))),total:D}:{data:P,total:D}}(e,t,i)),update:(e,t)=>s(()=>async function(e,t,r){const{rm:a}=r;m("Update",{resourceName:e,params:t});const n=t.id+"";delete t.data.id;const s=await a.TryGetResource(e);m("Update",{resourceName:e,resource:s,params:t});const i=await r.parseDataAndUpload(s,n,t.data),c={...i};r.checkRemoveIdField(c,n),await r.addUpdatedByFields(c);const l=r.transformToDb(e,c,n);return await o.updateDoc(o.doc(s.collection,n),l),{data:{...i,id:n}}}(e,t,i)),updateMany:(e,t)=>s(()=>async function(e,t,r){const{rm:a}=r;m("UpdateMany",{resourceName:e,params:t}),delete t.data.id;const n=await a.TryGetResource(e);m("UpdateMany",{resourceName:e,resource:n,params:t});const s=t.ids;return{data:await Promise.all(s.map(async a=>{const s=a+"",i=await r.parseDataAndUpload(n,s,t.data),c={...i};r.checkRemoveIdField(c,s),await r.addUpdatedByFields(c);const l=r.transformToDb(e,c,s);return await o.updateDoc(o.doc(n.collection,s),l),{...i,id:s}}))}}(e,t,i)),create:(e,t)=>s(()=>async function(e,t,r){const{rm:a,fireWrapper:n}=r,s=await a.TryGetResource(e);m("Create",{resourceName:e,resource:s,params:t});const i=t.data&&t.data.id;if(m("Create",{hasOverridenDocId:i}),i){const a=t.data.id;if((await o.getDoc(o.doc(s.collection,a))).exists())throw new Error(`the id:"${a}" already exists, please use a unique string if overriding the 'id' field`);const n=await r.parseDataAndUpload(s,a,t.data);if(!a)throw new Error("id must be a valid string");const i={...n};r.checkRemoveIdField(i,a),await r.addCreatedByFields(i),await r.addUpdatedByFields(i);const c=r.transformToDb(e,i,a);return m("Create",{docObj:i}),await o.setDoc(o.doc(s.collection,a),c,{merge:!1}),{data:{...c,id:a}}}const c=n.dbMakeNewId(),l={...await r.parseDataAndUpload(s,c,t.data)};r.checkRemoveIdField(l,c),await r.addCreatedByFields(l),await r.addUpdatedByFields(l);const u=r.transformToDb(e,l,c);return await o.setDoc(o.doc(s.collection,c),u,{merge:!1}),{data:{...u,id:c}}}(e,t,i)),delete:(e,t)=>s(()=>async function(e,t,r){const{rm:a,options:n}=r;if(n.softDelete)return async function(e,t,r){const{rm:a}=r,n=t.id+"",s=await a.TryGetResource(e);m("DeleteSoft",{resourceName:e,resource:s,params:t});const i={deleted:!0};return await r.addUpdatedByFields(i),o.updateDoc(o.doc(s.collection,n),i).catch(e=>{w("DeleteSoft error",{error:e})}),{data:t.previousData}}(e,t,r);const s=await a.TryGetResource(e);m("apiDelete",{resourceName:e,resource:s,params:t});try{const e=t.id+"";await o.deleteDoc(o.doc(s.collection,e))}catch(e){throw new Error(e)}return{data:t.previousData}}(e,t,i)),deleteMany:(e,t)=>s(()=>async function(e,t,r){const{options:a,rm:n,fireWrapper:s}=r;if(a.softDelete)return async function(e,t,r){const{rm:a}=r,n=await a.TryGetResource(e);m("DeleteManySoft",{resourceName:e,resource:n,params:t});const s=t.ids;return{data:await Promise.all(s.map(async e=>{const t=e+"",a={deleted:!0};return await r.addUpdatedByFields(a),o.updateDoc(o.doc(n.collection,t),a).catch(e=>{w("apiSoftDeleteMany error",{error:e})}),t}))}}(e,t,r);const i=await n.TryGetResource(e);m("DeleteMany",{resourceName:e,resource:i,params:t});const c=[],l=s.dbCreateBatch();for(const e of t.ids){const t=o.doc(i.collection,e+"");l.delete(t),c.push(e)}try{await l.commit()}catch(e){throw new Error(e)}return{data:c}}(e,t,i))}};
//# sourceMappingURL=index.js.map
