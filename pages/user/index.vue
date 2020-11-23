<template>
	<view class="main">
		<!-- 用户头像背景等级等 -->
		<view class="userpic">
			<image class="userimg" v-if="userimg !=''" :src="userimg" mode="aspectFit"></image>
		    <image class="userimg" v-if="userimg == ''" src="../../static/picture/nahatenahte.png" mode="aspectFit" @click="login"></image>
			<image class="userbg" v-if="userbackground !=''" :src="userbackground" mode="aspectFill"></image>
			<image class="userbg" v-if="userbackground ==''" src="../../static/picture/nahateaile.png" mode="aspectFill"></image>
			<view class="username">
				{{username}}
			</view>
			<view class="username" v-if="userid == ''">
				点击头像登陆
			</view>
			<view class="userlevel">
				Lv.{{userlevel}}
			</view>
			<view class="userlevel" v-if="userid == ''">
				Lv.0
			</view>
		</view>
		<!-- 用户粉丝和关注 -->
		<view class="userdetail">
			<view class="userlike">
				<text class="data">{{listenSongs}}</text>
				<text class="write">听过</text>
			</view>
			<view class="userlisetn">
				<text class="data">{{usercreatelistnum}}</text>
				<text class="write">歌单</text>
			</view>
			<view class="follow">
				<text class="data">{{follow}}</text>
				<text class="write">关注</text>
			</view>
			<view class="fans">
				<text class="data">{{fans}}</text>
				<text class="write">粉丝</text>
			</view>
		</view>
		<!-- card模组 歌单，等级，我的评论等等等的card-->
		<view class="card">
			<!-- 最近播放 -->
			<navigator class="musicicon">
				<image class="musicnavgate " src="../../static/icon/ranklist.png" mode="aspectFit"></image>
				<text class="textlike">听歌排行</text>
				<text class="textdescribe" v-if="listenSongs != ''">累计听歌{{listenSongs}}首</text>
			</navigator>

			<!-- 我喜欢的音乐 -->
			<navigator class="musicicon">
				<image class="musicnavgate " src="../../static/icon/love.png" mode="aspectFit"></image>
				<text class="textlike">我喜欢的音乐</text>
				<text class="textdescribe" v-if="trackCount != ''">{{trackCount}}首，播放{{playCount}}次</text>
			</navigator>
		</view>


		<view class="card2">
			<!-- 我的歌单 自建-->
			<text class="title">我的歌单<text v-if="usersonglist.length>0">({{usercreatelistnum}}个，被收藏{{playlistBeSubscribedCount}}次)</text></text>
			<scroll-view scroll-x="true" enable-flex="true" class="songlistScroll" v-if="usersonglist.length>0">
				<view v-for="(item,index) in usersonglist" v-if="index>=1" :class="{creatItem:true,havepadding:index==usersonglist.length-1?true:false}"
				 :key="item.id">
					<image :src="item.coverImgUrl" mode="aspectFit"></image>
				</view>
			</scroll-view>
			<view v-else class="wait">
				<text>暂无歌单</text>
			</view>
		</view>
		<!-- 我的歌单收藏 -->
		<view class="card3">
			<text class="title">收藏歌单</text>
			<scroll-view scroll-x="true" enable-flex="true" class="songlistScroll" v-if="userlikelist.length>0">
				<view v-for="(item,index) in userlikelist" :class="{creatItem:true,havepadding:index==userlikelist.length-1?true:false}"
				 :key="item.id">
					<image :src="item.coverImgUrl" mode="aspectFit"></image>
				</view>
			</scroll-view>
			<view v-else class="wait">
				<text>暂无歌单</text>
			</view>
		</view>
		<!-- 登出按钮 -->
		<view class="loginout">
			<button type="default" plain @click="loginout(2)" v-if="userid != ''">退出登陆</button>
		</view>
		<!-- 确认登出 -->
		<aui-dialog ref="dialog" :title="auiDialog.title" :msg="auiDialog.msg" :btns="auiDialog.btns" :mask="auiDialog.mask"
		 :maskTapClose="auiDialog.maskTapClose" :items="auiDialog.items" :theme="auiDialog.theme" @callback="dialogCallback"></aui-dialog>
	</view>



</template>

<script>
	export default {
		data() {
			return {
				auiDialog: {
					title: '',
					msg: '',
					btns: [{
						name: '确定'
					}],
					mask: true,
					maskTapClose: true,
					items: [],
					theme: 1,
				},
				userid: '',
				username: '',
				userimg: '',
				userbackground: '',
				swiperHeight: 500,
				userlevel: '',
				usercreatelistnum: '',
				listenSongs: '',
				follow: '',
				fans: '',
				usersonglist: [],
				userlikelist: [],
				// 歌曲数量
				trackCount: '',
				// 播放数
				playCount: '',
				// 收藏数
				playlistBeSubscribedCount: '',
			};
		},
		methods: {
			//回调函数解决登出
			async dialogCallback(e) {
				var _this = this;
				if (e.index == "0") {
					return
				}
				const res = await uni.request({
					url: 'http://localhost:3000/logout',
					withCredentials: true
				})
				uni.removeStorageSync('cookietoken')
				// 删除cookie
				this.deleteCookie()
				// 跳转，重载入页面
				uni.reLaunch({
					url: '/pages/user/index',
					//5+app plus.navigator.removeAllCookie()	
				});
				
				
			},
			// 删除cookie
			deleteCookie()
			{
				console.log('触发了')
				const res = this.$cookies.keys()
				console.log(res)
				res.forEach(item=>{
					$cookies.remove(item)
				})
			},
			//账户信息获取
			async getaccount() {
				//小程序不支持cookie，此处为了以后调用cookie
				const val = uni.getStorageSync('cookietoken')
				if (val) {
					const res = await uni.request({
						url: 'http://localhost:3000/user/account',
						withCredentials: true
					})
					if (!res[1].data.profile) {
						return
					}
					this.userid = res[1].data.profile.userId
					console.log(this.userid)
					this.username = res[1].data.profile.nickname
					this.userimg = res[1].data.profile.avatarUrl
					this.userbackground = res[1].data.profile.backgroundUrl
					//获取用户详情
					this.getuserdetail()
					this.getsonglist()
				}
			},
			//歌单获取
			async getsonglist() {
				const res = await uni.request({
					url: 'http://localhost:3000/user/playlist',
					data: {
						uid: this.userid,
					},
					withCredentials: true
				})
				this.playCount = res[1].data.playlist[0].playCount
				this.trackCount = res[1].data.playlist[0].trackCount
				res[1].data.playlist.forEach((item) => {
						if (item.userId == this.userid) {
							this.usersonglist.push({
								id: item.id,
								name: item.name,
								trackCount: item.trackCount,
								coverImgUrl: item.coverImgUrl
							})
						} else {
							this.userlikelist.push({
								id: item.id,
								name: item.name,
								trackCount: item.trackCount,
								coverImgUrl: item.coverImgUrl
							})
						}
					}

				)
				console.log(this.usersonglist)
				console.log(this.userlikelist)
			},
			//做其他用户界面的时候要封装出去
			async getuserdetail() {
				const res = await uni.request({
					url: 'http://localhost:3000/user/detail',
					data: {
						uid: this.userid
					},
					withCredentials: true
				})
				console.log(res)
				this.userlevel = res[1].data.level
				this.follow = res[1].data.profile.follows
				this.fans = res[1].data.profile.followeds
				this.usercreatelistnum = res[1].data.profile.playlistCount - 1
				this.playlistBeSubscribedCount = res[1].data.profile.playlistBeSubscribedCount
				this.listenSongs = res[1].data.listenSongs
			},
			loginout(theme) {
				var _this = this;
				_this.auiDialog.title = '提示';
				_this.auiDialog.msg = '确定退出登陆吗？';
				_this.auiDialog.items = [];
				_this.auiDialog.btns = [{
						name: '取消'
					},
					{
						name: '确定'
					}
				];
				_this.auiDialog.theme = theme;
				_this.$refs.dialog.show();
			},
			login(){
				console.log('触发了')
				uni.navigateTo({
					url:'../login/index'
				})
			}
		},
		created() {
			
			// this.getlevel()	
		},
		onLoad() {
			this.getaccount()
			}
	}
</script>

<style lang="less">
	.userpic {
		position: relative;
		height: 350rpx;

		.userimg {
			position: absolute;
			top: 40%;
			left: 50%;
			transform: translate(-50%, -75rpx);
			border-radius: 50%;
			height: 150rpx;
			width: 150rpx;
			border: 15rpx solid rgba(233, 235, 236, 0.5);
			z-index: 1;
		}

		.userbg {
			position: absolute;
			width: 100%;
			height: 500rpx;
			opacity: 0.5;
			z-index: 0;
		}

		.username {
			position: absolute;
			top: 40%;
			left: 50%;
			height: 40rpx;
			line-height: 40rpx;
			font-size: 30rpx;
			font-weight: bold;
			color: #282C35;
			transform: translate(-50%, 105rpx);
			z-index: 1;
		}

		.userlevel {
			position: absolute;
			top: 40%;
			left: 50%;
			height: 40rpx;
			width: 80rpx;
			line-height: 40rpx;
			font-size: 15rpx;
			font-style: italic;
			text-align: center;
			background-color: #808080;
			border-radius: 20rpx;
			opacity: 0.7;
			color: #FFFFFF;
			transform: translate(-50%, 145rpx);
			z-index: 1;
		}
	}


	.userdetail {
		display: flex;
		position: relative;
		z-index: 1;
		height: 150rpx;
		width: 100%;
		border-top-left-radius: 60rpx;
		border-top-right-radius: 60rpx;
		background-color: #FFFFFF;
		text-align: center;
		border-bottom: 1px solid #E9EBEC;

		view {
			height: 100%;
			width: 25%;

			.data {
				box-sizing: border-box;
				height: 50%;
				display: block;
				padding-top: 35rpx;
				font-size: 35rpx;
				font-weight: bold;
			}

			.write {
				box-sizing: border-box;
				height: 50%;
				display: block;
				color: #808080;
				padding-top: 15rpx;
				font-size: 15rpx;
			}
		}
	}

	.card {
		background-color: #FFFFFF;
		height: 250rpx;
		padding-top: 20rpx;

		.musicicon {
			position: relative;
			height: 100rpx;
			width: 100%;
			padding-left: 50rpx;

			.musicnavgate {
				padding: 10rpx;
				background-color: rgba(233, 235, 236, 0.5);
				border-radius: 15rpx;
				height: 60rpx;
				width: 60rpx;
				margin-top: 15rpx;
			}

			text {
				position: absolute;
				left: 140rpx
			}

			.textlike {
				top: 10rpx;
				font-size: 30rpx;
			}

			.textdescribe {
				top: 55rpx;
				font-size: 15rpx;
				color: #808080;
			}
		}
	}

	.songlistScroll {
		display: flex;
		white-space: nowrap;
		height: 220rpx;
		margin-top: 10rpx;


		.creatItem {
			display: inline-block;
			padding-left: 20rpx;

			image {
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
			}
		}

		.havepadding {
			padding-right: 20rpx;
		}
	}

	.title {
		display: block;
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 35rpx;
		font-weight: bold;
		padding-left: 30rpx;
		border-bottom: 1px solid #E9EBEC;

		text {
			font-size: 20rpx;
			font-weight: normal;
			color: #808080;
			padding-left: 10rpx;
		}
	}
	.wait{
		height: 100rpx;
		text{
			height: 100rpx;
			line-height: 100rpx;
			font-size: 30rpx;
			margin-left:10%;
		}
	}
	button{
		margin-top: 50rpx;
		margin-bottom:10rpx;
		width: 100%;
		border-radius: 20rpx;
		font-size: 30rpx;
		font-weight: bold;
	}
</style>
