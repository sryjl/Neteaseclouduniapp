<template>
	<view :style="{height:swiperHeight+'px'}">
		<view @click.stop="focussearch">
			<uni-search-bar :placeholder="searchPlaceHolder" @confirm="search($event)" v-model="keyword" @input="getsuggestion"></uni-search-bar>
		</view>
		<view class="showSearchcontent" v-if="suggestionlist.length !== 0">
			<view class="searchconent">
				搜索：{{keyword.value}}
			</view>
			<view class="searchitem" v-for="(item,index) in suggestionlist" :key='index'>
				<text class="iconfont icon-sousuo"></text>
				<text class="itemcontent">{{item.keyword}}</text>
			</view>
		</view>
		<view :style="{height:blurHeight+'px'}" @click="blursearch">
			<!-- 历史记录 -->
			<view class="history" v-if="historylist.length>0">
				<view class="title">
					历史
				</view>
				<view class="historyItem" v-for="(item,index) in historylist" :key="index">
					{{item}}
				</view>
				<!-- 删除历史记录按钮 -->
				<view class="iconfont icon-shanchu delete" @click="deletehistory(2)">
				</view>
			</view>
			<!-- 热搜榜 -->
			<view class="firesearch">
				<image src="../../static/icon/fire.png" mode="scaleToFill" class="fire"></image>
				<text>热搜榜</text>
			</view>
			<view class="hotlist">
				<view class="lefthot">
					<navigator :class="{bold:index<='2'?true:false}" v-for="(item,index) in hotlist" v-if='(index+2)%2==0' :key="index"
					 url=""><text :class="{lessthanten:index<='8'?true:false}">{{index+1}}</text><text>{{item.searchWord}}</text>
						<image v-if="item.iconUrl" :src="hotlist[index].iconUrl" mode="heightFix"></image>
					</navigator>

				</view>
				<view class="righthot">
					<navigator :class="{bold:index<='2'?true:false}" v-for="(item,index) in hotlist" v-if='(index+2)%2==1' :key="index"
					 url=""><text :class="{lessthanten:index<='8'?true:false}">{{index+1}}</text><text>{{item.searchWord}}</text>
						<image v-if="item.iconUrl" :src="hotlist[index].iconUrl" mode="heightFix"></image>
					</navigator>
				</view>
			</view>
			<button :class="{hotserchmore:true, iconfont:true,hide:showView}" plain @click="moreHotlist($event)">展开更多热搜&#xe791;</button>
		</view>	
		<!-- au-dialog -->
		<aui-dialog 
	    ref="dialog"
	    :title="auiDialog.title"
	    :msg="auiDialog.msg"
	    :btns="auiDialog.btns"
	    :mask="auiDialog.mask"
	    :maskTapClose="auiDialog.maskTapClose"
	    :items="auiDialog.items"
	    :theme="auiDialog.theme"
	    @callback="dialogCallback"
	></aui-dialog>
	</view>
	

</template>

<script>
	import {aui} from '../../components/aui-dialog/common/aui/js/aui.js'
	export default {
		data() {
			return {
				auiDialog: {
				        title: '',
				        msg: '',
				        btns: [{name: '确定'}],
				        mask: true,
				        maskTapClose: true,
				        items: [],
				        theme: 1,
				      },
				blurHeight: 500,
				swiperHeight: 500,
				keyword: '',
				searchPlaceHolder: '',
				realplaceHolder: '',
				hotlist: [],
				showView: false,
				suggestionlist: [],
				isSend: false,
				historylist: []
			};
		},
		methods: {
			// 回调函数解决历史删除和取消
			 dialogCallback(e){
			    var _this = this;
				if(e.index == "0"){
					return
				}
				uni.removeStorageSync('historykeyword')
				this.historylist = []
				},
				
			async getPlaceHolder() {
				const [error, res] = await uni.request({
					url: 'http://localhost:3000/search/default'
				})
				if (res.data.code !== 200) {
					return false
				}
				this.searchPlaceHolder = res.data.data.showKeyword
				this.realplaceHolder = res.data.data.realkeyword
			},
			async getHotList() {
				const [error, res] = await uni.request({
					url: 'http://localhost:3000/search/hot/detail'
				})
				if (res.data.code !== 200) {
					return false
				}
				this.hotlist = res.data.data.slice(0, 10)
			},
			async moreHotlist(val) {
				const [error, res] = await uni.request({
					url: 'http://localhost:3000/search/hot/detail'
				})
				if (res.data.code !== 200) {
					return false
				}
				this.hotlist = res.data.data
				this.showView = true
			},
			async getsuggestion() {
				if (!this.keyword.value) {
					this.suggestionlist = []
					return
				}
				if (this.isSend) {
					return
				}
				this.isSend = true
				const [error, res] = await uni.request({
					url: 'http://localhost:3000/search/suggest',
					data: {
						keywords: this.keyword.value.trim(),
						type: 'mobile'
					}
				})
				if (res.data.code !== 200) {
					return false
				}
				this.suggestionlist = res.data.result.allMatch
				setTimeout(() => {
					this.isSend = false
				}, 300)
			},
			blursearch() {
				this.suggestionlist = []
			},
			focussearch() {
				this.getsuggestion()
			},
			saveHistory(val) {
				if (this.historylist.indexOf(val) !== -1) {
					this.historylist.splice(this.historylist.indexOf(val), 1)
				}
				this.historylist.unshift(val)
				if (this.historylist.length > 8) {
					this.historylist = this.historylist.slice(0, 8)
				}
				uni.setStorageSync('historykeyword', this.historylist);
			},
			async getHistory() {
				const historyStorage = await uni.getStorageSync('historykeyword')
				if(!historyStorage){
					return
				}
				this.historylist = historyStorage
			},
			search(val) {
				this.suggestionlist = []
				if (!val.value) {
					val.value = this.searchPlaceHolder
				}
				this.saveHistory(val.value)

			},
			deletehistory(theme) {
				var _this = this;
				    _this.auiDialog.title = '提示';
				    _this.auiDialog.msg = '确定清空全部历史记录？';
				    _this.auiDialog.items = [];
				    _this.auiDialog.btns = [
				        {name: '取消'},
				        {name: '删除'}
				    ];
				    _this.auiDialog.theme = theme;
				    _this.$refs.dialog.show();
			}
		},
		created() {
			this.getPlaceHolder()
			this.getHotList()
			this.getHistory()
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => { // 需要使用箭头函数，swiper 高度才能设置成功
					// 获取swiperHeight可以获取的高度，窗口高度减去导航栏高度
					this.swiperHeight = res.windowHeight
					this.blurHeight = res.windowHeight - 50
				}
			});
		},
	}
</script>

<style lang="less">
	.firesearch {
		height: 60rpx;
		border-bottom: 1px solid #E6E6E6;
		text-align: left;

		text {
			margin: 0;
			height: 40rpx !important;
			font-size: 30rpx;
			vertical-align: middle;
		}

		.fire {
			margin-left: 30rpx;
			height: 30rpx;
			width: 30rpx;
			vertical-align: middle;
		}

	}

	.hotlist::after {
		content: "";
		display: block;
		height: 0;
		clear: both;
		visibility: hidden;

	}

	.lefthot {
		width: 46%;
		float: left;
		margin-top: 30rpx;
		margin-left: 4%;

		navigator {
			font-size: 30rpx;
			margin-bottom: 20rpx;
			display: block;
			white-space: nowrap; //不换行	

			text {
				margin-right: 15rpx;
				max-width: 60%;
				overflow: hidden; //超出的文本隐藏
				text-overflow: ellipsis; //用省略号显示
				display: inline-block;
			}

			.lessthanten {
				margin-right: 30rpx !important;
			}

			image {
				height: 30rpx;
				margin-bottom: 6rpx;
			}
		}

	}

	.righthot {
		width: 50%;
		float: left;
		margin-top: 30rpx;

		navigator {
			font-size: 30rpx;
			margin-bottom: 20rpx;
			display: block;
			white-space: nowrap; //不换行	

			text {
				margin-right: 15rpx;
				max-width: 60%;
				overflow: hidden; //超出的文本隐藏
				text-overflow: ellipsis; //用省略号显示
				display: inline-block;
			}

			.lessthanten {
				margin-right: 30rpx !important;
			}

			image {
				height: 30rpx;
				margin-bottom: 6rpx;
			}
		}

	}

	.hotserchmore {
		margin-top: 30rpx;
		text-align: center;
		font-size: 20rpx;
		color: #808080;
	}

	.hide {
		display: none;
	}

	.bold {
		font-weight: bold;

		.lessthanten {
			color: #EC4141;
		}
	}

	.showSearchcontent {
		position: absolute;
		left: 15rpx;
		z-index: 1;
		background-color: #FFFFFF;
		width: 85%;
		border: 1px solid #eee;
	}

	.searchconent {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 14px;
		margin-left: 30rpx;
		border-bottom: 1rpx solid #d43c33;
	}

	.searchitem {
		margin-left: 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		display: flex;

		.itemcontent {
			color: #808080;
			flex: 1;
			margin-left: 20rpx;
			border-bottom: 1px solid #eee;
			font-size: 14px;
			white-space: nowrap; //不换行
			overflow: hidden; //超出的文本隐藏
			text-overflow: ellipsis;
		}
	}

	.history {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		line-height: 50rpx;

		.title {
			height: 50rpx;
			font-size: 28rpx;
			margin-left: 30rpx;
			margin-bottom: 20rpx;
		}

		.historyItem {
			height: 50rpx;
			font-size: 26rpx;
			background-color: #ededed;
			margin-left: 20rpx;
			padding: 0 30rpx;
			border-radius: 20rpx;
			margin-bottom: 20rpx;
		}

		.delete {
			position: absolute;
			bottom: 20rpx;
			right: 15rpx;
			font-size: 36rpx;
		}
	}
</style>
