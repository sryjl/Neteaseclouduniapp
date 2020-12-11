<template>
	<view>
	<scroll-view scroll-y="true" :style="{height:audiolist.length===0?mainHeight+'px':videomainHeight+'px'}">
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" class="banners" circular>
			<swiper-item v-for="(item,index) in swiperList" :key="parseInt(item.bannerId)">
				<view class="swiper-item">
					<image :src="item.pic" mode="aspectFill" lazy-load='true'></image>
				</view>
			</swiper-item>
		</swiper>
		<!-- 图标区域 -->
		<view class="navContainer">

			<view class="navItem" @click="enterDailysong">
				<text class="iconfont icon-rili"></text>
				<text class="icontxt">每日推荐</text>
			</view>
			<view class="navItem">
				<text class="iconfont icon-icon--"></text>
				<text class="icontxt">私人FM</text>
			</view>
			<view class="navItem">
				<text class="iconfont icon-gedan"></text>
				<text class="icontxt">歌单广场</text>
			</view>
			<view class="navItem">
				<text class="iconfont icon-paixingbang"></text>
				<text class="icontxt">排行榜</text>
			</view>
			<view class="navItem">
				<text class="iconfont icon-diantai"></text>
				<text class="icontxt">电台</text>
			</view>
		</view>
		<!-- 推荐歌单 -->
		<aui-scroll-view title="推荐歌单" detail="查看更多" :list="recommendsonglist"></aui-scroll-view>
		<!-- 私人订制 这玩意肯定要用swiper写-->
		<view class="personlsongheader">
			<view class="personalNav">
				<view>
				<text class="mainTitle">{{personalsongTitle.mainTitle.title}}</text>
				<text class="subTitle">{{personalsongTitle.subTitle.title}}</text>
				</view>
				<view>
					<button type="default" class="iconfont icon-play" plain="true">播放</button>
				</view>
				
			</view>
			<!-- <button type="default" plain="true" class="iconfont icon-play">播放</button> -->
			<swiper :indicator-dots="false" :autoplay="false" :duration="1000" class="personalsongheader" next-margin='60rpx'>
				<swiper-item v-for="(item,index) in personalsong" :key="index" class="personalsongItem">
					<view class="personalItem" v-for="(item1,index1) in item.resources" :key="item1.resourceId" @click="toSongDetail(item1.resourceExtInfo.songData.id,item1.resourceExtInfo.songData.fee)">
						<image :src="item1.uiElement.image.imageUrl" mode="aspectFit"></image>
						<view class="describe">
							<text class="title">{{item1.uiElement.mainTitle.title}}</text>
							<text class="name" v-for="(item2,index2) in item1.resourceExtInfo.artists" :key="item2.id">{{index2===0?'&nbsp;-&nbsp;':'/'}}{{item2.name}}</text>
							<view v-if="item1.uiElement.subTitle" :class="{extra:true,tag:item1.uiElement.subTitle.titleType==='songRcmdTag'}">
								<text >
									{{item1.uiElement.subTitle.title}}
								</text>
							</view>
						</view>
						<text class="iconfont icon-icon_bofang bofang" v-if="'http://music.163.com/song/media/outer/url?id=' + item1.resourceExtInfo.songData.id + '.mp3'===playinfo.src && !paused"></text>
                        <text class="iconfont icon-bofang bofang" v-else></text>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 音乐日历 -->
		<!-- 专属场景歌单 -->
		<aui-scroll-view title="专属场景歌单" detail="查看更多" :list="forulist"></aui-scroll-view>
		<!-- 大家都在听 没找到接口-->
		<!-- 直播 白色的火太阴间了，不过直播本来就很阴间，不准备做直播详细模块，sorr -->
		<aui-scroll-view v-show="livelist.length !== 0" title="语音直播" detail="查看更多" :list="livelist" :typeStyle='2'></aui-scroll-view>
		<!-- 排行榜 -->
		<!-- 电台推荐 -->
		<!-- <aui-scroll-view title="孤独的心此处安放" detail="查看更多" :list="djlist" :typeStyle='3'></aui-scroll-view> -->
		
	</scroll-view>
	<zaudio theme="theme3" :autoplay="false" :continue="true" ref="zaudio"></zaudio>
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
		components:{zaudio},
		mixins:[toSongDetail],
		data() {
			return {
				videomainHeight: 500,
				mainHeight: 500,
				swiperList: [],
				recommendsonglist: [],
				personalsong: [],
				personalsongTitle: {
					subTitle: {
						title: "未知标题",
					},
					mainTitle: {
						title: "未知标题",
					}
				},
				forulist: [],
				livelist: [],
				djlist:[],
				//私人定制的音乐列表
				songIdList:[]
			}
		},
		computed: {
			...mapGetters(['audiolist', 'playinfo','paused'])
		},
		methods: {
			...mapMutations(['set_audio', 'set_playinfo', 'set_renderIndex', 'set_audiolist']),
			enterDailysong(){
				uni.navigateTo({
					url:'./dailysong'
				})
			},
			//获取轮播图（包括链接等，不过里面有歌单也有链接....实现点击功能还要分类）
			async getBanner() {
						const res = await this.$http({
							url:'banner?type=1'
						})
						this.swiperList = res.data.banners
			},
			async gethomepage(timestamp) {
						const res = await this.$http({
							url:'homepage/block/page',
							data:{
								timestamp:timestamp
							},
						})
						const val = uni.getStorageSync('cookietoken')
						//由于有cookie的请求和无cookie的请求所获取的数据不同，但用相同的部分
						//所以在有cookie的时候和无cookie的时候取得对象不同
						let first = 0
						let second = 1 
						let third = 2
						if(val){
							this.livelist = res.data.data.blocks[3].extInfo
						}else{
							first = 1
							second = 2
							third = 4
						}
						
						res.data.data.blocks[first].creatives.forEach(item => {
							this.recommendsonglist.push(item.resources[0])
						})
						res.data.data.blocks[third].creatives.forEach(item => {
							this.forulist.push(item.resources[0])
						})
						
						this.personalsong = res.data.data.blocks[second].creatives
						this.personalsongTitle = res.data.data.blocks[second].uiElement
						//看起来性能不佳，到时候改成点击的时候传入
						console.log(this.personalsong)
						this.personalsong.forEach(item=>{
							item.resources.forEach(item=>{
								if(item.resourceExtInfo.songData.fee===1) return
								let cover = item.uiElement.image.imageUrl
								let songArtists =[]
								let singer=''
								item.resourceExtInfo.artists.forEach((item,index) =>{
									songArtists.push({
										id:item.id,
										name:item.name
									})
									if(index ===0){
										singer =singer +item.name
									}else{
										singer = singer+'/'+item.name
									}
								})
								this.songIdList.push({
									src:'http://music.163.com/song/media/outer/url?id='+item.resourceExtInfo.songData.id+'.mp3',
									id:item.resourceExtInfo.songData.id,
									title:item.resourceExtInfo.songData.name,
									singer:singer,
									coverImgUrl:cover,
									singerid:songArtists
									})
							})
						})
						console.log(this.songIdList)
			},
		},
		onLoad() {
			// 因为同请求浏览器会缓存，导致重构页面后不会发送请求，这里添加时间戳，发送不同请求
			let timestamp = Date.parse( new Date());
			this.getBanner()
			this.gethomepage(timestamp)
			const Magnification = uni.getSystemInfoSync().windowWidth / 750
			this.mainHeight = uni.getSystemInfoSync().windowHeight 
			this.videomainHeight = uni.getSystemInfoSync().windowHeight - 150 * Magnification
		}
	}
</script>

<style lang="less">
	.icon-icon_bofang{
		color: red !important;
	}
	.banners {
		width: 100%;
		height: 300rpx;

		.swiper-item {
			position: relative;

			image {
				position: absolute;
				left: 50%;
				transform: translate(-50%, 27rpx);
				width: 702rpx;
				height: 273rpx;
				border-radius: 20rpx;
			}
		}
	}

	.navContainer {
		display: flex;

		.navItem {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 20%;

			.iconfont {
				width: 80rpx;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 40rpx;
				font-weight: bold;
				border-radius: 50%;
				background-color: #EC4141;
				color: #fff;
				text-align: center;
				margin-top: 20rpx;
				margin-bottom: 10rpx;
			}

			.icontxt {
				font-size: 25rpx;
				color: #909090;
			}
		}
	}


	.personlsongheader {
		margin-top: 30rpx;
		margin-bottom: 60rpx;
		.personalNav {
			display: flex;
			justify-content: space-between;
			margin-left: 30rpx;
			margin-bottom: 20rpx;
			height: 70rpx;
			view{
				display: inline-block;
			}
			.mainTitle {
				display: block;
				height: 30rpx;
				line-height: 30rpx;
				font-size: 25rpx;
				color: #808080;
			}
			.subTitle {
				display: block;
				height: 40rpx;
				line-height: 40rpx;
				font-size: 35rpx;
				font-weight: bold; 
			}
		   button {   
			width:150rpx;
			height: 50rpx;
			margin-right: 30rpx;
			line-height: 45rpx;
			color: #808080;
			font-size: 25rpx;
			border-radius: 40rpx;
			border: 1px solid #999999;
		}
		
		  button::after {
			border: none;
		}		


		}

		.personalsongheader {
			height: 360rpx;

			.personalsongItem {
				height: 360rpx;

				.personalItem {
					position: relative;
					height: 120rpx;

					image {
						position: absolute;
						margin-left: 30rpx;
						border-radius: 15rpx;
						top: 10rpx;
						height: 100rpx;
						width: 100rpx;
					}
					.bofang{
						display: block;
						position: absolute;
						font-size: 60rpx;
						top:30rpx;
						left:600rpx;
						color:#808080
					}

					.describe {
						position: absolute;
						width: 400rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						left: 150rpx;
						top: 50%;
						transform: translate(0, -50%);

						.title {
							font-size: 30rpx;
						}

						.name {
							font-size: 25rpx;
							color: #808080;
						}

						.extra {
							display: block;
							width: 400rpx;
							font-size: 25rpx;
							color: #808080;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						.tag {
							color: red;
							text{
								padding: 0 10rpx;
								background-color: rgb(245, 212, 217);
								border-radius: 10rpx;
							}
						}
					}
				}
			}
		}
	}

</style>
