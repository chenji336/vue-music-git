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

export const randomPlay = function({commit, state}, {list}) {
	let randomList = shuffle(list)
	commit(types.SET_PLAYLIST, randomList)
	commit(types.SET_SEQUENCE_LIST, list)
	commit(types.SET_CURRENT_INDEX, 0)
	commit(types.SET_PLAY_MODE, playMode.random)
	commit(types.SET_PLAYING_STATE, true)
	commit(types.SET_FULL_SCREEN, true)
}

export const insertSong = function({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let currentSong = playlist[currentIndex]
  // find playlist index
  let fpIndex = findIndex(playlist, song)
  // 确定要插入的位置
  currentIndex++
  playlist.splice(currentIndex, 0, song)

  // playlist删除相同song
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  // sequenceList插入song和删除相同song的处理

  // 获取sequenceList中歌曲需要插入的位置
  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}
