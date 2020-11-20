<template>
	<view class="input-box-all" :style="{ marginTop: marginTop, marginBottom: marginBottom}" :class="set">
		<view class="input-box align-items flex">
			<!-- 输入框左边内容 -->
			<view class="input-box-left left" v-if="leftText || leftClass" :class="leftClass" @click="leftClick">
				<text v-if="leftText">{{leftText}}</text>
			</view>
			<!-- 密码输入框类 -->
			<view class="input-box-center" v-if="type==='password'">
				<input :style="{fontSize:'30rpx'}" @input="keyInput" :placeholder="placeholder" :disabled="disabled" :value="value" type="text" :maxlength="maxLength" class="input-box-center-text" v-show="isShowEye"/>
				<input :style="{fontSize:'30rpx'}" @input="keyInput" :placeholder="placeholder" :disabled="disabled" :value="value" type="password" :password="true" :maxlength="maxLength" class="input-box-center-text" v-show="!isShowEye"/>
			</view>
			<!-- 非密码输入框类 -->
			<view class="input-box-center"  v-else >
				<input :style="{fontSize:'30rpx'}" @input="keyInput" :placeholder="placeholder" :disabled="disabled" :value="value" :type="type" :maxlength="maxLength" class="input-box-center-text" />
			</view>
			<!-- 清空输入框 -->
			<view :style="{fontSize:'40rpx'}"  class="input-box-clear" v-show="clearShow && value" @click="clear">
				×
			</view>
			<!-- 密码显示隐藏开关 -->
			<view class="left password-control" :class="isShowEye?'show':'hide'" v-if="type==='password'" @click="passwordClick"></view>
			<!-- 输入框右边内容 -->
			<view class="input-box-right right" v-if="rightText || rightClass" :class="rightClass" @click="rightClick">
				<text v-if="rightText">{{rightText}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import inputVerification from './verification.js';
	 export default {
	    props: {
			//自定义传入的 class ，自定义样式
	        set: {
	            type: String,
	            default: ''
	        },
			//input 类型,默认 text
			type: {
			    type: String,
			    default: ''
			},
			// input字数限制
			maxLength: {
			    type: String,
			    default: '100'
			},
			// 组件对于上方的间距
			maTop: {
			    type: String,
			    default: '40'
			},
			// 组件对于下方的间距
			maBtm: {
			    type: String,
			    default: '0'
			},
			//输入框默认值
			inputValue: {
				type: String,
			    default:''
			},
			//是否禁用
			disabled:{
				default:false
			},
			// input placeholder 提示文字
			placeholder: {
			    type: String,
			    default: '请输入内容'
			},
			// input 校验
			verification: {
			    type: Array,
			    default: null
			},
			// input 校验提示语
			verificationTip: {
			    type: Array,
			    default: null
			},
			// input左边的文字
			leftText: {
			    type: String,
			    default: ''
			},
			// input左边自定义的样式
			leftClass: {
			    type: String,
			    default: ''
			},
			// input右边的文字
			rightText: {
			    type: String,
			    default: ''
			},
			// input右边自定义的样式
			rightClass: {
			    type: String,
			    default: ''
			},
			//是否显示清除按钮,默认显示
			clearShow:{
				type: Boolean,
				default: true
			}
	    },
	    data() {
	        return {
				value:this.inputValue,
				marginTop: parseFloat(this.maTop) / 375 * 750 + 'rpx',
				marginBottom: parseFloat(this.maBtm) / 375 * 750 + 'rpx',
				isShowEye:false,//是否显示密码
			};
	    },
		mounted() {
			console.log(inputVerification)
		},
		methods: {
			  /**
			 * @desc 密码显隐操作
			 */
			passwordClick() {
				this.isShowEye = !this.isShowEye;
			},
			/**
			 * @desc 左边点击事件
			 */
			leftClick(){
				//传值到父组件和父组件双向绑定
				this.$emit('leftClick', this.value);
			},
			/**
			 * @desc 右边点击事件
			 */
			rightClick(){
				//传值到父组件和父组件双向绑定
				this.$emit('rightClick', this.value);
			},
			 /**
			 * @desc 监听输入框的值
			 */
			keyInput(event) {
				let value = event.detail.value;
				this.value = value;
				//传值到父组件和父组件双向绑定
				this.$emit('input', this.value);
			},
			/**
			 * @desc 清楚输入框的值
			 */
			clear(flag) {
			    this.value = '';
			    // 双向绑定到父组件（双向绑定，不能弹出提示）
			    this.$emit('input', this.value);
			},
			/**
			 * @param 获取带校验的输入框的值
			 */
			 /**
			 * @name:获取输入框的值
			 * @return value || undefined
			 */
			getValue (flag) {
				if (!flag) {
					// 判断是否有校验
					if (this.verification && this.verification.length > 0) {
						for (let i = 0; i < this.verification.length; i++) {
							// 获取校验的名称
							const verificationName = this.verification[i]
							// 判断校验是否正确
							const verificationResult = inputVerification.verificationFuc({name: verificationName, value: this.value})
							if (!verificationResult.flag) {
								// 弹出错误信息
								// 判断有没有自定义的弹出信息
								if (this.verificationTip && this.verificationTip[i]) {
									uni.showToast({
										icon: 'none',
										title: this.verificationTip[i] || '',
										// #ifdef MP-WEIXIN
										duration: 2000,
										// #endif
										// mask: true
									});
								} else {
									// 弹出方法自带的提示语
									uni.showToast({
										icon: 'none',
										title: verificationResult.tip || '',
										// #ifdef MP-WEIXIN
										duration: 2000,
										// #endif
										// mask: true
									});
								}
								return '';
							}
						}
					}
				}
				return this.value || '';
			}
		}
	}
</script>

<style lang="scss">
	/*宽度转换vw*/
	@function vww($number) {
	    @return ($number / 375)*750+rpx;
	}
	@mixin bgImgBase($bgImgUrl:'', $position:center, $repeat:no-repeat, $size:contain) {
	    background-image: url($bgImgUrl);
	    background-position: $position;
	    background-repeat: $repeat;
	    background-size: $size;
	}
	/* float */
	.right {
	    float: right;
	}
	
	.left {
	    float: left;
	}
	/* 项目在主轴上的对齐方式 */
	.align-items{
		align-items: center;
		-webkit-justify-content: center;
	    justify-content: center;
	} 
	input:focus{
	    outline: 0;
		padding: 0;
		margin: 0;
	}
	.flex {
	    display: -webkit-box;
	    display: -webkit-flexbox;
	    display: -webkit-flex;
	    display: flex;
	}
	view{
		box-sizing: border-box;
	}	
	$offEye:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAYCAYAAAC8/X7cAAAEvUlEQVRYR81Xa2hcRRQ+597dJF2NscbUUG3SZPfOpEih+Kj46hNfBbViK+oPDSJY8YcWfBT0h7bFij98/JIKVkFExFLRolisfdhfraXSSOW+8iBbQ9KHD4KbNnvvfDLhbpnEbbobUpv5c+HOmXO+b+Z858yw53mrALzBzGFNTc2zbW1tf9EMHmEYzonjeBsRzY/j+BV2Xfd3IpqrMTPzbiHEfcwczUQO+Xx+VqFQ2AdgcYI3ZM/zfgGwyAC8TUr5NDNjJpEAkPJ9fzuAB0u4LMvax2EY3hhF0X4iusyY+MBxnOdmCgkN3vO8z4loTQkjM+tUv5X1jyAIHlBKfQXAMgw+EkKsu9TpNDAwkBkeHv4MwGojI4qpVOqeXC63d4yAHr7vP6+Ues9MG2b+sa6ubm1ra+uflyKd+vv75xYKha+J6CZjYxURdUopPx3TgQlMkwDwLgDzf2Db9qOO4xz5P0kEQbBUKaV3/lojbmRZ1hNCCJ1OY2McgeQkHldKfUJEaXMhEb0lpdzEzKMXk4iuNCMjI28C0Jt5Dh8zn2HmNUKIb8dlSTkwrutuJqJXy8z9atv2S47j7LoYJLQW4zh+m4jkRP/M/DcRLZVSHp2UgOu6K5j5OwC15wPJzIcsy9rsOM7O6SASBMH9cRy/TkQ3TOaPmYds274jl8uFZVPI9/1blFK7iehyw9ERZl4AYFaZXfkNwA5m3imE+Lmasuv7/iIADxHRwwCuL+P7eJIF6yf0qb5MJnN7S0vLwDgNdHd3LywWi7ofzDYUv8eyrFWWZV1TLBa3MPNjEwRuxh1k5u+JqIuZfQAniGjYtu0IwBUAGgEIAAuJ6F4iaj3Pbo8y8zsNDQ2bm5ub/wmCoEkptR/AAgPXsUwms2TevHl/jIkkDMNcFEUHiKjZcHq4sbFxRVNT03Dpnz4hAFpgK6YjdcblMvNZANvT6fTGbDbrm3O6nI6MjBwA0G6QOJjJZJZzEAS1SqljALLGpEtEd0opT5UD2t3d7URR9BSAzgmkq+bFzD0AtjKzvsKUjaed9vb2zh8dHdUkrjNwvqgJLIvjeK8RuT+VSmmh5C+EJmnxOu1uu5BtuXlmPi6EaKlUOz09PbJYLP4EYE7i72XO5/NXFQqFowmzwZqammXt7e1eJYAApD3PO01E9WOCYt5hWdY6ImoCcHXy1f3kpG3bQ0R0Io7jDQDWl/yn02mRzWaDSuJpm4TERiIaqq+v3zCmgd7e3iujKFpcV1d3WAujUme+7y/RAivZa/BCiK2TrQ/DcHkURXuMNS8IId6vNOZEu/904mocua67iYheM8BkhRA9k/nQp+b7/ildmZJT+0FKeXc1cceJf6oL9TrP8w4BuDkB0iOlPFcIJvPruu6XpasxM59taGho1CVzKlimfAKJdk6WruDM/KGU8plKQPi+36mU+tiwXd3R0aFvnVWPKRNwXfcRIvqiFNG27bWO42yvBEHyrh0sNcVqyE+bBjzP2wJgQ5I+KpPJNFVTADzPO2i8bfdIKVdWQn7aCPi+fxeAXckubu3o6NDls+Lhed5KAN/oa7tlWU+ad/yKnZR7D1SzuKura3Ztba0thDhdaTMy/etG2NfXl2praztTTVzT9l8UfjXT/M4mGgAAAABJRU5ErkJggg==';
	$onEye:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAcCAYAAAAnbDzKAAAFf0lEQVRYR61YaWxUVRg9574OLVJcUOIWhESjicSlQeOaKBFClMwUIUMiWIOB0BgQbGdiXIgiAYwy0yKosf0hSESMZetUXKIkElQSFDRqJEFxYUkItVFka0vfPebNdKbTYeq8GTo/+8453zn3ft9995Uo8Rdu0IguaZuA4WXkvC313FGM1NRXdU+Po9UE2isDDK9fwH+L4aexLIXkcYJxzYLsmiSf3NcWMTcWoxWK272SqlIcM6Mtyg3F8M87QHWjJljXfpYWchxTtbWO3/sxEWzQWFj7U8ZEmbkl8RR/8MPNxZS8A0+uUvkf3eoANCy5CcCKRNR52o+J6gZ3mbV4LrV53J+ImBv88PJhSg7giYXitlVSKBWAh1sjvIakCpkJxe3vksak2g/L2iLOokKcgZ6fX4CY5gq2KS1eZsz9hYa5Oq67rexXg9E+vTufkgo3aGhLPc8UsxLhBl3dae3hrIFqTkSdWkmsbcbQv4HAsCHoWvs4O9OYUNx9XcK8UtvH065+G5WJ2TyRCRCMuS8BeIHkTqecD2+Zzw6/QUIx+52gW1N4niJwQMR1kC7oC8YTItoJHIMwVtDwUtoneXRbfSToDhIrExGnLtlCoZj9VdC1KVHurqjgAy3zePL/QnhDfPAspghaIul6v4H74chNjvjy1ij3FOL3vnc+zxy95MG2iBmdChB3F0t4MSNCbh8T4OTVC9iVK+wJdVq7EOR8SCMKFfb3nN+QXJqIMJEP37vy2/t2GjAGy1vrneczQxyKu6slzM9sO7mlfBTDLdPpJmfkAzndh7FAVi9lWiCnGsETAvYY6kcLc4TEcQ8i4SLIeifUTQBukzQ0n1GS3xJc2Brh1+nn+cyDaErUmye8E6/fKZQbAsCaRMTMnrYSVT2umgWNyy1M8LigBGk2jg7g03y7ls2pWadh//yFybQKi3goe1b6Fg/rnHJTX9YNdUl9bZOa2oz5zBBnFzgnBPklgbskOdk4ggdILhkyCu+3TGe3v1bpj/LCHD+GOaCelXR5zny0U2gX1HdFyTGfN0DvTGSOunON8U8DLq0ah7WLx7OnFOO5nLlNuuDoKcyT9DSky/Jq5jE/YIApjapxrd6B+lqMoAXUOOJSsyj7XB+MAGmNGW/qkpNn7EoJj+Xshgw4qzXCdee2cNZfvEHtPGhXAKjr1y7kfsdw1pY67hpMwwNphRo1GamZuyobY4hXqurNc4vpLWbqlxniWWtU0dGhzYAe7G8eG66oNHOaa3nar/kpcT3g0k6AeDOgQ4TZPTqA9YUGPFu/99x/T9KknN3YNCbAmWmtZIDkMLWrTdL4TDLSJfhMa4Qxv8bDTbqo66R9Q8LMczjkPkes8fPSSnMXS2Zvg10q8Jnsdga5gxcz6F0nOLdJgaMnkq/nCVnmzwic3hbhh37Ne7hg3G6ENG1ADtleEeDYlgVsL0o3pkcIrRU0JMvjznJyEoNx9y0ItX09xeM0DLbWc2dRRRpUDWu3FuKQeDcRcWoK4XKfh2KaCGqzpMqs/l/BYNwegzQyNRH81yEnbq3n7uILuE0C5hbiEexIRE3+o7IA2buKS/okfRMgeIihuN0l6U7vJmkMHyx25dM1gzG7G9DthQJ4zysCZnTLQh70g83FPBzTvT3UNkgXgljFqY260rWYWmbw8aY6/laKaG//fwHpPj/8SpiRG6L8yw82Hya8SiNdF6M213HveX2RZYuH4u5yCc8WNsVf2qKmtOt3HvFBCxB+Tdd0ntXP6Y/8gYIQpjYRZXPhoP4QgxYg2UYNmg6r9YDK8pUnsT4RcR71Z80falADeCVDjboHVq9KujtjgTxCcUVrBKv8/NfCn/UUatADpIt7n5yHXAwd3oOz66I4PdjG03X+A85Hf6m6tCZ2AAAAAElFTkSuQmCC';
	.input-box-all{
		width: 100%;
		height: vww(44);
		padding: 0 vww(20);
		border-bottom: 1px solid #F5F5F5;
	}
	.input-box{
		width: 100%;
		height: 100%;
		font-size: vww(14);
		color: #4A4A4A;
		&-left{
			margin-right: vww(10);
		}
		&-center{
			flex: 1;
		}
		&-clear{
			margin-left: vww(5);
			font-size: vww(14);
		}
		&-right{
			margin-left: vww(5);
		}
		.password-control{
			margin-left: vww(5);
			width: vww(18);
			height: vww(18);
			&.hide{
				@include bgImgBase($bgImgUrl:$offEye);
			}
			&.show{
				@include bgImgBase($bgImgUrl:$onEye);
			}
		}
	}
</style>
