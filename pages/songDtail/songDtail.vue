<template>
	<view>
		<!-- 高斯模糊背景 -->
		<helang-blur :params="params"></helang-blur>
		<!-- 头部 -->
		<view :class="{nav:true,navAll:isImmersedStatusbar}">
			<image src="../../static/picture/return.png" mode="aspectFill" @click="goback"></image>
			<view class="songnav">
				<text :class="{songname:true,songnamelong:renderData('title').length<=18}">{{ renderData('title')}}</text>
				<view class="artist">
					<text>{{ renderData('singer') }}</text>
					<text class="iconfont icon-xiangyou"></text>
				</view>

			</view>

		</view>
		<zaudio theme="theme1" :autoplay="false" :continue="true" ref="zaudio" :getcommentnum="true" :isone="isone"></zaudio>
		<!-- 主体 -->
		<view v-if="lyricsIsshow" class="gecilan" :style="{height:mainHeight}" @click="controllshow(false)">
			<bing-lyric :lyrics="lyrics" :centerStyle="centerStyle" :curTime="playinfo.current_value" :areaStyle="cuAreaStyle"
			 :lyricStyle="lyricStyle"></bing-lyric>
		</view>

		<view v-else @click="controllshow(true)">
			<image src="../../static/picture/aag.png" :class="{aag:true,aagplay:!paused, aagchange:changePlay,navAll1:isImmersedStatusbar}"
			 mode="aspectFit"> </image>
			<image src="../../static/picture/play.png" mode="aspectFit" :class="{play:true,playAnimation:!changePlay,playpaused:paused,navAll2:isImmersedStatusbar}"></image>
			<image :src="renderData('coverImgUrl')" mode="aspectFill" :style="" :class="{play:true, playpic:true,playAnimation:!changePlay,playpaused:paused,navAll2:isImmersedStatusbar}">
			</image>
		</view>

		<!-- 下栏 -->

		<view class="playnav">
			<image src="../../static/picture/lovered.png" mode="aspectFit" class="icon" v-if="islike" @click.stop="getlike(false)"></image>
			<image src="../../static/picture/love.png" mode="aspectFit" class="icon" v-else @click.stop="getlike(true)"></image>
			<image src="../../static/picture/circle.png" mode="aspectFit" class="icon" v-if="!isone" @click.stop="changeMode(true)"></image>
			<image src="../../static/picture/onecircle.png" mode="aspectFit" class="icon" v-else @click.stop="changeMode(false)"></image>
			<image src="../../static/picture/prev.png" mode="aspectFit" class="icon" @click="changeplay(-1)"></image>
			<image src="../../static/picture/play2.png" mode="aspectFit" class="icon1" @click="operation" v-if="renderData('paused')"></image>
			<image src="../../static/picture/pause.png" mode="aspectFit" class="icon1" @click="operation" v-else></image>
			<image src="../../static/picture/next.png" mode="aspectFit" class="icon" @click="changeplay(1)"></image>
			<image src="../../static/picture/remark.png" mode="aspectFit" class="icon" @click="toComment()"></image>
			<image src="../../static/picture/list.png" mode="aspectFit" class="icon"  @click="toggle"></image>

		</view>

		<text class="count" @click="toComment()">{{commitCount}}</text>
		<uni-popup ref="popup" type="bottom" :animation="true">
			
			<view class="popup-content">
				<text class="present">当前播放</text><text class="aduiolist">({{audiolist.length}})</text>
				<scroll-view scroll-y="true" :style="{height:750+'rpx'}" class="allsonglist">
					<view v-for="(item,index) in audiolist" :key = 'index' :class="{songlistItem:true,active:item.src === playinfo.src}"  @click="changeThePlay(index)">
						<text class="title">
							{{item.title}}
						</text>
						<text class="singer">
						    -{{item.singer}}
						</text>
						<image src="../../static/picture/delete.png" mode="aspectFit" class="icon" style="float: right;margin-right:50rpx ;" v-if="item.src !== playinfo.src" @click.stop="deleteFromList(index)"></image>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import zaudio from '@/zaudio/zaudio.vue';
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import {
		formatSeconds
	} from '../../zaudio/util.js';
	export default {
		components: {
			zaudio
		},
		data() {
			return {
				lyricsIsshow: false,
				centerStyle: {
					btnImg: '../../static/icon/btn.png',
				},
				lyricStyle: {},
				cuAreaStyle: {
					width: '100vw',
					height: '500rpx'
				},
				lyrics: [],
				isImmersedStatusbar: false,
				realcount: 0,
				commitCount: '',
				params: {
					width: '300px',
					height: '200px',
					image: "https://mydarling.gitee.io/uniapp-extend/static/images/douyin/4.jpg",
					blur: "xl"
				},
				songId: 14514,
				changePlay: false,
				islike: false,
				renderid: 0,
				mainHeight: ''
			}
		},
		computed: {
			format() {
				return num => formatSeconds(num);
			},
			...mapGetters(['audiolist', 'playIndex', 'playinfo', 'paused', 'renderIsPlay', 'audio', 'renderIndex','isone']),
			renderData() {
				return name => {
					if (!this.renderIsPlay) {
						if (name == 'paused') {
							return true;
						}
						return this.audio[name];
					} else {
						if (name == 'paused') {
							return this.paused;
						}
						return this.playinfo[name];
					}
				};
			}
		},

		methods: {
			...mapMutations(['set_delaudiolist','set_isone','set_audio', 'set_playinfo', 'set_pause', 'set_n_pause', 'set_renderIndex', 'set_audiolist']),
			// 获取歌词
			toggle() {
				this.$refs.popup.open()
			},
			async getlyric() {
				const res = await this.$http({
					url: 'lyric',
					data: {
						id: this.songId,
					}
				})
				if (res.data.nolyric || res.data.uncollected) {
					return this.lyrics = []
				}
				const arr = res.data.lrc.lyric.split("\n")
				this.lyrics = []
				this.lyrics.push(...arr)
				//将求取的id赋给渲染id
				this.renderid = this.songId
			},
			deleteFromList(index){
				this.set_delaudiolist(index)
			},
			controllshow(val) {
				//只有当需要获取歌词且渲染的id不等于当前的id才请求
				if (val === true && this.renderid !== this.songId) {
					this.getlyric()
				}
				this.lyricsIsshow = val
			},
			toComment() {
				uni.navigateTo({
					url: '../comment/comment?id=' + this.songId + '&type=0' + "&num=" + this.realcount
				})
			},
			goback() {
				uni.navigateBack()
			},
			play(key) {
				//渲染指定的列表索引, 方法1: 
				// this.set_renderIndex(key);

				// 指定列表中具体信息, 方法2:
				this.set_audio(this.audiolist[key]);

				// 播放音频
				this.$refs.zaudio.operation(true);
			},
			operation(status) {
				const {
					duration,
					current,
					duration_value,
					current_value,
					src
				} = this.playinfo;
				const {
					src: renderSrc,
					title: renderTitle,
					singer: renderSinger,
					coverImgUrl: renderCoverImgUrl
				} = this.audio;
				//渲染与播放地址 不同
				if (!this.renderIsPlay) {
					if (this.paused || status) {
						// 播放 渲染的数据

						this.$audio.src = renderSrc;
						this.$audio.title = renderTitle;
						this.$audio.singer = renderSinger;
						this.$audio.coverImgUrl = renderCoverImgUrl || this.default_cover;

						this.$audio.startTime = 0;
						this.$audio.seek(0);

						this.$audio.play();

						this.set_pause(false);

						this.set_playinfo({
							src: renderSrc,
							title: renderTitle,
							singer: renderSinger,
							coverImgUrl: renderCoverImgUrl
						});
					} else {
						//暂停
						this.$audio.pause();
						this.set_pause(true);
						this.set_n_pause(true);
					}
				} else {

					//渲染与播放地址相同
					if (this.paused) {
						this.$audio.play();

						this.$audio.startTime = parseFloat(current_value);
						this.$audio.seek(parseFloat(current_value));

						this.set_pause(false);

						this.set_playinfo({
							src: renderSrc,
							title: renderTitle,
							singer: renderSinger,
							coverImgUrl: renderCoverImgUrl
						});
					} else {
						this.$audio.pause();
						this.set_pause(true);
						this.set_n_pause(true);
					}
				}
				this.params.image = this.audio.coverImgUrl
			},
			// 单曲循环和列表循环的切换
			changeMode(boolen) {
				this.set_isone(boolen)
				if (boolen) {
					uni.showToast({
						icon: "none",
						title: "已开启单曲循环",
						duration: 1000
					})
				} else {
					uni.showToast({
						icon: "none",
						title: "已开启列表循环",
						duration: 1000
					})
				}
			},
			changeplay(count) {
				this.changePlay = true
				var nowindex = this.renderIndex;
				nowindex += count;
				nowindex = nowindex < 0 ? this.audiolist.length - 1 : nowindex > this.audiolist.length - 1 ? 0 : nowindex;
				this.set_pause(true);
				//更新渲染数据的索引值
				this.set_renderIndex(nowindex);
				this.operation();
				this.getCommitNum()
				this.like()
				if (this.lyricsIsshow) {
					this.songId = this.audiolist[nowindex].id
					this.getlyric()
				}
				//设置0.5s的重置动画
				setTimeout(() => {
					this.changePlay = false
				}, 500)
			},
			
			changeThePlay(count) {
				this.changePlay = true
				var nowindex = count
				this.set_pause(true);
				//更新渲染数据的索引值
				this.set_renderIndex(nowindex);
				this.operation();
				this.getCommitNum()
				this.like()
				if (this.lyricsIsshow) {
					this.songId = this.audiolist[nowindex].id
					this.getlyric()
				}
				//设置0.5s的重置动画
				setTimeout(() => {
					this.changePlay = false
				}, 500)
			},
			
			
			async getlike(boolen) {
				const res = await this.$http({
					url: 'like',
					data: {
						id: this.songId,
						like: boolen
					}
				})
				if (res.data.code === 200) {
					this.islike = boolen
					if (boolen === true) {
						uni.showToast({
							icon: "none",
							title: "已加入我喜欢",
							duration: 1000
						})
					} else {
						uni.showToast({
							icon: "none",
							title: "已取消我喜欢",
							duration: 1000
						})
					}
				} else {
					uni.showToast({
						icon: "none",
						title: "操作失败",
						duration: 1000
					})
				}
			},
			async like() {

				let res = await this.$http({
					url: 'likelist',
					data: {
						uid: uni.getStorageSync('userid'),
						timestamp: Date.parse(new Date())
					}
				})
				const res1 = res.data.ids.find((item) => {
					return item === this.songId
				})
				if (res1) {
					this.islike = true
				} else {
					this.islike = false
				}
			},
			async getCommitNum() {
				let key = this.audiolist.findIndex(i => i.src == this.playinfo.src)
				this.songId = this.audiolist[key].id
				let res = await this.$http({
					url: 'comment/music?id=' + this.audiolist[key].id + '&limit=1'
				})
				let count = res.data.total
				this.realcount = res.data.total
				if (count < 1000) {
					this.commitCount = count
				} else if (count > 1000 && count < 10000) {
					this.commitCount = '999+'
				} else if (count > 10000 && count < 100000) {
					this.commitCount = '1w+'
				} else {
					this.commitCount = '10w+'
				}
			}
		},
		onLoad(e) {

			this.params.height = uni.getSystemInfoSync().windowHeight + 'px'
			this.params.width = uni.getSystemInfoSync().windowWidth + 'px'
			const Magnification = uni.getSystemInfoSync().windowWidth / 750
			this.cuAreaStyle.height = uni.getSystemInfoSync().windowHeight - 390 * Magnification + 'px'
			this.mainHeight = uni.getSystemInfoSync().windowHeight - 390 * Magnification + 'px'
			// this.set_audiolist({
			// 	data: this.songlist,
			// 	status: false
			// });	
			this.params.image = this.audio.coverImgUrl
			// #ifdef APP-PLUS
			if (plus.navigator.isImmersedStatusbar()) {
				console.log('触发全面屏')
				this.isImmersedStatusbar = true
			} else { //非刘海屏
				this.isImmersedStatusbar = false
				console.log('触发全面屏2')
			}
			//#endif
			this.getCommitNum()
			this.like()
			// this.getlyric()
			//监听更新
			uni.$on('updata', () => {
				this.getCommitNum()
				this.like()
				if (this.lyricsIsshow) {
					this.getlyric()
				}

			})
		},
		onUnload() {
			// 移除监听事件  
			uni.$off('updata');
		},

		onShow() {
			//渲染当前列表中歌曲的播放的进度
			//必须放在onShow中
			this.set_renderIndex(this.playIndex);
			this.params.image = this.audio.coverImgUrl
			this.getCommitNum()
			this.like()
		},

	}
</script>

<style lang="less">
	.popup-content {
		width: 90%;
		background-color: #fff;
		padding: 30rpx 0;
		margin-left:5% ;
		border-radius: 40rpx;
		margin-bottom: 40rpx;
		.present{
			margin-left: 30rpx;
			font-size: 32rpx;
			font-weight: bold;
		}
		.aduiolist{
			font-size: 26rpx;
			color: #808080;
		}
		.allsonglist{
			margin-left: 30rpx;
			margin-top: 20rpx;
			.songlistItem{
				margin-bottom: 20rpx;
			}
			.active{
				color: red;
				text{
					font-weight: bold;
				}
			}
			text{
				display: inline-block;
				max-width: 270rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.singer{
				font-size: 26rpx;
				color: #808080;
			}
		}
	}
	.gecilan {
		position: absolute;
		top: 150rpx;
		width: 100%;
		z-index: 10091;
	}

	.navAll {
		top: 80rpx !important;
	}

	.count {
		display: block;
		position: absolute;
		z-index: 1;
		bottom: 85rpx;
		right: 110rpx;
		font-size: 25rpx;
		width: 50rpx;
		color: #FFFFFF;
	}

	.icon {
		height: 40rpx;
		width: 40rpx;
		vertical-align: middle;
		margin: 0 30rpx;
	}

	.nav {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100rpx;
		z-index: 1;

		image {
			width: 80rpx;
			height: 80rpx;
			margin-top: 10rpx;
			margin-left: 10rpx;
			vertical-align: middle;
		}

		.songnav {
			max-width: 350rpx;
			white-space: nowrap;
			overflow: hidden;
			display: inline-block;
			vertical-align: middle;

			.artist {
				margin-left: 30rpx;
				font-size: 28rpx;
				color: #808080
			}

			.iconfont {
				font-size: 25rpx;
			}

			.songname {
				display: inline-block;
				white-space: nowrap;
				margin-left: 30rpx;
				font-size: 30rpx;
				color: #FFFFFF;
				animation: 20s wordsLoop linear infinite normal;
			}

			.songnamelong {
				animation: 0s
			}
		}
	}

	@keyframes wordsLoop {
		0% {
			transform: translateX(200px);
			-webkit-transform: translateX(200px);
		}

		100% {
			transform: translateX(-100%);
			-webkit-transform: translateX(-100%);
		}
	}

	@-webkit-keyframes wordsLoop {
		0% {
			transform: translateX(200px);
			-webkit-transform: translateX(200px);
		}

		100% {
			transform: translateX(-100%);
			-webkit-transform: translateX(-100%);
		}
	}

	.aag {
		position: absolute;
		top: 100rpx;
		z-index: 2;
		height: 366rpx;
		width: 222rpx;
		left: 50%;
		transform-origin: 60rpx 60rpx;
		transform: translate(-61rpx, 0) rotate(-25deg);
		transition: transform 0.5s;
	}

	.navAll1 {
		top: 250rpx !important;
	}

	.aagplay {
		transform: translate(-61rpx, 0) rotate(0deg);
	}

	.aagchange {
		transform: translate(-61rpx, 0) rotate(-25deg);
		transition: transform 0.5s;
	}

	.play {
		position: absolute;
		width: 500rpx;
		height: 500rpx;
		top: 570rpx;
		z-index: 1;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.navAll2 {
		top: 720rpx !important;
	}

	.playpic {
		transform: translate(-50%, -50%);
		height: 320rpx;
		width: 320rpx;
		border-radius: 50%;
		z-index: 2;
	}

	.playAnimation {
		animation: disc 20s linear infinite;
	}

	.playpaused {
		animation-play-state: paused;
	}

	//css3动画
	@keyframes disc {
		from {
			transform: translate(-50%, -50%) rotate(0deg);
		}

		to {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}

	.playnav {
		position: absolute;
		z-index: 1;
		height: 100rpx;
		bottom: 30rpx;

		.icon1 {
			width: 100rpx;
			height: 100rpx;
			vertical-align: middle;
			margin: 0 25rpx;
		}
	}
</style>
