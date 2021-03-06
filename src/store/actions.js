import * as types from './mutation-types'
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'

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

export const saveSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, clearSearch(query))
}

export const deleteSong = function({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let pIndex = playlist.findIndex((item) => {
    return song.id === item.id
  })
  let sIndex = sequenceList.findIndex((item) => {
    return song.id === item.id
  })

  // 这个需要在下面if判断之前执行，否则currentIndex不会--
  playlist.splice(pIndex, 1)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playState)
}

export const deleteSongList = function({commit}, song) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// favorite save delete
export const saveFavoriteList = function({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
