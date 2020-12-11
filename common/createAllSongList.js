  export default{
	  methods:{
		  createAllSongList(arr,arr1){
			  arr.forEach(item => {
			  	if (item.fee === 1) return
			  	let singername = ''
			  	item.ar.forEach((item, index) => {
			  		if (index === 0) {
			  			singername = item.name
			  		} else {
			  			singername = singername + '/' + item.name
			  		}
			  	})
			  
			  	
				arr1.push({
			  		src: 'http://music.163.com/song/media/outer/url?id=' + item.id + '.mp3',
			  		title: item.name,
			  		singerid: item.ar.map(item => {
			  			return {
			  				id: item.id,
			  				name: item.name
			  			}
			  		}),
			  		singer: singername,
			  		coverImgUrl:item.al.picUrl,
					id:item.id
			  	})
			  
			  })
		  }
	  },
	 }