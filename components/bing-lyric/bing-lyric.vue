<template>
<view class="alllist">
	<view class="lyric-main" :style="{
		width:cuAreaStyle.width,
		height:cuAreaStyle.height,
		background:cuAreaStyle.background}">
		<scroll-view id="lyric-show" class="lyric-show" scroll-with-animation="true" :scroll-y="true" :scroll-into-view="showLyricId" @scroll="lyricScroll" 
		:style="{
		top:scrollView.top,
		width:cuAreaStyle.width,
		height:scrollView.height}">
			<view class="lrc-item" v-for="(v, i) in mLyrics.lrcs" :key="i" @tap="select(v,i)" @longpress="itemLongpress(v,i)" 
			@touchstart="textTouchstart" @touchcancel="textTouchEnd" @touchend="textTouchEnd">
				<text class="check" v-if="selectStatus && selects[i] && v" value="[v,i]">✔</text>
				<text class="lrc" :id="'lrc-' + i" 
				:style="{
					opacity:touchIndex == i && touchStatus && !selectStatus ? 0.8 : 1,
					color:((curLyricIndex ==  i  || (touchIndex ==i && touchStatus)) && !selectStatus) ? cuLyricStyle.activeColor : cuLyricStyle.color,
					fontSize:((curLyricIndex ==  i || (touchIndex ==i && touchStatus))&& !selectStatus) ? cuLyricStyle.activeFontSize : cuLyricStyle.fontSize,
					height:((curLyricIndex ==  i || (touchIndex ==i && touchStatus))&& !selectStatus) ? cuLyricStyle.activeLineHeight : cuLyricStyle.lineHeight,
					backgroundColor:(selectStatus && selects[i] && v) ? cuLyricStyle.selectBGColor:'inherit'
				}">{{v}}</text>
			</view>
		</scroll-view>
		<view class="center-view" :style="{top:centerLineTop,display:showCenterView?'flex':'none',fontSize:cuCenterStyle.fontSize,height:cuCenterStyle.height}">
			<image v-if="cuCenterStyle.btnImg" class="center-btn" @click="centerBtnClick" :src="cuCenterStyle.btnImg" :style="{width:cuCenterStyle.height,height:cuCenterStyle.height}"></image>
			<view v-else class="center-btn" @click="centerBtnClick">{{cuCenterStyle.btnText}}</view>
			<view class="center-line" :style="{height:cuCenterStyle.lineHeight,backgroundColor:cuCenterStyle.color}"></view>
			<view class="center-time">{{centerTime}}</view>
		</view>		
	</view>
</view>
</template>

<script>
	export default{
		data() {
			return {
				font2line4height: 2.5,
				selectAllStatus: false,
				selects: {}, // 选择状态下选中的歌词id
				scrollStatus: false, // 用于判断是否是在拖动歌词，是否应该开启选择歌词模式
				touchIndex: 0,
				curLyricId: 'lrc-0', // 时间进度控制
				showLyricId: 'lrc-0', // 界面显示，时间和touch控制
				curLyricIndex: 0,
				selectStatus: false,
				touchStatus: false,
				showCenterView: false,
				spaceLineNum: 0,
				timeout: {
					centerViewHide: null,
					goCenter: null,
				},
				cuSelectControlStyle: {
					height: '80rpx',
					backgroundColor: 'grey',
					itemFontSize: '30rpx',
					itemBorderRadius: '100rpx',
					itemBackgroundColor: '#00ffff'
				},
				cuLyricStyle: {
					color: "#909090",
					activeColor: '#ffffff',
					fontSize: '32rpx',
					activeFontSize: '32rpx',
					lineHeight: '80rpx',
					activeLineHeight: '80rpx',
					selectedBGColor: 'inherit'
				},
				cuAreaStyle: {
					width: '100vw',
					height: '900rpx',//这里的高度要改
				},
				cuCenterStyle: {
					btnImg: '',
					btnText: 'btn',
					color: '#ffffff',
					lineHeight: '1px',
					height: '30rpx',
					fontSize: '28rpx',
				},
				scrollView: {
					height: '100%',
					top: 0
				},
				screen: {
					width:0,
					height:0,
					px2rpxscale: 1,
				},
			}
		},
		beforeMount() {
			const res = uni.getSystemInfoSync()
			this.screen.width = res.windowWidth
			this.screen.height = res.windowHeight
			this.screen.px2rpxscale = 750 / res.windowWidth;
			this.cuAreaStyle = Object.assign(this.cuAreaStyle, this.areaStyle)
			this.cuLyricStyle = Object.assign(this.cuLyricStyle, this.lyricStyle)
			this.cuCenterStyle = Object.assign(this.cuCenterStyle, this.centerStyle)
			this.cuSelectControlStyle = Object.assign(this.cuSelectControlStyle, this.selectControlStyle)
			if (this.lyricStyle){
				if(!('activeFontSize' in this.lyricStyle)){
					this.cuLyricStyle['activeFontSize'] = this.cuLyricStyle['fontSize']
				}
				if(!('lineHeight' in this.lyricStyle)){
					let s = this.sizeDeal(this.cuLyricStyle['fontSize'])
					this.cuLyricStyle['lineHeight'] = s[0] * this.font2line4height + s[1] // 默认行高为字体大小的倍数
				}
				if(!('activeLineHeight' in this.lyricStyle)){
					let s = this.sizeDeal(this.cuLyricStyle['activeFontSize'])
					this.cuLyricStyle['activeLineHeight'] = s[0] * this.font2line4height + s[1]
				}
			}
			if (this.centerStyle){
				if (!('height' in this.centerStyle)){
					let s = this.sizeDeal(this.cuCenterStyle['fontSize'])
					this.cuCenterStyle['height'] = s[0] * 1.2 + s[1]
				}
			}
			
		},
		mounted() {
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this)
				query.select(".lyric-main").boundingClientRect(res =>{
					this.cuAreaStyle.height = res.height + 'px'
					let size = this.sizeDeal(this.cuLyricStyle.lineHeight)
					let asize = this.sizeDeal(this.cuLyricStyle.activeLineHeight)
					let sumLine = Math.floor((res.height - asize[0]) / size[0]) // 不包含activeLine
					if (sumLine % 2 !== 0){
						sumLine -= 1
					}
					this.spaceLineNum = Math.floor(sumLine / 2)
					this.scrollView.height = sumLine * size[0] + asize[0] + 'px'
					this.scrollView.top = (res.height - (sumLine * size[0] + asize[0])) / 2 + 'px'
				}).exec()
			})
		},
		props: {
			selectControlStyle: {
				default: () => {},
				type: Object
			},
			centerStyle:{
				default: () => {},
				type: Object
			},
			lyrics: {
				default: () => [],
				type: Array
			},
			curTime: {
				default: 0,
				type: [Number, String]
			},
			lyricStyle: {
				default: () => {},
				type: Object
			},
			areaStyle: {
				default: () => {},
				type: Object
			}
		},
		watch: {
			curTime(t) {
				let index = this.getIndex(t, this.mLyrics.times)
				this.curLyricIndex = index + this.spaceLineNum
				this.curLyricId = 'lrc-' + index
				if (!this.touchStatus && !this.selectStatus){
					this.showLyricId = this.curLyricId
				}
			},
		},
		computed: {
			lineHeightNum(){
				let size = this.sizeDeal(this.cuLyricStyle.fontSize)
				return size[0] * this.font2line4height
			},
			centerTime(){
				let index = this.touchIndex - this.spaceLineNum
				let s = this.mLyrics.times[index]
				return this.timeFormat(s)
			},
			centerLineTop(){
				let h = this.sizeDeal(this.cuAreaStyle.height)
				h = h[0] / 2 - this.sizeDeal(this.cuCenterStyle.height)[0] / 2  + h[1]
				return h
			},
			lineHeight() {
				let size = this.sizeDeal(this.cuLyricStyle.fontSize)
				return size[0] * 2 + size[1]
			},
			activeLineHeight() {
				let size = this.sizeDeal(this.cuLyricStyle.activeFontSize)
				return size[0] * 2 + size[1]
			},
			mLyrics () {
				return this.lrcDeal(this.lyrics)
			}
		},
		methods: {
			selectAll(){
				this.selectAllStatus = !this.selectAllStatus
				this.$nextTick(() => {
					if (this.selectAllStatus){
						for (let i=0;i<this.mLyrics.lrcs.length;i++){
							let lrc = this.mLyrics.lrcs[i]
							if(lrc){
								this.selects[i] =lrc
							}
						}
					}
					else{
						this.selects = {}
					}
					this.$forceUpdate()
				})
			},
			copyLyric(){
				let datas = {}
				for(let k in this.selects){
					datas[this.mLyrics.times[k - this.spaceLineNum]] = this.selects[k]
				}
				this.$emit('copyLyrics',{lyrics:datas})
				this.selectCancel()
			},
			selectCancel(){
				this.selectStatus = false
				this.touchStatus = false
				this.selectAllStatus = false
				this.selects = {}
			},
			itemLongpress(v,i){
				if (!this.scrollStatus && !this.selectStatus){
					this.selects = {}
					this.selectModel()
					if (v){
						if(this.selects[i]){
							delete this.selects[i]
						}
						else{
							this.selects[i] = v
						}
					}
					this.$forceUpdate()
				}
			},
			select(v,i){
				if(this.selects[i]){
					delete this.selects[i]
				}
				else{
					this.selects[i] = v
				}
				this.$forceUpdate()
			},
			selectModel() {
				this.showCenterView = false
				this.touchStatus = false
				this.selectStatus = true
			},
			centerBtnClick() {
				let lrc = this.mLyrics.lrcs[this.touchIndex]
				let ctime = Number(this.mLyrics.times[this.touchIndex - this.spaceLineNum])
				this.$emit('centerBtnClick',{centerTime:ctime,centerLyric:lrc})
			},
			textTouchstart() {
				clearTimeout(this.timeout.goCenter)
				clearTimeout(this.timeout.centerViewHide)
				this.touchStatus = true
			},
			textTouchEnd() {
				this.touchStatus = 2
				this.scrollStatus = false
				if (!this.selectStatus){
					this.timeout.goCenter = setTimeout(()=>{
						this.showLyricId = 'lrc-' + (this.touchIndex - this.spaceLineNum)
					},500)
					this.timeout.centerViewHide = setTimeout(this.clearTouch,5000)
				}
			},
			clearTouch() {
				this.touchStatus = false
				this.showLyricId = this.curLyricId
				this.showCenterView = false
			},
			lyricScroll(e) {
				let top = e.detail.scrollTop
				let topIndex = Math.round(top / this.lineHeightNum)
				this.touchIndex = topIndex + this.spaceLineNum
				if (this.touchStatus === true && !this.selectStatus){
					this.scrollStatus = true
				}
				if (this.touchStatus && !this.selectStatus && !this.showCenterView){
					this.showCenterView = true
				}
				this.$forceUpdate()
			},
			getIndex(t, items) {
				t = Number(t)
				let index = 0
				for ( var k_ in items){
					let k = Number(items[k_])
					if (t == k){
						return index
					}
					else if(t < k){
						return index - 1
					}
					else if ( index == items.length - 1){
						return items.length - 1
					}
					index += 1
				}
			},
			timeFormat(t){
				t = Number(t)
				if(t >= 0){
					let h = parseInt(t / 3600)
					let m = parseInt(t / 60) - h*60
					let s = parseInt(t) - m*60
					if (h.toString().length == 1){h = '0' + h}
					if (m.toString().length == 1){m = '0' + m}
					if (s.toString().length == 1){s = '0' + s}
					if (h != '00'){
						return h + ":" + m + ":" + s
					}
					else {
						return m + ":" + s
					}
				}
				else {
					return ''
				}
			},
			sizeDeal(size) {
				// 分离字体大小和单位,rpx 转 px
				let s = Number.isNaN(parseFloat(size)) ? 0 : parseFloat(size)
				let u = size.toString().replace(/[0-9\.]/g, '')
				if (u == 'rpx') {
					s /= this.screen.px2rpxscale
					u = 'px'
				} else if (u == '') {
					u = 'px'
				}else if (u == 'vw') {
					u = 'px'
					s = s / 100 * 750 / this.screen.px2rpxscale
				}
				return [s, u, s + u]
			},
			lrcDeal(lrcl) {
				let lrcj = {lrcs:[],times:[]}
				if (lrcl.length < 1){
					lrcj.lrcs.push('还没有歌词...')
				}
				else{
					for (let i = 0; i < lrcl.length; i++ ){
						let lrc = lrcl[i].toString()
						let tl = lrc.split(']')
						if (tl.length > 1){
							// t: time; l: lyric
							let t_ = tl[0].replace('[','')
							let t = t_.split(':')
							if(t.length > 1){
								let treverse = t.reverse()
								let ts = 0
								if (treverse[0].indexOf('.') != -1){
									// 毫秒以小数形式放在了秒上面
									for (let j=0; j<treverse.length;j++){
										ts += Number(treverse[j]) * 60 ** (j)
									}
								}
								else{
									// 毫秒单独放置
									for (let j=0; j<treverse.length;j++){
										if (j == 0){
											ts += Number(treverse[j]) / 1000
										}
										else{
											ts += Number(treverse[j]) * 60 ** (j - 1)
										}
									}
								}
								ts = ts.toFixed(2)
								let l = tl.splice(1,1000).join(']').trim()
								if (l.length > 0){
									lrcj.times.push(ts)
									lrcj.lrcs.push(l)
								}
							}
							else{
								let l = tl.splice(1,1000).join(']').trim()
								if (l.length > 0){
									lrcj.times.push(Number(t_).toFixed(2))
									lrcj.lrcs.push(l)
								}
							}
							
						}
					}
				}
				for (let i=0;i<this.spaceLineNum;i++){
					lrcj.lrcs.push('')
					lrcj.lrcs.splice(0,0,'')
				}
				return lrcj
			},
		}
	}
</script>

<style>
	.alllist{
		position: absolute;
		top:0;
		z-index: 10090;
	}
	.lyric-main {
		position: relative;
	}
	.lyric-show {
		position: absolute;
		overflow-anchor: none;
	}
	.lyric-show ::-webkit-scrollbar{
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}
	.lyric-show text{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		text-align: center;
		white-space: nowrap;
		height: 60rpx;
		font-size: 30rpx;
		overflow: auto;
	}
	.center-view {
		position: absolute;
		display: flex;
		flex-direction: row;
		align-items: center;
		white-space: nowrap;
		width: 100%;
		opacity: 0.6;
		overflow: visible;
		pointer-events: none;
	}
	.center-btn{
		position: absolute;
		left: 0;
		width: 20%;
		text-align: left;
		padding: 0 10rpx;
		color: #ffffff;
		pointer-events: all;
	}
	.center-btn:active{
		opacity: 0.6;
	}
	.center-line {
		position: absolute;
		left: 20%;
		width: 60%;
		height: 2rpx;
		background-color: #ffffff;
		pointer-events: none;
	}
	.center-time{
		position: absolute;
		right: 0;
		width: 20%;
		text-align: right;
		padding: 0 10rpx;
		color: #ffffff;
	}
	.check{
		position: absolute;
		float: left;
		padding: 0 10rpx;
		opacity: 0.5;
	}
	.selectControl{
		position: absolute;
		bottom: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		width: 100%;
		background-color: grey;
	}
	.selectControl view:active{
		opacity: 0.8;
	}
	.selectControl view{
		margin: 10rpx 0;
		padding: 10rpx 4rpx;
		width: 30%;
		overflow: hidden;
		white-space: nowrap;
		text-align: center;
		font-size: 30rpx;
		border-radius: 60rpx;
		background-color: grey;
	}
</style>
