<template>
	<view>
		<!-- 头部 -->
		<view :class="{nav:true,navAll:isImmersedStatusbar}">
			<!-- 返回+歌单 -->
			<image src="../../static/picture/return1.png" mode="aspectFit" @click="goback"></image>
			<text>评论</text>
			<text>({{totalCount}})</text>
		</view>
		<!-- 简单详情页 -->
		<view class="detail" :style="{top:isImmersedStatusbar?150+'rpx':100+'rpx'}">
			<image :src="detail.al.picUrl" mode="aspectFit" lazy-load='true'></image>
			<view class="somedetail">
				<text>{{detail.name}}</text>
				<text class="creator"><text v-for="(item,index) in detail.ar" :key="item.id">{{index===0?item.name:'/'+item.name}}</text></text>
			</view>
			<view class="iconfont icon-xiangyou">
			</view>

		</view>
		<!-- 间层效果起到隔离作用 -->
		<view class="all"></view>
		<!-- 评论 -->
		<view class="comment" :style="{top:isImmersedStatusbar?370+'rpx':320+'rpx'}">
					<view class="commentnav">
					<text>评论区({{totalCount}})</text>
					<view class="typeofcontent">
						<text :class="{active:sortType===1||sortType===99}" @click="getNewTypeComment" :data-item="1">推荐</text>
			            <text :class="{active:sortType===2}" @click="getNewTypeComment" :data-item="2">最热</text>
					    <text :class="{active:sortType===3}" @click="getNewTypeComment" :data-item="3">最新</text>
					</view>

				</view>	
			<scroll-view scroll-y="true" :style="{height:mainHeight +'px'}" @scrolltolower = "getComment(1)" :scroll-top='scrollTop'>
		
				<view class="com" v-for="(item,index) in comments" :key = "item.commentId">
					<view class="user">
						<view>
						<image :src="item.user.avatarUrl" mode="aspectFit" class="userimg"></image>
						<view class="userlist">
							<text class="name">{{item.user.nickname}}</text>
							<text class="date">{{getdate(item.time)}}</text>
					
						</view>
						</view>
						<view class="dianzan">
							<text>{{item.likedCount}}</text>
					        <text class="iconfont icon-dianzan"></text>
						</view>
					
					
					</view>
					<view class="content">
						<text>{{item.content}}</text>
						<view  v-if="item.beReplied" class="reply">
							<text class="replyname">@{{item.beReplied[0].user.nickname}}<text>:{{item.beReplied[0].content}}</text></text>
						</view>				
						<text @click="showChild(item.commentId)" class="morecontent" v-show="item.showFloorComment.replyCount > 0 ">{{item.showFloorComment.replyCount}}条回复<text class="iconfont icon-xiangyou"></text></text>
					</view>
				</view>
			</scroll-view>
		</view>
	    <!-- 楼中楼 -->
		<view class="childcomment" :style="{height:windowHeight+'px'}" v-if="showchild">
	    	<view class="childcom">
	    		<view class="chilnav">	<!-- 返回+歌单 -->
	    			<image src="../../static/picture/return1.png" mode="aspectFit" @click="closedchild"></image>
	    			<text>回复</text>
	    			<text>({{childCommentCount}})</text>
	    		</view>
				<scroll-view scroll-y="true" :style="{height:subHeight +'px'}"  @scrolltolower = "getMoreChildComment(parent.commentId)">
						
					<view class="com">
						<view class="user">
							<view>
							<image :src="parent.user.avatarUrl" mode="aspectFit" class="userimg"></image>
							<view class="userlist">
								<text class="name">{{parent.user.nickname}}</text>
								<text class="date">{{getdate(parent.time)}}</text>						
							</view>
							</view>
							<view class="dianzan">
								<text>{{parent.likedCount}}</text>
						        <text class="iconfont icon-dianzan"></text>
							</view>				
						</view>
						<view class="content" :style="{paddingBottom:30+'rpx'}">
							<text>{{parent.content}}</text>
						</view>
						<!-- 隔离层 -->
						<view class="all2">
						</view>
						<view class="morecommentnav">
							<text>全部回复</text>
						</view>
						<view class="com" v-for="(item,index) in childComment" :key = "item.commentId">
							<view class="user">
								<view>
								<image :src="item.user.avatarUrl" mode="aspectFit" class="userimg"></image>
								<view class="userlist">
									<text class="name">{{item.user.nickname}}</text>
									<text class="date">{{getdate(item.time)}}</text>
							
								</view>
								</view>
								<view class="dianzan">
									<text>{{item.likedCount}}</text>
							        <text class="iconfont icon-dianzan"></text>
								</view>		
							
							</view>
							<view class="content">
								<text>{{item.content}}</text>
								<view  v-if="item.beReplied" class="reply">
									<text class="replyname">@{{item.beReplied[0].user.nickname}}<text>:{{item.beReplied[0].content}}</text></text>
								</view>				
							</view>
						</view>
					</view>
				</scroll-view>
	    	</view>
	    </view>
		<button @click="toggleMask('show')" class="botton">评论</button>
		<ygc-comment ref="ygcComment"
		    :placeholder="'发布评论'" 
			@pubComment="pubComment"></ygc-comment>
	</view>
</template>

<script>
	export default {
	
		data() {
			return {
				showchild:false,
				isImmersedStatusbar: false,
				mainHeight:500,
				windowHeight:500,
				subHeight:500,
				totalCount:0,
				childCommentCount:0,
				type:0,
				// 0: 歌曲				
				// 1: mv				
				// 2: 歌单				
				// 3: 专辑				
				// 4: 电台				
				// 5: 视频				
				// 6: 动态
				id:0,
				pageNo:1,
				pagesize:20,
				sortType:1,
				moreTime:0,
				cursor:0,
				//节流阀
				bottomFlag:0,
				bise:0,
				bisechild:0,
				//复位
				scrollTop:0,
				srollflag:1,
				comments:[],
				parent:{},
				childComment:[],
				detail:{
					al:{
						picUrl:''
					}
				}
			}
		},
		methods:{
			//发布的回调
			pubComment(){
				
			},
			//显示评论
			toggleMask(type) {
				this.$refs.ygcComment.toggleMask(type);
			},
			//获取不同类型评论
			getNewTypeComment(e){				
				this.pageNo = 1
				this.bise = 0
				if (this.sortType === parseInt(e.currentTarget.dataset.item)) {
					return
				}else{
					this.sortType = parseInt(e.currentTarget.dataset.item)
					if(this.sortType === 1 && this.totalCount<1000){
						this.sortType = 99
					}
					this.getComment(0)
					this.srollflag++
					this.scrollTop = this.scrollTop + 0.00001 *this.srollflag
				}

			},
			//gobaack
			goback(){
				uni.navigateBack()
			},
			//时间戳转换方法
			async showChild(Id){
				const res = await this.$http({
					url:'comment/floor',
					data:{
						parentCommentId:Id,
						id:this.id,
						type:this.type
					}
				})
				console.log(res)
				this.childComment = res.data.data.comments
				this.parent =res.data.data.ownerComment
				this.childCommentCount = res.data.data.totalCount
				this.moreTime =res.data.data.time
				this.showchild = true
			},
			//获取更多的孩子
			async getMoreChildComment(Id){
				if(this.bisechild ===1){
					return
				}
				const res = await this.$http({
					url:'comment/floor',
					data:{
						parentCommentId:Id,
						id:this.id,
						type:this.type,
						time:this.moreTime
					}
				})
				console.log(res.data.data.time)
				if(res.data.data.time===0){
					return this.bisechild =1
				}
				this.moreTime =res.data.data.time		
				this.childComment.push(...res.data.data.comments)
			},
			closedchild(){
				this.showchild = false
				this.moreTime = 0
				this.bisechild = 0
			},
			getdate(e){
				let thisdate = new Date(e)
				let y = thisdate.getFullYear() 
				let m = thisdate.getMonth() + 1 
				let d = thisdate.getDate()
				let now = new Date()
				let nowy = now.getFullYear()
				if(y === nowy) 
				{
					return (m < 10 ? "0" + m : m) + "月" + (d < 10 ? "0" + d : d)+'日'
				}else{
					return y+'年'+(m < 10 ? "0" + m : m) + "月" + (d < 10 ? "0" + d : d)+'日'
					}
				
			},
			//获取详情
			async getDetail(){
				if(this.type === 0){
					const res = await this.$http({
						url:'song/detail',
						data: {ids:this.id}
					})
					this.detail= res.data.songs[0]
				}
			},
			//获取评论
		   	async getComment(e){
				if(this.bottomFlag===1 && e === 1 )return
				if(this.bise===1) return
				this.bottomFlag = 1
				console.log('触底')
				if(e === 1){
					this.pageNo++
				}
				let sendData ={
					id: this.id,
					type:this.type,
					pageNo:this.pageNo,
					pageSize:this.pagesize,
					sortType:this.sortType
				}
				if(this.sortType === 3){
					sendData.cursor = this.cursor
				}
				const res = await this.$http({
					url: 'comment/new',
					data:sendData
				})
				console.log(res)
				if(e===0){
					this.comments = res.data.data.comments
					this.totalCount =res.data.data.totalCount
				}else{
					console.log(res.data.data.comments)
					if(res.data.data.comments.length === 0){
						return this.bise = 1
					}
					this.comments.push(...res.data.data.comments)
				}
				if(this.sortType === 3){
					this.cursor = res.data.data.cursor
				}
				setTimeout(()=>{
					this.bottomFlag = 0
				},1000)
			}
		},
		onLoad(e) {
			console.log(e)
			const Magnification = uni.getSystemInfoSync().windowWidth / 750
			this.windowHeight = uni.getSystemInfoSync().windowHeight
			this.mainHeight = uni.getSystemInfoSync().windowHeight - 390 * Magnification -1
			this.subHeight =uni.getSystemInfoSync().windowHeight*0.8 - 70* Magnification
			//#ifdef APP-PLUS
			if(plus.navigator.isImmersedStatusbar())
			{
		
				this.mainHeight = uni.getSystemInfoSync().windowHeight -  440 * Magnification -1
				this.isImmersedStatusbar = true
			}
			else{ //非刘海屏
			this.isImmersedStatusbar = false
			 }
			 //#endif
			this.id =parseInt(e.id)
			this.type =parseInt(e.type)
			console.log(e)
			if(parseInt(e.num)<1000){
				this.sortType = 99
			}
			this.getComment(0)
			this.getDetail()
		}
	}
</script>

<style lang="less">
	.botton{
		position: absolute;
		bottom: 40rpx;
		right: 40rpx;
		width: 90rpx;
		height: 60rpx;
		line-height: 60rpx;
		box-sizing:inherit;
		font-size: 30rpx;
		z-index: 10089;
	}
	.morecommentnav{
		height: 70rpx;
		line-height: 70rpx;
		font-size: 30rpx;
		font-weight: bold;
		margin-left: 30rpx;
	}
	.all2{
		height: 15rpx;
		width: 100%;
		background-color: #F5F5F5;
	}
	.childcomment{
		position: absolute;
		display: flex;
		flex-direction: column-reverse;
		width: 100%;
		top:0;
		z-index: 10087;
		background-color: rgba(0,0,0,0.3);
		.childcom{
			border-radius: 30rpx 30rpx 0 0;
			background-color: #FFFFFF;
			width: 100%;
			height: 80%;
			.chilnav{
				image{
					width: 70rpx;
					height: 70rpx;
					margin-left:20rpx ;
					vertical-align: middle;
				}
				text{
					vertical-align: middle;
					font-size: 30rpx;
				}
			}
		}
	}
	.reply{
		font-size: 28rpx;
		padding-left: 20rpx;
		border-left: 3px solid #F5F5F5;
		width: 500rpx;
		.replyname{
			color: #007AFF;
			text{
				color: black;
			}
		}
	}
	.com {
		.user {
			margin-top: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			.userimg {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50rpx;
				margin-left: 30rpx;
				vertical-align: middle;
			}

			.userlist {
				padding-left: 20rpx;
				width: ;
				display: inline-block;
				vertical-align: middle;
				text{
					display: block;
				}
				.name{
					font-size: 30rpx;
					color: #515151;
					font-size: 28rpx;
				}
				.date{
					font-size: 25rpx;
					color: #808080;
				}
			}
			.dianzan{
				display: inline-block;
				text{
					font-size: 28rpx;
					color: #808080;
				}
				.icon-dianzan{
					padding-left: 10rpx;
					padding-right: 20rpx;
				}
			}
		}
        .content{
			margin-left: 110rpx;
			padding-right: 20rpx;
			font-size: 28rpx;
			line-height: 42rpx;
			width: 600rpx;
			border-bottom: 1px solid #F5F5F5;
			.morecontent{
				font-size: 25rpx;
				display: block;
				color: #007AFF;
				.icon-xiangyou{
					font-size: 25rpx;
				}
			}
		}
		
	}

	.comment {
		width: 100%;
		position: absolute;
		z-index: 10086;
		background-color: #FFFFFF;

		.commentnav {
			height: 70rpx;
			line-height: 70rpx;
			font-size: 30rpx;
			margin-left: 30rpx;
			font-weight: bold;
			border-bottom: 1px solid #F5F5F5;
			display: flex;
			justify-content: space-between;
			.typeofcontent{
				display: inline-block;
				margin-right: 20rpx;
				text{
					font-size: 30rpx;
					color: #808080;
					font-weight: normal;
					padding-left: 20rpx;
				}
				.active{
					font-weight: bold;
					color: black;
				}
			}
		}
	}

	.all {
		position: absolute;
		height: 70rpx;
		width: 750rpx;
		background-color: #E9EBEC;
		top: 300rpx
	}

	.nav {
		width: 100%;
		position: absolute;
		background-color: #FFFFFF;
		top: 0;
		z-index: 10086;

		image {
			width: 80rpx;
			height: 80rpx;
			margin-top: 20rpx;
			margin-left: 10rpx;
			vertical-align: middle;
		}

		text {
			vertical-align: middle;
			padding-left: 20rpx;
			font-size: 35rpx;
		}

		color: #000000;
	}

	.navAll {
		top: 50rpx !important;
	}

	// 行内元素明显比较方便，。一开始居然没想到，脑瘫了
	.detail {
		height: 200rpx;
		width: 100%;
		background-color: #FFFFFF;
		position: absolute;
		z-index: 10086;

		image {
			margin: 25rpx 15rpx 0rpx 25rpx;
			height: 150rpx;
			width: 150rpx;
			border-radius: 10rpx;
			vertical-align: middle;
		}

		.somedetail {
			vertical-align: middle;
			display: inline-block;

			text {
				width: 460rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-top: 10rpx;
				font-size: 30rpx;
				display: block;
			}

			.creator {
				margin-top: 20rpx;
				font-size: 25rpx;
				color: #197DE0;
				text{
					display: inline;
					margin-top: 0;
					font-size: 25rpx;
				}
			}
		}

		.icon-xiangyou {
			display: inline-block;
			width: 80rpx;
			margin-left: 20rpx;
			font-size: 25rpx;
			color: #808080;
			vertical-align: middle;
		}
	}
</style>
