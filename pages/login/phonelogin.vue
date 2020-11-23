<template>
	<view>
		<!-- 账号密码框子 -->
		<input-box v-model="phonenumber" ref="input1" :verification="['isNull','isPhoneNum']" :verificationTip="['手机号不能为空','请输入正确的手机号码']"
		 placeholder="请输入手机号码" maBtm="10" maxLength="11"></input-box>
		<input-box v-model="password" ref="input2" type="password" :verification="['isNull','isChineseEnlishAndNumber']"
		 :verificationTip="['密码不能为空','']" placeholder="请输入密码" maBtm="10"></input-box>
		<button @click="onerification">登陆</button>
	</view>
</template>

<script>
	// 引入md5js插件
	import md5 from '../../static/js/md5.js'
	export default {
		data() {
			return {
				phonenumber: '',
				password: '',
				cookietoken: '',
			};
		},
		methods: {
			// 登陆按钮的回调函数
			async onerification() {
				if (this.$refs.input1.getValue() && this.$refs.input2.getValue()) {
					// 发起登陆请求
					const res = await uni.request({
						url: 'http://localhost:3000/login/cellphone',
						data: {
							phone: this.phonenumber,
							md5_password: md5(this.password)
						},
						withCredentials:true
					});
					console.log(res[1].data.code !== 200)
					console.log(res)
					if (res[1].data.code !== 200) {
						return uni.showToast({
							icon: 'none',
							title: '登录失败！用户名或者密码错误',
							// #ifdef MP-WEIXIN
							duration: 2000,
							// #endif
							// mask: true
						});
					}
					this.cookietoken = res[1].data.cookie
					uni.setStorageSync('cookietoken', this.cookietoken)
					uni.showToast({
						icon: 'none',
						title: '登录成功',
						// #ifdef MP-WEIXIN
						duration: 1000,
						// #endif
						// mask: true
					});
					setTimeout(function() {
						uni.reLaunch({
							url: '/pages/home/index'
						});
					}, 1000);

				}
			}
		}
	}
</script>

<style lang="less">
	button {
		margin-top: 50rpx;
		color: #FFFFFF;
		width: 90%;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 30rpx;
		border-radius: 50px;
		border: 1px solid #FF0033;
		background-color: #EC4141;
	}
</style>
