import {mapGetters} from 'vuex'

export const playlistMixin = {
	computed: {
		...mapGetters([
				'playlist'
			])
	},
	mounted() {
		this.handlePlaylist(this.playlist)
	},
	activated() {
		this.handlePlaylist(this.playlist)
	},
	watch: {
		playlist(newVal) {
			// 监听到改变的时候执行，这样才能知道scroll高度
			this.handlePlaylist(newVal)
		}
	},
	methods: {
		handlePlaylist() {
			throw new Error('component must implement handlePlaylist method')
		}
	}
}