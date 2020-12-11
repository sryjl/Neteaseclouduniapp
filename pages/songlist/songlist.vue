<template>
	<view>
		<view>
			<!-- //背景 -->
			<helang-blur :params="params"></helang-blur>
			<view :class="{nav:true,navAll:isImmersedStatusbar}">
				<!-- 返回+歌单 -->
				<image src="../../static/picture/return.png" mode="aspectFit" @click="goback"></image>
				<text>歌单®</text>
			</view>
			<!-- 图片 -->
			<view v-if="songlist.length!==0">


				<image :src="userDetail.coverImgUrl" mode="aspectFit" class="bookmark"></image>
				<text class="iconfont icon-play Counttext">{{getCount(userDetail.playCount)}}</text>
				<!-- 歌单名字 -->
				<view class="listdetail">
					<view class="listname">
						{{userDetail.name}}
					</view>
					<!-- 用户 -->
					<image :src="userDetail.creator.avatarUrl" mode="aspectFit" class="userimg"></image>
					<view class="username">
						<text>{{userDetail.creator.nickname}}</text>
						<text class="iconfont icon-xiangyou"></text>

					</view>

					<view class="remark">
						<text class="describe">{{userDetail.description?userDetail.description:'编辑信息'}}</text><text class="iconfont icon-xiangyou"></text>
						<text class="iconfont icon-pinglun"></text>
					</view>
				</view>
			</view>

			<!-- 评论 -->

			<!-- 多选 -->

			<view class="myscroll" v-if="songlist.length!==0">
				<view class="listnav">
					<text class="iconfont icon-bofang"></text>
					<text class="allplay">播放全部</text>
					<text class="listnum">（共{{songlist.length}}首）</text>
				</view>
				<scroll-view scroll-y="true" :style="{height:audiolist.length===0?mainHeight+'px':videomainHeight+'px'}">
					<view class="songItem" v-for="(item,index) in songlist" :key='item.id' @click="toThesong(item.fee,item.id)">
						<view class="index">
							<text class="iconfont icon-icon_bofang" v-if="'http://music.163.com/song/media/outer/url?id=' + item.id + '.mp3'===playinfo.src && !paused"></text>
							<text class="indexnum" v-else>{{index + 1}}</text>
						</view>
						<view class="songdetail">
							<view class="songtitle">
								<text class="songname">{{item.name}}</text>
								<text class="songsubname" v-if="item.tns||item.alia.length !==0">（{{item.tns?item.tns[0]:item.alia[0]}})</text>
							</view>
							<view class="singer">
								<text v-if="item.fee === 1" class="vip">vip</text>
								<text v-for="(item1,index1) in item.ar" :key="item1.id">{{index1===0?item1.name:'/'+item1.name}}</text>
								<text>-{{item.al.name}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<zaudio theme="theme3" :autoplay="false" :continue="true" ref="zaudio"></zaudio>
	    <request-loading></request-loading>
	</view>
</template>

<script>
	import zaudio from '@/zaudio/zaudio.vue';
	import toSongDetail from '../../common/toSongDetail.js'
	import createAllSongList from '../../common/createAllSongList.js'
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		mixins: [toSongDetail, createAllSongList],
		components: {
			zaudio
		},
		data() {
			return {
				isImmersedStatusbar:false,
				videomainHeight: 500,
				mainHeight: 500,
				userDetail: '',
				songlist: [],
				songIdList: [],
				params: {
					width: '300rpx',
					height: '400rpx',
					image: "https://mydarling.gitee.io/uniapp-extend/static/images/douyin/4.jpg",
					blur: "xl"
				},
			}
		},
		computed: {
			...mapGetters(['audiolist', 'playinfo', 'paused'])
		},
		methods: {
			...mapMutations(['set_audio', 'set_audiolist']),
			toThesong(e,id) {
				if (e === 1) {
					return this.toSongDetail(this.songIdList, e)
				} else {
	
					if (JSON.stringify(this.songIdList) !== JSON.stringify(this.audiolist) || this.audiolist.length === 0) {
						this.createAllSongList(this.songlist, this.songIdList)
					}
					this.toSongDetail(id,e)
				}
			},
			getCount(num) {
				if (num >= 100000 && num < 100000000) {
					return parseInt(num / 10000) + '万'
				} else if (num >= 100000000) {
					return parseInt(num / 10000000) / 10 + '亿'
				} else {
					return num
				}
			},
			goback() {
				uni.navigateBack()
			},
			async getPlayListDetail(e) {
				if (e == null) return
				const res = await this.$http({
					url: 'playlist/detail',
					data: {
						id: e
					}

				})
				this.userDetail = res.data.playlist
				let urls = ''
				res.data.playlist.trackIds.forEach((item, index) => {
					if (index === 0) {
						urls = item.id
					} else {
						urls = urls + ',' + item.id
					}

				})
				const res1 = await this.$http({
					url: 'song/detail',
					data: {
						ids: urls
					}
				})

				this.songlist = res1.data.songs
				this.params.image = this.userDetail.coverImgUrl
				this.$hideLoading()
				console.log(e)
			}
		},
		onLoad(e) {
			this.$showLoading()	
			const Magnification = uni.getSystemInfoSync().windowWidth / 750
			this.mainHeight = uni.getSystemInfoSync().windowHeight - 550 * Magnification
			this.params.height = uni.getSystemInfoSync().windowHeight + 'px'
			this.params.width = uni.getSystemInfoSync().windowWidth + 'px'
			this.videomainHeight = uni.getSystemInfoSync().windowHeight - 700 * Magnification
			this.getPlayListDetail(e.id)
			// #ifdef APP-PLUS
			if(plus.navigator.isImmersedStatusbar())
			{
				console.log('触发全面屏')
				this.isImmersedStatusbar = true
			}
			else{ //非刘海屏
			this.isImmersedStatusbar = false
			console.log('触发全面屏2')
			 }
			 //#endif
		}
	}
		
</script>

<style lang="less">
	.vip {
		display: inline-block;
		color: #EC4141 !important;
		border: 1px solid #EC4141;
		transform: scale(0.7);
	}

	.listdetail {
		position: absolute;
		top: 150rpx;
		z-index: 1;
		left: 315rpx;

		.userimg {
			margin-top: 10rpx;
			margin-bottom: 10rpx;
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			vertical-align: middle;

		}

		.listname {
			font-size: 35rpx;
			color: #FFFFFF;
			max-width: 400rpx;
		}

		.username {
			margin-top: 10rpx;
			margin-bottom: 10rpx;
			padding-left: 20rpx;
			max-width: 250rpx;
			display: inline-block;
			vertical-align: middle;
			font-size: 25rpx;
			color: #EFEFEF;

			.iconfont {
				font-size: 25rpx;
			}
		}

		.remark {
			font-size: 20rpx;
			color: #EFEFEF;

			.describe {
				display: inline-block;
				margin-left: 80rpx;
				max-width: 250rpx;
				max-height: 100rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			    vertical-align: middle;
			}

			.icon-xiangyou {
				vertical-align: middle;
				font-size: 20rpx;
			}

			.icon-pinglun {
				vertical-align: middle;
				padding-left: 20rpx;
				font-size: 40rpx;
			}
		}
	}

	.bookmark {
		position: absolute;
		top: 150rpx;
		left: 30rpx;
		height: 250rpx;
		width: 250rpx;
		z-index: 1;
		border-radius: 20rpx;
		filter: brightness(75%);
		-webkit-filter: brightness(75%)
	}

	.Counttext {
		top: 160rpx;
		right: 490rpx;
		display: block;
		font-size: 25rpx;
		color: #FFFFFf;
		position: absolute;
		z-index: 2;
	}

	.nav {
		width: 100%;
		position: absolute;
		top: 0;
		z-index: 10086;

		image {
			width: 80rpx;
			height: 80rpx;
			margin-top: 10rpx;
			margin-left: 10rpx;
			vertical-align: middle;
		}

		text {
			vertical-align: middle;
			padding-left: 20rpx;
			font-size: 40rpx;
		}

		color: #FFFFFF;
	}
	.navAll{
		top: 50rpx !important;
	}

	.myscroll {
		position: absolute;
		width: 100%;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;
		top: 450rpx;
		background-color: #FFFFFF;
		z-index: 1;

		.listnav {
			padding-left: 30rpx;
			margin-top: 20rpx;
			height: 80rpx;

			.iconfont {
				font-size: 50rpx;
				vertical-align: middle;
			}

			.allplay {
				font-size: 30rpx;
				vertical-align: middle;
				padding-left: 15rpx;
			}

			.listnum {
				font-size: 25rpx;
				vertical-align: middle;
				color: #808080;
			}
		}

		.songItem {
			margin-left: 30rpx;
			height: 100rpx;

			.songdetail {
				display: inline-block;
				width: 500rpx;
				vertical-align: middle;

				.songtitle {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.songname {
					font-size: 30rpx;
				}

				.songsubname {
					font-size: 30rpx;
					color: #909090;
				}

				.singer {
					font-size: 25rpx;
					color: #909090;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			.index {
				display: inline-block;
				height: 100rpx;
				line-height: 100rpx;
				width: 50rpx;
				padding-right: 30rpx;
				vertical-align: middle;
				text-align: center;

				.iconfont {
					color: #EC4141;
					font-size: 50rpx;
				}

				text {
					display: inline-block;
					color: #909090;
					font-size: 35rpx;
				}
			}
		}

	}
</style>
