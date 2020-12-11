<template>
<view :style="{width:750 +'rpx'}">		
	<view class="videocontainer">
		<view v-show="activeNavId===''">
			请登录后查看视频
		</view>
		<scroll-view scroll-x="true" enable-flex="true" class="navScoll" show-scrollbar="false" scroll-with-animation="true"
		 :scroll-into-view="'scorll'+ activeNavId">
			<view :class="{navItem:true,firstnav:index === 0?true:false,lastnav:index===videoGroupList.length-1?true:false}"
			 v-for="(item,index) in videoGroupList" :key="item.id" :id="'scorll'+ item.id" v-if="item.id !== 1000">
				<view :class="{ navContent:true , active:activeNavId === item.id?true:false }" @click.stop="getactive" :data-item="item.id">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<scroll-view scroll-y="true" class="videoSroll" :style="{height:audiolist.length===0?videoHeight+'px':videoplayHeight +'px'}" lower-threshold=150 @scrolltolower="getMoreVideo"
		 :scroll-top="scrollTop">
			<!-- 第一次遍历取出所有的video种类-->
			<view v-for="(item,index) in allVideolist" :key="item.id" v-show="item.id === activeNavId">
				<!-- 第二次遍历将所有的video种类中的都渲染 -->
				<view class="videoItem" v-for="(item1,index) in item.arr" :key="item1.id">
					<view class="medianav">
						<video class="media" :id="item1.data.vid" :initial-time="initTime" @timeupdate="handleTime" v-if="item1.data.vid === activeVideoid"
						 :src="videoUrl" autoplay="true"></video>
						<image class="media" mode="widthFix" v-if="item1.data.vid !== activeVideoid" :src="item1.data.coverUrl" :data-id="item1.data.vid"
						 @click="loadVideo">

						</image>
						<!-- 播放次数 -->
						<text v-show="item1.data.vid !== activeVideoid" class="playTime iconfont icon-play">{{item1.data.playTime>10000?parseInt(item1.data.playTime/10000) + '万':item1.data.playTime}}</text>
						<!-- 持续时间 -->
						<text v-show="item1.data.vid !== activeVideoid" class="durationms iconfont icon-paixingbang">{{parseInt(item1.data.durationms/1000/60)}}分{{parseInt(item1.data.durationms/1000%60)}}秒</text>
						<!-- 标题 -->
						<image v-show="item1.data.vid !== activeVideoid" src="../../static/icon/bofang.png" mode="aspectFit" class="bofang"
						 :data-id="item1.data.vid" @click="loadVideo"></image>
					</view>
					<view class="title1">{{item1.data.title}}</view>
					<view class="usernav">
						<view class="thisuser">
							<!-- 用户头像 -->
							<image class="createimg" mode="aspectFit" :src="item1.data.creator.avatarUrl"></image>
							<!-- 用户昵称 -->
							<text class="nickname">{{item1.data.creator.nickname}}</text>
						</view>
						<!-- 点赞数 -->

						<text class="iconfont icon-dianzan iconCount"></text>
						<text class="Counttext">{{item1.data.praisedCount}}</text>
						<!-- 评论数 -->
						<text class="iconfont icon-wenda iconCount"></text>
						<text class="Counttext">{{item1.data.commentCount}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
	<zaudio theme="theme3" :autoplay="false" :continue="true" ref="zaudio"></zaudio>
</view>
</template>

<script>
	import zaudio from '@/zaudio/zaudio.vue';
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		components:{zaudio},
		data() {
			return {
				animationData: {},
				videoGroupList: [],
				// 导航标识
				activeNavId: '',
				videolist: [],
				offset: 0,
				activeVideo: '',
				videoUrl: '#',
				activeVideoid: '',
				videoHeight: '',
				videoplayHeight:500,
				//video播放时长
				videoUpdateTime: [],
				initTime: 0,
				indexTag: 0,
				getMoreFlag: 1,
				allVideolist: [],
				scrollTop: -1,
				scrollFlag: 0
			}
		},
		computed: {
			...mapGetters(['audiolist', 'playinfo'])
		},
		methods: {
			async getMoreVideo() {
				//节流阀
				if (!this.getMoreFlag) {
					return
				}
				this.getMoreFlag = 0
				this.offset += 1
				this.indexTag += 1
				//给每个数据上一个index作为key
				const res = await this.$http({
					url: 'video/group',
					data: {
						id: this.activeNavId,
						offset: this.offset
					},
				})
				let index = 8 * this.indexTag;
				let newVideolist = res.data.datas.map(item => {
					item.id = index++
					return item
				})
				let navItem = this.allVideolist.findIndex(item => item.id == this.activeNavId)
				this.allVideolist[navItem].arr.push(...newVideolist)
				this.videolist = this.allVideolist[navItem].arr
				this.getMoreFlag = 1
				//this.activeVideo =this.videolist[0].data.vid

			},
			//处理播放时间
			handleTime(e) {
				let videoTimeObj = {
					vid: e.currentTarget.id,
					currentTime: e.detail.currentTime
				}
				// 判断是否有该记录,有更新,无加入
				let videoItem = this.videoUpdateTime.findIndex(item => item.vid === videoTimeObj.vid)
				if (videoItem !== -1) {
					this.videoUpdateTime[videoItem].currentTime = videoTimeObj.currentTime
				} else {
					this.videoUpdateTime.push(videoTimeObj)
				}
			},
			//获取播放分类
			async getVideoGroupList() {

				// console.log(res)
				const res = await this.$http({
					url: 'video/category/list'
				})
				this.videoGroupList = res.data.data
				//让第一项立刻显示
				this.activeNavId = res.data.data[0].id
				this.getVideoList()

			},
			//存储scrollTop函数,防抖动暂且没做，切换tab会有抖动问题，以后再优化
			saveScollTop() {
				let view = uni.createSelectorQuery().in(this).select(".videoSroll")
				let scrollTopNum = 0
				view.fields({
					size: true,
					scrollOffset: true
				}, data => {
					scrollTopNum = data.scrollTop
				}).exec();
				let navItem = this.allVideolist.findIndex(item => item.id === this.activeNavId)
				if (navItem !== -1) {
					this.allVideolist[navItem].scrollTop = scrollTopNum + 0.00001 * this.scrollFlag
				}
			},
			//点击切换分类
			getactive(e) {
				//阻止多次点击
				// console.log(this.allVideolist)
				if (this.activeNavId === parseInt(e.currentTarget.dataset.item)) {
					return
				}
				this.saveScollTop()
				//得到当前的scrollTop
				this.activeNavId = parseInt(e.currentTarget.dataset.item)
				this.activeVideoid = ''
				let vid = parseInt(e.currentTarget.dataset.item)
				//检测该分类是否被加载
				let navItem = this.allVideolist.findIndex(item => item.id === vid)
				//加载直接取出
				if (navItem !== -1) {
					//
					this.videolist = this.allVideolist[navItem].arr
					this.scrollTop = this.allVideolist[navItem].scrollTop + 0.00001 * this.scrollFlag
					console.log(this.scrollTop)
				} else {
					//无加载加载
					this.scrollFlag++
					this.scrollTop = 0 + 0.00001 * this.scrollFlag
					this.getVideoList()
				}

			},
			//获取随机数用来刷新页面时获取一个随机分页
			getrandomNum() {
				let Anumber = Math.ceil(Math.random() * 50)
				if (Anumber === this.offset) {
					this.getrandomNum()
				} else {
					return this.offset = Anumber
				}
			},
			//获取视频列表
			async getVideoList() {
				const res = await this.$http({
					url: 'video/group',
					data: {
						id: this.activeNavId,
						offset: this.offset
					}
				})
				let index = 0;
				let videolist = res.data.datas.map(item => {
					item.id = index++
					return item
				})
				//已经加载过了，直接替换用于刷新，没有加载过的push进列表，然后显示
				let navItem = this.allVideolist.findIndex(item => item.id === this.activeNavId)
				if (navItem !== -1) {
					console.log(navItem)
					this.allVideolist[navItem].arr = videolist
				} else {
					this.allVideolist.push({
						id: this.activeNavId,
						arr: videolist,
						scrollTop: 0
					})
					//保证加载的时候有数据
				}
				this.videolist = videolist
				console.log(this.scrollTop)
				//this.activeVideo =this.videolist[0].data.vid

			},
			//获取视频播放链接
			async loadVideo(e) {
				//判断是否有播放时间记录
				let vid = e.currentTarget.dataset.id
				let videoItem = this.videoUpdateTime.find(item => item.vid === vid)
				if (videoItem) {
					//有从记录的时间开始播放
					this.initTime = videoItem.currentTime
				} else {
					// 没有就从0开始
					this.initTime = 0
				}
				const res = await this.$http({
					url: 'video/url',
					data: {
						id: vid
					},
				})
				console.log(res)
				this.activeVideoid = e.currentTarget.dataset.id
				this.videoUrl = res.data.urls[0].url
			}
		},
		onLoad() {
			//获取播放分类初始化
			const val = uni.getStorageSync('cookietoken')
			if (val) {
				this.getVideoGroupList()
				//获取view-scoll的的height
				const Magnification = uni.getSystemInfoSync().windowWidth / 750
				this.videoHeight = uni.getSystemInfoSync().windowHeight - 110 * Magnification - 1
				this.videoplayHeight = uni.getSystemInfoSync().windowHeight - 260 * Magnification - 1
			}
		},
		onPullDownRefresh() {
			//获取一个随机数
			this.getrandomNum()
			//this.getVideoList()
			//半秒后进行刷新
			setTimeout(() => {
				this.getVideoList()
				uni.stopPullDownRefresh();
				uni.showToast({
					icon: 'none',
					title: '发现了更多内容',
					duration: 1000
				})
			}, 500);
		}
	}
</script>

<style lang="less">
	.videocontainer {
		background-color: #F1F3F4;
	}

	.navScoll {
		display: flex;
		white-space: nowrap;
		background-color: #FFFFFF;
		border-bottom: 1px solid #E9EBEC;
		padding-left: 30rpx;

		.navItem {
			display: inline-block;
			margin: 0 30rpx;
			margin-top: 40rpx;
			padding-bottom: 10rpx;
			font-size: 30rpx;
			height: 60rpx;
			line-height: 60rpx;
		}

		.firstnav {
			margin-left: 0 !important;
		}

		.lastnav {
			padding-right: 30rpx;
		}

		.active {
			border-bottom: 2px solid #EC4141;
		}
	}

	.videoSroll {
		overflow-anchor: none;

		.videoItem {
			background-color: #FFFFFF;
			padding-top: 40rpx;
			margin-bottom: 20rpx;
			border-radius: 20rpx;

			.medianav {
				position: relative;

				.media {
					display: block;
					width: 688rpx;
					height: 387rpx;
					margin: 0 31rpx;
					border-radius: 20rpx;
				}

				.playTime {
					display: block;
					position: absolute;
					bottom: 10rpx;
					font-size: 20rpx;
					left: 51rpx !important;
					white-space: nowrap;
					color: #FFFFFF;
					right: 31rpx;
				}

				.durationms {
					display: block;
					position: absolute;
					bottom: 10rpx;
					font-size: 20rpx;
					right: 51rpx !important;
					white-space: nowrap;
					color: #FFFFFF;
					right: 31rpx;
				}

				.bofang {
					display: block;
					position: absolute;
					height: 80rpx;
					width: 80rpx;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}

			}


			.usernav {
				height: 80rpx;
				width: 100%;

				.thisuser {
					display: inline-block;
					margin-left: 30rpx;
					margin-top: 15rpx;
					height: 50rpx;
					width: 475rpx;

					.createimg {
						vertical-align: middle;
						height: 50rpx;
						width: 50rpx;
						border-radius: 50%;
					}

					.nickname {
						display: inline-block;
						vertical-align: middle;
						width: 400rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						height: 50rpx;
						line-height: 50rpx;
						font-size: 30rpx;
						transform: scale(0.9);
					}

				}


			}

			.Counttext {
				display: inline-block;
				height: 20rpx;
				width: 50rpx;
				font-size: 15rpx;
				color: #808080;
				transform: translate(-20rpx, 5rpx);
				vertical-align: top;
			}

			.iconCount {
				display: inline-block;
				font-size: 30rpx;
				transform: translateY(5rpx);
			}


		}
	}

	.title1 {
		display: inline-block;
		width: 710rpx;
		padding: 20rpx 30rpx;
		font-size: 30rpx;
		border-bottom: 1px solid #E9EBEC;
	}
</style>
