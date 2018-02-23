<template>
  <div>
  	<m-header></m-header>
  	<tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
	import MHeader from 'components/m-header/m-header'
	import Tab from 'components/tab/tab'
	export default {
    // created() {
    //   this.$http.get('http://t.yushu.im/v2/movie/in_theaters?start=0&count=3').then((response) => {
    //     console.log(response)
    //   })
    // },
		components: {
			MHeader,
			Tab
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
