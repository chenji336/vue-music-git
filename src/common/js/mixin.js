import {playMode} from 'common/js/config'
import {mapGetters, mapMutations} from 'vuex'
import {shuffle} from 'common/js/util'

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

export const playerMixin = {
	computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence'
           : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
    	'mode'
    ])
	},
	methods: {
    changeMode() {
      let mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      let list = []

      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
      this.setPlaylist(list)
    },
    ...mapMutations({
    	setPlayMode: 'SET_PLAY_MODE',
    	setCurrentIndex: 'SET_CURRENT_INDEX',
    	setPlaylist: 'SET_PLAYLIST'
    })
	}
}