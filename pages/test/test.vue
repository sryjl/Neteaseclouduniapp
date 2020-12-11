<template>
	<view>
		<view>
			<scroll-view scroll-y="true" :style="{height:audiolist.length===0?mainHeight+'px':videomainHeight+'px'}">
				<view class="songitem" v-for="(item,index) in songlist" :key = 'item.id'>
					<text class="songName">{{item.name}}</text>
					<view class="singer">
						<text v-for="(item1,index1) in item.ar" :key = 'item1.id'>{{index1===0?item1.name:'/'+item1.name}}</text>
					    <text>-{{item.al.name}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<zaudio theme="theme3" :autoplay="false" :continue="true" ref="zaudio"></zaudio>
	</view>
</template>

<script>
	import zaudio from '@/zaudio/zaudio.vue';
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			zaudio
		},
		data() {
			return {
				videomainHeight: 500,
				mainHeight: 500,
				offset:0,
				type:1,
				songlist:[]
			}
		},
		methods:{
			async getsearch(key,type){
				const res = await this.$http({
					url:"cloudsearch",
					data:{
						keywords:key,
						type:type,
						offset:this.offset
					}
				})
				console.log(res)
				if(type===1)
				this.songlist = res.data.result.songs
				
			}
		},
		computed: {
			...mapGetters(['audiolist', 'playinfo'])
		},
		onLoad(e) {
			this.getsearch('唐朝乐队',1)
			console.log('唐朝')
			const Magnification = uni.getSystemInfoSync().windowWidth / 750
			this.mainHeight = uni.getSystemInfoSync().windowHeight
			this.videomainHeight = uni.getSystemInfoSync().windowHeight - 150 * Magnification

		}
	}
</script>

<style lang="less">
	.songItem{
		.songName{
			font-size: 30rpx;
		}
		.singer{
			font-size: 20rpx
		}
	}
</style>
