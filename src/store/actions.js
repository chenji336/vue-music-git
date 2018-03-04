import * as types from './mutation-types'
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'

function findIndex (list, currentSong) {
	let index = list.findIndex((item) => {
		return item.id === currentSong.id
	})
	return index
}

export const selectPlay = function({commit, state}, {list, index}) {
	if (state.mode === playMode.random) {
		let randomList = shuffle(list)
		commit(types.SET_PLAYLIST, randomList)
		index = findIndex(randomList, list[index])
	} else {
		commit(types.SET_PLAYLIST, list)
	}
	commit(types.SET_SEQUENCE_LIST, list)
	commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}

export const randomPlay = function ({commit, state}, {list}) {
	let randomList = shuffle(list)
	commit(types.SET_PLAYLIST, randomList)
	commit(types.SET_SEQUENCE_LIST, list)
	commit(types.SET_CURRENT_INDEX, 0)
	commit(types.SET_PLAY_MODE, playMode.random)
	commit(types.SET_PLAYING_STATE, true)
	commit(types.SET_FULL_SCREEN, true)
}
