
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/home/index","pages/user/index","pages/video/index","pages/search/index","pages/login/emaillogin","pages/login/phonelogin","pages/login/index"],"window":{"navigationBarTextStyle":"white","navigationBarTitleText":"静流的云音乐","navigationBarBackgroundColor":"#EC4141","backgroundColor":"#F8F8F8"},"tabBar":{"color":"#000000","selectedColor":"#D9220C","backgroundColor":"#FFFFFF","borderStyle":"black","list":[{"pagePath":"pages/home/index","text":"首页","iconPath":"static/icon/home.png","selectedIconPath":"static/icon/home-check.png"},{"pagePath":"pages/search/index","text":"搜索","iconPath":"static/icon/search.png","selectedIconPath":"static/icon/search-check.png"},{"pagePath":"pages/video/index","text":"视频","iconPath":"static/icon/video.png","selectedIconPath":"static/icon/video-check.png"},{"pagePath":"pages/user/index","text":"我的","iconPath":"static/icon/user.png","selectedIconPath":"static/icon/user-check.png"}]},"nvueCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"Neteasecloud","compilerVersion":"2.9.8","entryPagePath":"pages/home/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/home/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"静流的云音乐","enablePullDownRefresh":false}},{"path":"/pages/user/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"静流的云音乐","enablePullDownRefresh":false,"scrollIndicator":"none"}},{"path":"/pages/video/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"静流的云音乐","enablePullDownRefresh":false}},{"path":"/pages/search/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"静流的云音乐"}},{"path":"/pages/login/emaillogin","meta":{},"window":{"navigationBarTitleText":"网易邮箱账号登陆","enablePullDownRefresh":false}},{"path":"/pages/login/phonelogin","meta":{},"window":{"navigationBarTitleText":"手机号码登陆","enablePullDownRefresh":false}},{"path":"/pages/login/index","meta":{},"window":{"navigationBarTitleText":"登陆","enablePullDownRefresh":false}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});