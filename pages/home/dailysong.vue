<template>
	<view :style="{height:windowHeight+'px'}">

		<view class="main" :style="{height:windowHeight+'px'}">
			<!-- 头部 -->
			<!-- 导航图片 -->
			<image src="../../static/picture/banner2.png" mode="aspectFill" lazy-load='true'></image>
			<!-- 导航日期 -->
			<view class="date">
				<text class="day">{{thisDay}}</text>
				<text class="month">/{{thisMonth}}</text>
			</view>
			<!-- 历史日推 /没有会员看不了，所以不做详细功能-->
			<view class="daylist">
				历史日推
			</view>
			<!-- 日推 -->
			<view class="songlist">
				<view class="header">
					<text class="iconfont icon-bofang"></text>
					<text class="playtxt">播放全部</text>
				</view>
				<view class="songs">
					<scroll-view scroll-y="true" :style="{height:audiolist.length===0?mainHeight+'px':videomainHeight+'px'}">
						<view class="songItem" v-for="(item,index) in songlist" :key="item.id" @click="toSongDetail(item.id,item.fee)">

							<image :src="item.al.picUrl" mode="aspectFit" lazy-load='true'></image>
							<view class="titleContent">
								<view class="title">
									<text>{{item.name}}</text>
									<text v-if="item.alia.length>0" class="alia">({{item.alia[0]}})</text>
								</view>
								<view class="artist">
									<text class="fee" v-show="item.fee === 1">vip</text>
									<text class="artist" v-for="(item1,index1) in item.ar" :key="index1">{{index1 ===0?'':'/'}}{{item1.name}}</text>
									<text class="artist">-{{item.al.name}}</text>
								</view>
							</view>
							<text class="iconfont icon-icon_bofang" v-if="'http://music.163.com/song/media/outer/url?id=' + item.id + '.mp3'===playinfo.src && !paused"></text>
							<text class="iconfont icon-bofang" v-else></text>
							
						</view>
					</scroll-view>
				</view>
			</view>

		</view>
		<zaudio theme="theme3" :autoplay="false" :continue="true" ref="zaudio"></zaudio>
		<request-loading></request-loading>
	</view>
</template>

<script>
	import zaudio from '@/zaudio/zaudio.vue';
	import toSongDetail from '../../common/toSongDetail.js'
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		//混用跳转到播放界面方法
		mixins:[toSongDetail],
		components: {
			zaudio
		},
		data() {
			return {
				windowHeight: 500,
				videomainHeight: 500,
				mainHeight: 500,
				thisDay: '',
				thisMonth: '',
				songlist: [],
				songIdList: [],
			}
		},
		computed: {
			...mapGetters(['audiolist', 'playinfo','paused'])
		},
		methods: {
			...mapMutations(['set_audio', 'set_playinfo', 'set_renderIndex', 'set_audiolist']),
			//获取今天的日期
			getDate() {
				let myDate = new Date();
				const month = myDate.getMonth() + 1
				const day = myDate.getDate()
				if (month < 10) {
					this.thisMonth = '0' + month
				} else {
					this.thisMonth = month
				}
				if (day < 10) {
					this.thisDay = '0' + day
				} else {
					this.thisDay = day
				}
			},
			async getsonglist() {
				const res = await this.$http({
					url: 'recommend/songs',
				})

				this.songlist = res.data.data.dailySongs
				//没必要一开始加载就生成性能也许会很差，后面改
				res.data.data.dailySongs.forEach(item => {
					if (item.fee === 1) return
					let singername = ''
					item.ar.forEach((item, index) => {
						if (index === 0) {
							singername = item.name
						} else {
							singername = singername + '/' + item.name
						}
					})

					this.songIdList.push({
						src: 'http://music.163.com/song/media/outer/url?id=' + item.id + '.mp3',
						title: item.name,
						singerid: item.ar.map(item => {
							return {
								id: item.id,
								name: item.name
							}
						}),
						singer: singername,
						coverImgUrl:item.al.picUrl,
						id:item.id
					})
					

				})
			    this.$hideLoading()
			}
			

		},
		onLoad() {
			this.$showLoading()	
			this.getDate()
			this.getsonglist()
			const Magnification = uni.getSystemInfoSync().windowWidth / 750
			this.mainHeight = uni.getSystemInfoSync().windowHeight - 400 * Magnification
			this.videomainHeight = uni.getSystemInfoSync().windowHeight - 550 * Magnification
			this.windowHeight = uni.getSystemInfoSync().windowHeight
			// this.$hideLoading()
		}
	}
</script>

<style lang="less">
	.songItem {
		image {
			height: 100rpx;
			width: 100rpx;
		}
	}

	.main {
		position: relative;

		.songItem {
			margin-left: 30rpx;
			height: 120rpx;

			image {
				margin-top: 10rpx;
				height: 100rpx;
				width: 100rpx;
				vertical-align: middle;
				border-radius: 15rpx;
			}

			.icon-bofang {
				font-size: 50rpx;
				margin-left: 20rpx;
				color: #808080;
				vertical-align: middle;
			}
			.icon-icon_bofang{
				font-size: 50rpx;
				margin-left: 20rpx;
				color: #EC4141;
				vertical-align: middle;
			}

			.titleContent {
				display: inline-block;
				vertical-align: middle;
				width: 500rpx;

				view {
					margin-left: 20rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.title {
					font-size: 30rpx;

					.alia {
						padding-left: 10rpx;
						color: #808080;
					}
				}

				.artist {
					padding-top: 5rpx;
					font-size: 25rpx;
					color: #808080;
				}

				.fee {
					display: inline-block;
					transform: scale(0.7);
					margin-top: 5rpx;
					padding: 0 2px;
					margin-right: 5px;
					color: red;
					border: 1px solid red;
				}
			}
		}



		image {
			width: 100%;
			height: 525rpx;
			opacity: 0.7
		}

		.date {
			display: block;
			position: absolute;
			top: 120rpx;
			left: 50rpx;
			color: #FFFFFF;

			.day {
				font-size: 70rpx;
				text-shadow: 10rpx 10rpx 10rpx #000000;
			}

			.month {
				font-size: 40rpx;
			}
		}

		.daylist {
			position: absolute;
			width: 120rpx;
			height: 50rpx;
			background-color: rgba(192, 192, 192, 0.8);
			top: 220rpx;
			left: 50rpx;
			border-radius: 20rpx;
			text-align: center;
			font-size: 25rpx;
			line-height: 50rpx;

		}

		.songlist {
			position: absolute;
			top: 300rpx;
			height: 600rpx;
			width: 100%;
			background-color: #FFFFFF;
			border-top-left-radius: 40rpx;
			border-top-right-radius: 40rpx;

			.header {
				padding-left: 30rpx;
				margin-top: 20rpx;
				height: 80rpx;

				text {
					height: 60rpx;
					line-height: 60rpx;
				}

				.icon-bofang {
					font-size: 50rpx;
					vertical-align: middle;
				}

				.playtxt {
					font-size: 30rpx;
					vertical-align: middle;
					padding-left: 15rpx;
				}
			}
		}
	}
</style>
