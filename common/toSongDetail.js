  export default{
	  methods:{
		  toSongDetail(e,fee) {
				// 之后抽出来放到组件里
				//检测列表是否相同
				if(fee === 1){
					uni.showToast({
						icon:"none",
						title:'vip受限，无法播放',
						duration:1000
					})
					return console.log('版权受限')
				}
				if (JSON.stringify(this.songIdList) === JSON.stringify(this.audiolist)) {
					//相同，检测这首歌是否在播放中
					if ('http://music.163.com/song/media/outer/url?id=' + e + '.mp3' === this.playinfo.src) {
						// 播放中跳转到detail
						uni.navigateTo({
							url: '../songDtail/songDtail'
						})
					} else {
						let key = this.audiolist.findIndex((item) => {
							return 'http://music.163.com/song/media/outer/url?id=' + e + '.mp3' === item.src
						})
						// 不在播放中播放这首歌
						this.set_audio(this.audiolist[key]);

						// 播放音频
						this.$refs.zaudio.operation(true);
					}
				}else{
					// 列表不同
					// 设置列表
					this.set_audiolist({
						data: this.songIdList,
						status: false
					});	
					// 找到这首歌
					let key = this.audiolist.findIndex((item) => {
						return 'http://music.163.com/song/media/outer/url?id=' + e + '.mp3' === item.src
					})
					// 播放这首歌
					this.set_audio(this.audiolist[key]);
					
					// 播放音频
					this.$refs.zaudio.operation(true);
					//跳转播放页面
					uni.navigateTo({
						url: '../songDtail/songDtail'
					})
				}
			},
	  }
  }
		  