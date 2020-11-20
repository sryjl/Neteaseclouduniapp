<template>
	<view :style="{height:swiperHeight+'px',borderTop:'2px solid #FFFFFF'}">
		<!-- 动感图标 -->
		<view class="container">
			<view class="dot">
				<image src="../../static/icon/muisc.png" mode="aspectFit"></image>
			</view>
			<view class="pulse">
			</view>
			<view class="pulse1">
			</view>
		</view>
		<!-- button登陆按钮 -->
		<view class="button">
			<view class="buttonchild">
				<navigator url="/pages/login/emaillogin"><button type="default" plain>邮箱登陆</button></navigator>
				<navigator url="/pages/login/phonelogin"><button type="default" plain>手机登陆</button></navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperHeight: 500
			};
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => { // 需要使用箭头函数，swiper 高度才能设置成功
					// 获取swiperHeight可以获取的高度，窗口高度减去导航栏高度
					this.swiperHeight = res.windowHeight - 2
				}
			});
		}

	}
</script>

<style lang="less">
	@import '../../static/css/borderanimate.css';

	view {
		background-color: #EC4141;

		.container {
			height: 70%;
			position: relative;

			.dot {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				height: 150rpx;
				width: 150rpx;
				border-radius: 50%;
				background-color: #FF0033;

				image {
					position: absolute;
					left: 48%;
					top: 45%;
					transform: translate(-50%, -50%);
					height: 100rpx;
					width: 100rpx;
				}
			}
		}

		.button {
			position: relative;
			height: 30%;
			.buttonchild {
				width: 50%;
				position: absolute;
				left:25%;
				top:25%;					
				navigator {
					width: 100%;
					height: 70rpx;
					border-radius: 50px;
					margin-bottom: 30rpx;
					button {
						color: #FFFFFF;
						line-height: 70rpx;
						font-size: 28rpx;
						border-radius: 50rpx;
						border: 1rpx solid #DADCE0;

					}

				}
			}
		}

	}
</style>
