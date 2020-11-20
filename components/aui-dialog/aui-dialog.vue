<template name="aui-dialog">
	<view class="aui-dialog" v-if="SHOW" :class="{'aui-dialog-in': FADE==1, 'aui-dialog-out': FADE==0}">
		<view class="aui-mask" v-if="mask"  @touchmove.stop.prevent @click.stop="maskTapClose ? hide() : ''"></view>
		<view class="aui-dialog-main" 
			:class="{
				'aui-dialog-main-style-1': theme==1, 
				'aui-dialog-main-style-2': theme==2, 
				'aui-dialog-main-style-3': theme==3
			}"
		>
			<view class="aui-dialog-title" v-if="title">{{title}}</view>
			<view class="aui-dialog-content" v-if="msg!=''" :style="{'text-align': msg.length > 15 ? 'left' : 'center'}" v-html="msg"></view>
			<view class="aui-dialog-content" v-if="items.length > 0">
				<view class="aui-dialog-input-list" v-for="(item, index) in items" :key="index" :data-index="index">
					<view class="aui-dialog-input-label" v-if="item.label">{{item.label}}</view>
					<view class="aui-dialog-input-list-input">
						<input :type="item.type ? item.type : 'text'" :value="item.value" :data-index="index"  @input="_onInput" :placeholder="item.placeholder" />
					</view>
				</view>
			</view>
			<view class="aui-dialog-down">
				<view 
					class="aui-dialog-down-btn"
					v-for="(item, index) in btns" 
					:class="{'aui-dialog-down-cancel-btn': item.name=='取消', 'aui-dialog-down-delete-btn': item.name=='删除'}"
					:key="index" 
					:data-index="index" 
					:style="{
						'color': touchIndex == index ? touchStyle.color : item.color,
						'background': touchIndex == index ? touchStyle.background : '',
						'width': theme==1?'calc(100% / '+ btns.length +')':''
					}"
					@click.stop="_btnTab($event)"
					@touchstart="_btnTouchStart($event)"
					@touchmove="_btnTouchEnd($event)"
					@touchend="_btnTouchEnd($event)"
				>{{item.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "aui-dialog",
		props: {
			title: { //标题
				type: String,
				default: ''
			},
			msg: { //描述内容
				type: String,
				default: ''
			},
			mask: { //是否显示遮罩，默认false
				type: Boolean,
				default: true
			},
			maskTapClose: { //遮罩层点击是否关闭
				type: Boolean,
				default: true
			},
			btns: { //横向("row")或纵向("col")控制，默认纵向
				type: Array,
				default (){
					return [
						{name: '确定', color: '#197DE0', isTouch: false}
					]
				}
			},
			items: {
				type: Array,
				default (){
					return [
						{label: '', type: 'text', value: '', placeholder: ''}
					]
				}
			},
			theme: { //主题样式，控制模态弹窗按钮显示风格
				type: Number,
				default: 1
			},
		},
		data() {
			return {
				SHOW: false,
				FADE: -1,
				ITEMS: [],
				touchIndex: -1, //长按时当前索引
				touchStyle: { //长按时当前样式设置
					color: '',
					background: '#EFEFEF'
				}
			};
		},
		created(){
			var _this = this;
					
		},
		onLoad(){
			
		},
		methods:{
			//显示
			show(){
				var _this = this;
				return new Promise(function(resolve, reject){					
					_this.SHOW = true;
					var _showtimer = setTimeout(()=>{
						_this.FADE = 1;
						clearTimeout(_showtimer);
					},50)
					resolve();
				});
			},
			//隐藏
			hide(){
				var _this = this;
				return new Promise(function(resolve, reject){
					_this.FADE = 0;
					var _hidetimer = setTimeout(()=>{
						_this.SHOW = false;
						_this.FADE = -1;
						clearTimeout(_hidetimer);
					},50)
					resolve();
				});
			},
			//底部按钮点击
			_btnTab(e){
				var _this = this, 
					index = Number(e.currentTarget.dataset.index);
				_this.hide();
				var _closetimer = setTimeout(()=>{
					var data = {
						status: 0,
						msg: _this.btns[index].name,					
						index: index
					};
					_this.$emit("callback", data);
					clearTimeout(_closetimer);
				},100)
			},
			//输入检测
			_onInput(e){
				var _this = this,
					index = Number(e.currentTarget.dataset.index),
					value = e.detail.value;
				if(_this.ITEMS.length <= 0)
				{
					_this.items.forEach((item, index)=>{
						_this.ITEMS.push({label: item.label, type: item.type, value: item.value, placeholder: item.placeholder});
					});	
				}
				_this.$set(_this.ITEMS[index], 'value', value);
				
			},
			getVal(){
				var _this = this;
				setTimeout(()=>{
					_this.ITEMS = [];
				},200)
				return _this.ITEMS;
			},
			_btnTouchStart(e){
				var _this = this,
					index = Number(e.currentTarget.dataset.index);
				_this.touchIndex = index;
			},
			_btnTouchEnd(e){
				var _this = this,
					index = Number(e.currentTarget.dataset.index);
				_this.touchIndex = -1;
			},			
		}
	}
</script>

<style>
	/* dialog 模态弹窗样式 */
	.aui-dialog{
		width: 100vw;
		height: 100vh;
		opacity: 0;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
	}
	.aui-dialog-main{
		min-width: 280px;
		max-width: 300px;
		background: #fff;
		border-radius: 13px;
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transition-property: -webkit-transform,opacity;
		transition-property: transform,opacity;
		-webkit-transform: translate3d(-50%,-50%,0) scale(1.185);
		transform: translate3d(-50%,-50%,0) scale(1.185);
		opacity: 0;
		z-index: 999;
	}
	.aui-dialog.aui-dialog-in{
		-webkit-transition-duration: 100ms;
		transition-duration: 100ms;
		opacity: 1;
	}
	.aui-dialog.aui-dialog-out{
		-webkit-transition-duration: 100ms;
		transition-duration: 100ms;
		opacity: 0;
	}
	.aui-dialog.aui-dialog-in .aui-mask{
		-webkit-transition-duration: 200ms;
		transition-duration: 200ms;
		opacity: 1;
	}
	.aui-dialog.aui-dialog-out .aui-mask{
		-webkit-transition-duration: 200ms;
		transition-duration: 200ms;
		opacity: 0;
	}
	.aui-dialog.aui-dialog-out .aui-dialog-main{
		-webkit-transition-duration: 200ms;
		transition-duration: 200ms;
		-webkit-transform: translate3d(-50%,-50%,0) scale(0.8);
		transform: translate3d(-50%,-50%,0) scale(0.8);
		opacity: 0
	}
	.aui-dialog.aui-dialog-in .aui-dialog-main{
		-webkit-transition-duration: 200ms;
		transition-duration: 200ms;
		-webkit-transform: translate3d(-50%,-50%,0) scale(1);
		transform: translate3d(-50%,-50%,0) scale(1);
		opacity: 1;
	}
	.aui-dialog-title{
		width: 100%;
		height: 40px;
		line-height: 55px;
		position: relative;
		font-size: 18px;
		/*font-weight: bolder;*/
		display: inline-block;
		border-top-left-radius: 13px;
		border-top-right-radius: 13px;
		text-align: center;
		color: #333;
		box-sizing: border-box;
	}
	.aui-dialog-content{
		width: 100%;
		max-height: 70vh;
		line-height: 27px;
		font-size: 16px;
		color: #555555;
		text-align: center;
		display: inline-block;
		overflow-y: scroll;
		padding: 30px 20px 25px 20px;
		box-sizing: border-box;
	}
	.aui-dialog-content::-webkit-scrollbar {
		width: 0px;
	}
	.aui-dialog-down{
		width: 100%;
		height: 50px;
		text-align: right;
		position: relative;
		overflow: hidden;
	}
	.aui-dialog-down-btn{
		width: auto;
		height: 100%;
		display: inline-block;
		font-size: 17px;
		color: #197DE0;
		text-align: center;
		position: relative;
	}
	.aui-dialog-down-btn.active{
		background: #EFEFEF;
	}
	.aui-dialog-down-cancel-btn{
		color: #909090;
	}
	.aui-dialog-down-delete-btn{
		color: #FF0000;
	}
	.aui-dialog-main-style-1 .aui-dialog-content{
		text-align: center;
	}
	.aui-dialog-main-style-1 .aui-dialog-down{
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.aui-dialog-main-style-1 .aui-dialog-down-btn{
		line-height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex: auto;
	}
	.aui-dialog-main-style-1 .aui-dialog-down:before{
		content: '';
		width: 100%;
		height: 1px;
		-ms-transform: scaleY(.3);
		-webkit-transform: scaleY(.3);
		transform: scaleY(.3);
		background: rgba(100,100,100,.3);
		position: absolute;
		top: 0;
		left: 0;
		z-index: 999;
	}
	.aui-dialog-main-style-1 .aui-dialog-down-btn:first-child{
		border-bottom-left-radius: 13px;
	}
	.aui-dialog-main-style-1 .aui-dialog-down-btn:last-child{
		border-bottom-right-radius: 13px;
	}
	.aui-dialog-main-style-1 .aui-dialog-down-btn:after{
		content: '';
		width: 1px;
		height: 100%;
		-ms-transform: scaleX(.3);
		-webkit-transform: scaleX(.3);
		transform: scaleX(.3);
		background: rgba(100,100,100,.3);
		position: absolute;
		top: 0;
		right: 0;
		z-index: 999;
	}
	.aui-dialog-main-style-1 .aui-dialog-down-btn:last-child:after{display: none;}
	.aui-dialog-main-style-2{
		border-radius: 6px;
	}
	.aui-dialog-main-style-2 .aui-dialog-title{
		padding: 0 15px;
		box-sizing: border-box;
	}
	.aui-dialog-main-style-2 .aui-dialog-down{
		height: 40px;
		padding: 0 10px 10px 10px;
		box-sizing: border-box;
	}
	.aui-dialog-main-style-2 .aui-dialog-down-btn{
		height: 30px;
		line-height: 30px;
		padding: 0 10px;
		margin: 0 0 0 10px;
	}
	.aui-dialog-main-style-3 .aui-dialog-down{		
		height: auto;
	}
	.aui-dialog-main-style-3 .aui-dialog-down-btn{
		width: 100%;
		line-height: 50px;
	}
	.aui-dialog-main-style-3 .aui-dialog-down-btn:before{
		content: '';
		width: 100%;
		height: 1px;
		-ms-transform: scaleY(.3);
		-webkit-transform: scaleY(.3);
		transform: scaleY(.3);
		background: rgba(100,100,100,.4);
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}
	.aui-dialog-main-style-3 .aui-dialog-down-btn:last-child{
		border-bottom-left-radius: 13px;
		border-bottom-right-radius: 13px;
	}
	.aui-dialog-main-style-3 .aui-dialog-down-btn:first-child:after{display: none;}
	/*input  输入弹窗样式设置*/
	.aui-dialog-input-list{
		width: 100%;
		position: relative;
		text-align: left;
	}
	.aui-dialog-input-list .aui-dialog-input-label{
		width: 260px;
		height: 40px;
		line-height: 40px;
		display: inline-block;
		font-size: 16px;
		color: #646464;
	}
	.aui-dialog-input-list-input{
		width: 100%;
		background: #FFFFFF;
		border-radius: 3px;
		border: none;
		box-sizing: border-box;
		padding: 2px;
		margin: 0 0 15px 0;
		color: #515151;
		position: relative;
	}
	.aui-dialog-input-list input{
		width: 100%;
		height: 40px;
		line-height: 20px;
		border-radius: 3px;
		border: none;
		margin: 0;
		padding: 0 10px;
		box-sizing: border-box;
		font-size: 15px;
		color: #515151;
		position: relative;
		z-index: 1;
	}
	.aui-dialog-input-list-input:after{
		content: '';
		width: 200%;
		height: 200%;
		border: 1px solid rgba(100,100,100,.3);
		-ms-transform: scale(.5, .5);
		-webkit-transform: scale(.5, .5);
		transform: scale(.5, .5);
		position: absolute;
		top: -50%;
		left: -50%;
		border-radius: 10px;
		z-index: 0;
	}	
</style>
