<template>
	<view class="container" :style="css.size">
		<image :src="css.img" :class="css.blur" mode="aspectFill" v-if="css.img"></image>
		<view :class="css.blur" v-else></view>
	</view>
</template>

<script>
	export default {
		props:{
			params:{
				type: Object,
				default(){
					return {}
				}
			}
		},
		computed:{
			css(){
				let w = this.params.width || 0;
				let h = this.params.height || 0;
				let blur = this.params.blur || 'm'
				let img = this.params.image || ''				
				return {
					size:`width:${w};height:${h};`,
					blur,
					img
				}
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss" scoped>
.container{
	overflow: hidden;
	position: relative;
	
	> view{
		background-color: rgba(255,255,255,0.6);
	}
	
	> image,> view{
		position: absolute;
		z-index: 1;
		box-sizing: content-box;
		width: 100%;
		height: 100%;

		
		&.xs{
			padding: 10px;
			left: -10px;
			top: -10px;
			filter: blur(5px);	
		}
		
		&.s{
			padding: 15px;
			left: -15px;
			top: -15px;
			filter: blur(10px);
		}
		
		&.m{
			padding: 20px;
			left: -20px;
			top: -20px;
			filter: blur(15px);
		}
		
		&.l{
			padding: 30px;
			left: -30px;
			top: -30px;
			filter: blur(25px);
		}
		
		&.xl{
			padding: 40px;
			left: -40px;
			top: -40px;
			filter: blur(45px) brightness(75%);
		}
	}
}
</style>
