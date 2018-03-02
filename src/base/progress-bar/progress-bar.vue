<template>
    <div class='progress-bar' ref='progressBar' @click='progressClick'>
      <div class='bar-inner'>
        <div class='progress' ref='progress'></div>
        <div class='progress-btn-wrapper' ref='progressBtn'
             @touchstart='progressTouchstart'
             @touchmove='progressTouchmove'
             @touchend='progressTouchend'
        >
          <div class='progress-btn'></div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'

  const transform = prefixStyle('transform')
  // 本来是16，但是感觉没有滚动到最后，所以自己设置成了14
  const progressBarWidth = 16
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      progressTouchstart(e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        // startX这个还是跟progress.clientWidth不一样的
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchmove(e) {
        if (!this.touch.initiated) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(Math.max(0, deltaX + this.touch.left), this.$refs.progressBar.clientWidth - progressBarWidth)
        this._offset(offsetWidth)
      },
      progressTouchend() {
        this.touch.initiated = false
        this._trigglePercent()
      },
      progressClick(e) {
        this._offset(e.offsetX)
        this._trigglePercent()
      },
      setProgressOffset(percent) {
        // !this.touch.initiated是为了防止在拖动的时候，歌曲也在进行动画操作
        if (percent > 0 && !this.touch.initiated) {
          let barWidth = this.$refs.progressBar.clientWidth - progressBarWidth
          let offsetWidth = percent * barWidth
          this._offset(offsetWidth)
        }
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      },
      _trigglePercent() {
        const percent = this.$refs.progress.clientWidth / (this.$refs.progressBar.clientWidth - progressBarWidth)
        this.$emit('percentChange', percent)
      }
    },
    watch: {
      percent(newPercent) {
        this.setProgressOffset(newPercent)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
