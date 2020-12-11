//自写组件关于x轴的滑动窗口
<template>
	<view>
		<view class="recommendsong">
			<view class="recommendheader">
				<text>{{title}}</text>
				<view>
					<navigator :url="url"><button type="default" plain="true">{{detail}}</button></navigator>
				</view>
			</view>
			<scroll-view scroll-x="true" class="recommendsonglist" enable-flex="true">
				<view v-for="(item,index) in list" :key="item.resourceId" class="listItem" >
					<view v-if="typeStyle === 1 " @click="tosonglist(item.resourceId)">
						<image :src="item.uiElement.image.imageUrl" mode="aspectFit" lazy-load='true'></image>
						<text>{{item.uiElement.mainTitle.title}}</text>
						<text class="iconfont icon-play playCount">{{getCount(item.resourceExtInfo.playCount)}}</text>
					</view>
					<view v-if="typeStyle === 2 ">
						<image :src="item.verticalCover" mode="aspectFit" lazy-load='true'></image>
						<text>{{item.title}}</text>
						<text class="iconfont icon-hot playCount">{{item.popularity}}·{{item.privateTag}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "AuiScrollView",
		props: {
			typeStyle: {
				type: Number,
				default: 1
			},
			title: {
				type: String,
				default: ''
			},
			url: {
				type: String,
				default: '1111'
			},
			detail: {
				type: String,
				default: ''
			},
			list: {
				type: Array,
				default: [111]
			}
		},
		methods: {
			getCount(num) {
				if (num >= 100000 && num < 100000000) {
					return parseInt(num / 10000) + '万'
				} else if (num >= 100000000) {
					return parseInt(num / 10000000) / 10 + '亿'
				} else {
					return num
				}
			},
			tosonglist(e){
				console.log(e)
				uni.navigateTo({
					url:'../songlist/songlist?id='+e,
				})
			},
			
		}
	}
</script>

<style lang="less">
	.recommendsonglist {
		display: flex;
		white-space: nowrap;
		.listItem:first-child {
			padding-left: 30rpx;
		}

		.listItem:last-child {
			padding-right: 10rpx;
		}

		.listItem {
			display: inline-block;
			position: relative;
			width: 200rpx;
			margin-right: 20rpx;
			vertical-align: top;
			image {
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
				filter: brightness(75%);
			}

			text {
				//显示两行会有兼容性问题（好像，暂且先这么写了）
				width: 200rpx;
				line-height: 30rpx;
				font-size: 25rpx;
				white-space: normal;
				color: #808080;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.playCount {
				position: absolute;
				top: 2%;
				right: 0;
				color: #FFFFFF;
			}
		}
	}

	.recommendsong {
		margin-top: 30rpx;
		margin-bottom: 60rpx;
		.recommendheader {
			display: flex;
			align-items: center;
			width: 100%;
			height: 100rpx;
			justify-content: space-between;

			text {
				display: block;
				white-space: nowrap;
				padding-left: 30rpx;
				font-weight: bold;
				font-size: 35rpx;
			}

			view {
				padding-right: 30rpx;
				display: inline-block;
				width: 200rpx;

				navigator {
					width: 200rpx;
					border-radius: 40rpx;

					button {
						height: 50rpx;
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
			}
		}
	}
</style>
