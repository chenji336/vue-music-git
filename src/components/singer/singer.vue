<template>
	<div class='singer'>
		<list-view :data='singers' @select='selectSinger'></list-view>
    <router-view></router-view>
	</div>
</template>

<script type='text/ecmascript-6'>
	import {getSingerList} from 'api/singer'
	import {ERR_OK} from 'api/config'
	import Singer from 'common/js/singer'
	import ListView from 'base/listview/listview'
  import {mapMutations} from 'vuex'

	const HOT_NAME = '热门'
	const HOT_SINGER_LEN = 10
	export default {
		data() {
			return {
				singers: []
			}
		},
		created() {
			this._getSingerList()
		},
		methods: {
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
			_getSingerList() {
				getSingerList().then((res) => {
					if (res.code === ERR_OK) {
						this.singers = this._normalize(res.data.list)
					}
				})
			},
			_normalize(list) {
				let map = {
					hot: {
						title: HOT_NAME,
						items: []
					}
				}
				list.forEach((item, index) => {
					// 查看Singer的constructor是否是一个{}
					if (index === 1) {
						// console.log(new Singer(item.Fsinger_mid, item.Fsinger_name))
					}
					if (index < HOT_SINGER_LEN) {
						map.hot.items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
					}
					const key = item.Findex
					if (!map[key]) {
						map[key] = {
							title: key,
							items: []
						}
					}
					map[key].items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
				})
				// console.log(map)

				// 为了得到有序列表，需要序列化map
				let hot = []
				let ret = []
				for (let key in map) {
					if (key === 'hot') {
						hot.push(map[key])
					} else if (key.match(/[a-zA-Z]/)) {
						ret.push(map[key])
					}
				}
				ret.sort((a, b) => {
					return a.title.charCodeAt(0) - b.title.charCodeAt(0)
				})
				hot = hot.concat(ret)
				return hot
			},
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
		},
		components: {
			ListView
		}
	}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
	.singer
		position: fixed
		top: 88px
		bottom: 0
		width: 100%
</style>
