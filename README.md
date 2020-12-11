# Neteaseclouduniapp
##食用指南
本项目依赖于@Binaryify所编写的后端接口
项目api地址：https://binaryify.github.io/NeteaseCloudMusicApi/#/
项目git地址：https://github.com/Binaryify/NeteaseCloudMusicApi
注：不支持线上项目，仅支持本地演示
1.需要使用nodejs允许该接口，默认为3000端口
2.需要在request.js(封装的uni.request)文件中添加请求地址
3.本项目基于uniapp，请下载并在HbuildX打开运行
4.感谢@金刚腿 编写的z-audio后台播放插件，本项目的音乐播放基于该插件
5.感谢@微风r 编写的歌词插件
##
### 2020/12/11
完成首页页面搭建，完成每日推荐页面搭建，实现所有可以看到歌曲的播放功能，实现进入歌单功能，搭建播放详情页面功能，实现歌词获取并展示功能，实现切换音乐功能
实现喜欢音乐功能并配备提示，实现评论页面搭建，评论按钮一键跳出评论框（暂未做提交修改功能，原因是这个很简单，以后有时间写），搜索功能，只支持搜索歌曲和歌单，原因是歌手页面和用户页面没有写。
如果有需求的可以自己写一下，由于是重复的机械劳动，所以以后有时间会慢慢添加
首页的五个按钮，只完成的每日推荐，其他四个按钮大同小异，喜欢的可以自己来写一下，基本就是遍历数据然后搭建页面，然后跳转各自的页面就好了，以后有时间也会慢慢添加。
### 2020/11/29
修改bug，将原本部分渲染切换的视频tab改为用v-show全部渲染，使客户端的浏览效果更好，切换tab记录scrollTop实现切换tab保持高度（暂未完成点赞功能，进入评论功能，tab栏切换动画）
### 2020/11/28
完成视频页面的搭建，实现包括获取视频，刷新视频，下拉加载更多等功能，给下拉加载做了节流阀，防止key出错
### 2020/11/24
基本完成个人信息界面，解决了搜索界面的小bug，导入了vue-cookie来管理cookie（h5+app端采用plus，小程序采取本地存储方案【暂没有写】），实现了退出，登陆功能以及跳转
### 2020/11/20 
做好了封面，以及基于手机号和邮箱的登陆功能，为适配小程序，所以采用localStorage存储cookietoken 
### 2020/11/19
做好了搜索界面的ui搭建,实现功能有，热搜榜，更多热搜，模糊搜索，历史记录，删除历史记录
