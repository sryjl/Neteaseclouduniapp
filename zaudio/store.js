export default {
	namespaced: false,
	state: {
		renderIndex: 0, // 组件渲染的索引值
		audiolist: [], //音频列表


		audio: { //zaudio组件-当前渲染的音频数据
			current: '00:00', //当前时间
			duration: '00:00', //总时间
			duration_value: 0, //总长度
			current_value: 0, //当前长度
			src: '', //当前音频地址
			title: '', //当前音频标题
			singer: '', //当前音频作者
			coverImgUrl: '', //当前音频封面
		},
		playinfo: { //$audio对象-当前播放的音频数据
			current: '00:00', //当前时间
			duration: '00:00', //总时间
			duration_value: 0, //总长度
			current_value: 0, //当前长度
			src: "", //当前音频地址	
			title: '', //当前音频标题
			singer: '', //当前音频作者
			coverImgUrl: '' ,//当前音频封面
		},
		paused: true, //$audio对象当前播放音频的暂停状态

		n_pause: false, //$audio对象当前播放音频的意外中断的状态


	},
	mutations: {

		//设置音频列表数据 
		// @params status Boolean  true-> 记录之前的列表数据 false->不记录,仅仅赋值
		// @params data   Array    列表数据
		set_audiolist(state, payload) {
			let {
				data,
				status
			} = payload
			if (status) {
				state.audiolist.push(...data)
			} else {
				if(state.audiolist.length === 0){
					state.audiolist.push(...data)
				}else{
				    state.audiolist=[]
					state.audiolist.push(...data)
				}
				
			}
		},
		//设置zaudio组件当前渲染的音频信息
		set_audio(state, data) {
			state.audio = data;
			let renderIndex = state.audiolist.findIndex(i => i.src == data.src);

			if (renderIndex >= 0) {
				this.commit('set_renderIndex', renderIndex)
			}

		},
		//设置当前播放信息
		set_playinfo(state, data) {
			
			if (data.current) {
				state.playinfo.current = data.current
			}
			if (data.duration) {
				state.playinfo.duration = data.duration
			}
			if (data.duration_value) {
				state.playinfo.duration_value = data.duration_value
			}
			if (data.current_value) {
				state.playinfo.current_value = data.current_value
			}
			if (data.src) {
				state.playinfo.src = data.src
			}
			if (data.title) {
				state.playinfo.title = data.title
			}
			if (data.singer) {
				state.playinfo.singer = data.singer
			}
			if (data.coverImgUrl) {
				state.playinfo.coverImgUrl = data.coverImgUrl
			}
			if (data.id) {
				state.playinfo.id = data.id
			}
			if (data.singerid) {
				state.playinfo.singerid = data.singerid
			}
			// for (var i in data) {
			// 	if (state.playinfo.hasOwnProperty(i)) {
			// 		state.playinfo[i] = data[i]
			// 	}
			// }

		},
		set_pause(state, data) {
			state.paused = data
		},
		set_n_pause(state, data) {
			state.n_pause = data
		},

		//设置渲染索引 和 渲染信息
		set_renderIndex(state, data) {
			state.renderIndex = data;
			if (state.audiolist.length == 0) return
			state.audio = {
				src: state.audiolist[data].src,
				title: state.audiolist[data].title,
				singer: state.audiolist[data].singer,
				coverImgUrl: state.audiolist[data].coverImgUrl,
				current: '00:00',
				duration: '00:00',
				current_value: 0,
				duration_value: 100
			}
		}

	},
	getters: {
		audiolist: state => state.audiolist,
		playinfo: state => state.playinfo,
		n_pause: state => state.n_pause,
		paused: state => state.paused,
		renderIndex: state => state.renderIndex,
		audio: state => state.audio,
		playIndex: state => {
			let index = state.audiolist.findIndex(i => i.src == state.playinfo.src)
			return index <= 0 ? 0 : index
		},
		renderIsPlay: state => {
			return state.audio.src == state.playinfo.src
		}
	}
}
