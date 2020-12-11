<template>
	<jl-login :loginType="thisNum"></jl-login>
</template>

<script>
	export default{
		data(){
			return{
				thisNum:1
			}
		},
		onLoad(e) {
			this.thisNum = parseInt(e.thisNum)
			if(parseInt(e.thisNum)===1){
				uni.setNavigationBarTitle({
				    title: '邮箱账号密码登陆'
				})
			}else{
				uni.setNavigationBarTitle({
				    title: '手机账号密码登录'
				})
			}
		}
	}
</script>

<style>
</style>
