<template>
	<scroll class='listview'
          :data='data'
          ref='listview'
          :listen-scroll='listenScroll'
          @scroll='scroll'
          :probe-type='probeType'>
		<ul>
			<li class='list-group' v-for='group in data' ref='listGroup'>
				<h2 class='list-group-title'>{{group.title}}</h2>
				<ul>
					<li  @click='selectSinger(item)' class='list-group-item' v-for='item in group.items'>
						<img class='avatar' v-lazy='item.avatar'>
						<span class='name'>{{item.name}}</span>
					</li>
				</ul>
			</li>
		</ul>
		<div class='list-shortcut' @touchstart.stop.prevent='onTouchstartShortcut' @touchmove.stop.prevent='onTouchmoveShortcut'>
			<ul>
				<li class='item' :class='{"current":currentIndex===index}' v-for='(item,index) in shortcutList' :data-index='index'>{{item}}</li>
			</ul>
		</div>
    <div class='list-fixed' v-show='scrollY <= 0' ref='fixed'>
      <h2 class='fixed-title'>{{fixedTitle}}</h2>
    </div>
    <div class='loading-container' v-show='!data.length'>
      <loading></loading>
    </div>
	</scroll>
</template>

<script type='text/ecmascript-6'>
	import Scroll from 'base/scroll/scroll'
	import {getData} from 'common/js/dom'
  import Loading from 'base/loading/loading'
  const ANCHOR_HEIGHT = 18
  const FIXED_HEIGHT = 30
	export default {
    data() {
      return {
        listenScroll: true,
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
		props: {
			data: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
    created() {
      // 不用放在data里面，因为不需要跟dom进行绑定。这样就可以不用去监听
      this.touch = {}
      this.listHeight = []
      // 没有把probeType放到data里面是因为只需要使用一次，不需要时时监听
      this.probeType = 3
    },
		computed: {
			shortcutList() {
				return this.data.map((group) => {
					return group.title.substr(0, 1)
				})
			},
      fixedTitle() {
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
		},
		methods: {
      selectSinger(singer) {
        this.$emit('select', singer)
      },
			onTouchstartShortcut(e) {
				let anchorIndex = getData(e.target, 'index')
        this.touch.y1 = e.touches[0].pageY
        this.touch.index = anchorIndex
				this._scrollTo(anchorIndex)
			},
      onTouchmoveShortcut(e) {
        this.touch.y2 = e.touches[0].pageY
        // |0 就是向下取整 Math.floor
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        // getAttribute的anchorindex是string类型
        let anchorIndex = parseInt(this.touch.index) + delta
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _scrollTo(index) {
        // 排除0但是确实undefined、null这样的情况
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        console.log(index)
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculate() {
        let height = 0
        const listGroup = this.$refs.listGroup
        this.listHeight.push(height)
        for (let i = 0; i < listGroup.length; i++) {
          let group = listGroup[i]
          height += group.clientHeight
          this.listHeight.push(height)
        }
      }
		},
    watch: {
      data() {
        // 不使用this.$nextTick是为了兼容
        setTimeout(() => {
          this._calculate()
        }, 20)
      },
      scrollY(newY) {
        // 向下滑是负数
        newY = -newY
        let listHeight = this.listHeight
        for (let i = 0; i < listHeight.length; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (height2 && (newY >= height1 && newY < height2)) {
            this.currentIndex = i
            this.diff = height2 - newY
            return
          }
        }
        // 如果以后出现联动高亮显示出现问题，那么分成上中下分别考虑
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < FIXED_HEIGHT) ? (newVal - FIXED_HEIGHT) : 0
        // 减少dom操作
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3D(0, ${fixedTop}px, 0)`
      }
    },
		components: {
			Scroll,
      Loading
		}
	}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
	@import "~common/stylus/variable"
	.listview
	  position: relative
	  width: 100%
	  height: 100%
	  overflow: hidden
	  background: $color-background
	  .list-group
	    padding-bottom: 30px
	    .list-group-title
	      height: 30px
	      line-height: 30px
	      padding-left: 20px
	      font-size: $font-size-small
	      color: $color-text-l
	      background: $color-highlight-background
	    .list-group-item
	      display: flex
	      align-items: center
	      padding: 20px 0 0 30px
	      .avatar
	        width: 50px
	        height: 50px
	        border-radius: 50%
	      .name
	        margin-left: 20px
	        color: $color-text-l
	        font-size: $font-size-medium
	  .list-shortcut
	    position: absolute
	    z-index: 30
	    right: 0
	    top: 50%
	    transform: translateY(-50%)
	    width: 20px
	    padding: 20px 0
	    border-radius: 10px
	    text-align: center
	    background: $color-background-d
	    font-family: Helvetica
				.item
				padding: 3px
				line-height: 1
				color: $color-text-l
				font-size: $font-size-small
				&.current
				  color: $color-theme
			.list-fixed
			  position: absolute
			  top: 0
			  left: 0
			  width: 100%
			  .fixed-title
			    height: 30px
			    line-height: 30px
			    padding-left: 20px
			    font-size: $font-size-small
			    color: $color-text-l
			    background: $color-highlight-background
			.loading-container
			  position: absolute
			  width: 100%
			  top: 50%
			  transform: translateY(-50%)
</style>
