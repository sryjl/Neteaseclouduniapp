<template>
	<view>
		<view class="navlist">
			<text :class="{active:type===1}" @click="getactive(1)">单曲</text>
			<text :class="{active:type===1000}" @click="getactive(1000)">歌单</text>
			<text :class="{active:type===100}" @click="getactive(100)">歌手</text>
			<text :class="{active:type===10}" @click="getactive(10)">专辑</text>
			<text :class="{active:type===1002}" @click="getactive(1002)">用户</text>
		</view>
		<view>
			<scroll-view scroll-y="true" :style="{height:audiolist.length===0?mainHeight+'px':videomainHeight+'px'}">
				<view class="songitem" v-for="(item,index) in songlist" :key = 'item.id' v-show ="type===1" @click="Toplaysong(item)">
					<text class="songName">{{item.name}}</text>
					<view class="singer">
						<text v-if="item.fee === 1" class="vip">vip</text>
						<text v-for="(item1,index1) in item.ar" :key = 'index1'>{{index1===0?item1.name:'/'+item1.name}}</text>
					    <text>-{{item.al.name}}</text>		
					</view>
				</view>
			    <view class="songlistItem" v-show="type===1000" v-for="(item,index) in playlists" :key = 'item.id' @click="tosonglist(item.id)">
					<image :src="item.coverImgUrl" mode="aspectFit" lazy-load="true"></image>
			        <view class="songlistdetail">
			        	<text class="name">{{item.name}}</text>
						<text class="creator">{{item.trackCount}}首，by{{item.creator.nickname}}，播放{{item.playCount}}次</text>
			        </view>
				</view>
				<view class="geli">
					
				</view>
			</scroll-view>
		</view>
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
		mixins: [toSongDetail],
		components: {
			zaudio
		},
		data() {
			return {
				key:'',
				videomainHeight: 500,
				mainHeight: 500,
				offset:0,
				type:1,
				// 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
				// 因为不想做的很复杂，暂时就先只支持，单曲，专辑，歌手，用户，这四个
				songlist:[],
				userprofiles:[],
				playlists:[],
				songIdList:[]
			}
		},
		methods:{
			...mapMutations(['set_audio', 'set_audiolist']),
			Toplaysong(item){
				if (item.fee === 1) return
				let singername = ''
				item.ar.forEach((item, index) => {
					if (index === 0) {
						singername = item.name
					} else {
						singername = singername + '/' + item.name
					}
				})
				let songdetail = {
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
	         		}
				this.songIdList = [songdetail]
				console.log(this.songIdList)
				this.toSongDetail(item.id,item.fee)
			},
			tosonglist(e){
				uni.navigateTo({
					url:'../songlist/songlist?id='+e,
				})
			},
			getactive(e){
				console.log(e)
				if(e===this.type) return
				this.type=e
				this.getsearch(this.key,this.type)
			},
			async getsearch(key,type){
				const res = await this.$http({
					url:"cloudsearch",
					data:{
						keywords:key,
						type:type,
						offset:this.offset
					}
				})
				console.log(res)
				let count = 0
				if(type===1){
					this.songlist = res.data.result.songs
					count = res.data.result.songCount
				}else if(type === 1000){
					this.playlists = res.data.result.playlists
					count =res.data.result.playlistCount
				}
				
				uni.setNavigationBarTitle({
					title:'搜索结果('+count+')'
				})
				
			}
		},
		computed: {
			...mapGetters(['audiolist', 'playinfo', 'paused'])
		},
		onLoad(e) {
			this.key =e.keyword
			this.getsearch(e.keyword,1)
			const Magnification = uni.getSystemInfoSync().windowWidth / 750
			this.mainHeight = uni.getSystemInfoSync().windowHeight-80* Magnification -1
			this.videomainHeight = uni.getSystemInfoSync().windowHeight - 230 * Magnification -1

		}
	}
</script>

<style lang="less">
	.vip{
		display: inline-block;
		border:1px solid red;
		color: red;
		transform: scale(0.7);
		margin-right: 10rpx;
	}
	.geli{
		width: 100%;
		height: 30rpx;
		background-color: #FFFFFF;
	}
	.songlistItem{
		margin-top: 30rpx;
		margin-left: 30rpx;
		margin-right: 20rpx;
		image{
			width: 120rpx;
			height: 120rpx;
			border-radius: 10rpx;
			vertical-align: middle;
		}
		.songlistdetail{
			display: inline-block;
			width: 550rpx;
			margin-left: 20rpx;
			vertical-align: middle;
			text{
				display: block;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.name{
				font-size: 30rpx;
				padding-bottom: 10rpx;
			}
			.creator{
				font-size: 25rpx;
				color: #909090;
			}
		}
	}
	.navlist{
		display: flex;
		justify-content: space-around;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 30rpx;
		.active{
			border-bottom: 3px solid #EC4141;
		}
	}
	.songitem{
		margin:20rpx 10rpx 10rpx 40rpx;
		max-width: 600rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		.songName{
			font-size: 30rpx;
		}
		.singer{
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			font-size: 25rpx;
			color:#808080
		}
	}
</style>
