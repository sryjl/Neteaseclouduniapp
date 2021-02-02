<template>
	<view>
		<view>
			<scroll-view scroll-y="true" :style="{height:audiolist.length===0?mainHeight+'px':videomainHeight+'px'}" class="navbackground">
				<view class="nav">
					<image :src="singerDetail.artist.picUrl" mode="aspectFill" class="navimg"></image>
				</view>
				<view class="singerDetail">
					<view class="getflex"><text class="name">{{singerDetail.artist.name}}</text></view>
					<text class="briefDesc">{{singerDetail.artist.briefDesc}}</text>
				</view>
				<view class="top50">
					<view class="title">
						热歌top50
					</view>
					<view class="topItem" v-for="(item,index) in singerDetail.hotSongs" :key = "item.id">
						{{item.name}}
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
		components: {
			zaudio
		},
		data() {
			return {
				videomainHeight: 500,
				mainHeight: 500,
				singerDetail:{
					artist:{
						picUrl:''
					}
				}
			}
		},
		methods:{
			async getSinger(e){
				const res = await this.$http({
					url:'artists',
					data:{
						id:e
					}
				})
				console.log(res)
				this.singerDetail = res.data
			}
		},
		computed: {
			...mapGetters(['audiolist', 'playinfo'])
		},
		onLoad(e) {
			const Magnification = uni.getSystemInfoSync().windowWidth / 750
			this.mainHeight = uni.getSystemInfoSync().windowHeight
			this.videomainHeight = uni.getSystemInfoSync().windowHeight - 150 * Magnification
			this.getSinger(e.id)
		}
	}
</script>

<style lang="less">
	.top50{
		width: 90%;
		margin: auto;
		margin-top: 50rpx;
		background-color: #FFFFFF;
		border-radius: 40rpx;
		.title{
			margin-left: 40rpx;
			padding-top: 40rpx;
			padding-bottom: 10rpx;
			border: 1px solid #F2F6FC;
			font-weight: bold;
			color: #F56C6C;
		}
		.topItem{
			margin: 10rpx 0;
			margin-left: 40rpx;
			font-size: 28rpx;
			font-weight: bold;
		}
	}
	.nav{
		padding-top:50rpx;
		padding-bottom: 60rpx;
		background-image: url(../../static/picture/banner1.png);
		.navimg{
			display: block;
			width: 250rpx;
			height: 250rpx;
			border-radius: 50%;
			margin: auto;
		}
	}		
	.singerDetail{
			width: 90%;
			height: 300rpx;
			margin: auto;
			background-color: #FFF;
			margin-top: -50rpx;
			border-radius: 40rpx;
			overflow: hidden;
			.getflex{
				display: flex;
				justify-content:center
			}
			.name{
				display: inline-block;
				margin-top: 20rpx;
				font-size: 36rpx;
				font-weight: bold;
			}
			.briefDesc{
				display: block;
				margin: 0 40rpx;
				font-size: 30rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 5;
				-webkit-box-orient: vertical;
			}
		}
	.navbackground{
		background-color: #E4E7ED;
	}
</style>
