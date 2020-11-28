<template>
	<view class="videocontainer">
		<scroll-view scroll-x="true" enable-flex="true" class="navScoll" show-scrollbar="false" scroll-with-animation="true"
		 :scroll-into-view="'scorll'+ activeNavId">
			<view :class="{navItem:true,firstnav:index==0?true:false,lastnav:index==videoGroupList.length-1?true:false}" v-for="(item,index) in videoGroupList"
			 :key="item.id" :id="'scorll'+ item.id" v-if="item.id !== 1000">
				<view :class="{ navContent:true , active:activeNavId == item.id?true:false }" @click="getactive" :data-item="item.id">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<scroll-view scroll-y="true" class="videoSroll" :style="{height:videoHeight+'px'}" lower-threshold = 150 @scrolltolower="getMoreVideo">
			<view class="videoItem" v-for="(item,index) in videolist" :key="item.id">
				<view class="medianav">
					<video class="media" :id="item.data.vid" :initial-time="initTime" @timeupdate="handleTime" v-if="item.data.vid == activeVideoid"
					 :src="videoUrl" autoplay="true"></video>
					<image class="media" mode="widthFix" v-else :src="item.data.coverUrl" :data-id="item.data.vid" @click="loadVodeo">

					</image>
					<!-- 播放次数 -->
					<text v-if="item.data.vid !== activeVideoid" class="playTime iconfont icon-play">{{item.data.playTime>10000?parseInt(item.data.playTime/10000) + '万':item.data.playTime}}</text>
					<!-- 持续时间 -->
					<text v-if="item.data.vid !== activeVideoid" class="durationms iconfont icon-paixingbang">{{parseInt(item.data.durationms/1000/60)}}分{{parseInt(item.data.durationms/1000%60)}}秒</text>
					<!-- 标题 -->
					<image v-if="item.data.vid !== activeVideoid" src="../../static/icon/bofang.png" mode="aspectFit" class="bofang"
					 :data-id="item.data.vid" @click="loadVodeo"></image>
				</view>
				<view class="title">{{item.data.title}}</view>
				<view class="usernav">
					<view class="thisuser">


						<!-- 用户头像 -->
						<image class="createimg" mode="aspectFit" :src="item.data.creator.avatarUrl"></image>
						<!-- 用户昵称 -->
						<text class="nickname">{{item.data.creator.nickname}}</text>
					</view>
					<!-- 点赞数 -->

					<text class="iconfont icon-dianzan iconCount"></text>
					<text class="Counttext">{{item.data.praisedCount}}</text>
					<!-- 评论数 -->
					<text class="iconfont icon-wenda iconCount"></text>
					<text class="Counttext">{{item.data.commentCount}}</text>

				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				videoGroupList: [],
				// 导航标识
				activeNavId: '',
				videolist: [],
				offset: 0,
				activeVideo: '',
				videoUrl: '',
				activeVideoid: '',
				videoHeight: '',
				//video播放时长
				videoUpdateTime: [],
				initTime: 0,
				indexTag:0,
				getMoreFlag:1
			}
		},
		methods: {
			getMoreVideo(){
				if(!this.getMoreFlag){
					return
				}
				this.getMoreFlag = 0
				console.log(this.getMoreFlag)
				console.log('到底了')
				this.offset +=1
				this.indexTag +=1
				console.log(this.offset)
				uni.request({
					url: 'http://localhost:3000/video/group',
					data: {
						id: this.activeNavId,
						offset: this.offset
					},
					withCredentials: true,
					success: (res) => {
						let index = 8 * this.indexTag;
						console.log(index)
						let newVideolist = res.data.datas.map(item => {
							item.id = index++
							return item
						})
						this.videolist.push(...newVideolist)
						this.getMoreFlag = 1
						//this.activeVideo =this.videolist[0].data.vid
					}
				})	
			},
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
			getVideoGroupList() {
				uni.request({
					url: 'http://localhost:3000/video/category/list',
					withCredentials: true,
					success: (res) => {
						// console.log(res)
						this.videoGroupList = res.data.data
						this.activeNavId = res.data.data[0].id
						this.getVideoList()
					}
				})

			},
			getactive(e) {
				this.activeNavId = e.currentTarget.dataset.item
				this.activeVideoid = ''
				this.getVideoList()
			},
			getrandomNum(){
				let Anumber = Math.ceil(Math.random()*50)
				if(Anumber === this.offset){
					this.getrandomNum()
				}else{
					return this.offset = Anumber
				}
			},
			getVideoList() {
				uni.request({
					url: 'http://localhost:3000/video/group',
					data: {
						id: this.activeNavId,
						offset: this.offset
					},
					withCredentials: true,
					success: (res) => {
						let index = 0;
						this.videolist = res.data.datas.map(item => {
							item.id = index++
							return item
						})
						//this.activeVideo =this.videolist[0].data.vid
					}
				})
			},
			loadVodeo(e) {
				let vid = e.currentTarget.dataset.id
				let videoItem = this.videoUpdateTime.find(item => item.vid === vid)
				if (videoItem) {
					this.initTime = videoItem.currentTime
				}
				uni.request({
					url: 'http://localhost:3000/video/url',
					data: {
						id: vid
					},
					withCredentials: true,
					success: (res) => {
						console.log(res)
						this.activeVideoid = e.currentTarget.dataset.id
						this.videoUrl = res.data.urls[0].url
						// console.log(this.videoUrl)

					}
				})
			}
		},
		onLoad() {
			this.getVideoGroupList()
			const Magnification = uni.getSystemInfoSync().windowWidth / 720
			this.videoHeight = uni.getSystemInfoSync().windowHeight - 100 * Magnification - 1
		},
		onPullDownRefresh() {
			console.log('refresh')
			this.getrandomNum()
			console.log(this.offset)			
			//this.getVideoList()
			setTimeout(() =>{
				this.getVideoList()
				uni.stopPullDownRefresh();
				uni.showToast({
					icon:'none',
					title:'发现了更多内容',
					duration:1000
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
				transform: translate(-20rpx, 5rpx) scale(0.8);
				vertical-align: top;
			}

			.iconCount {
				display: inline-block;
				font-size: 30rpx;
				transform: translateY(5rpx);
			}


		}
	}

	.title {
		display: inline-block;
		width: 710rpx;
		padding: 20rpx 30rpx;
		font-size: 30rpx;
		border-bottom: 1px solid #E9EBEC;
	}
</style>
