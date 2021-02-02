<template>
	<view>
		<view>
			<scroll-view scroll-y="true" :style="{height:audiolist.length===0?mainHeight+'px':videomainHeight+'px'}">

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
			}
		},
		computed: {
			...mapGetters(['audiolist', 'playinfo'])
		},
		onLoad() {
			const Magnification = uni.getSystemInfoSync().windowWidth / 750
			this.mainHeight = uni.getSystemInfoSync().windowHeight
			this.videomainHeight = uni.getSystemInfoSync().windowHeight - 150 * Magnification

		}
	}
</script>

<style lang="less">
</style>
