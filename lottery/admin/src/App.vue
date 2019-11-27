<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* @import '~@/assets/sass/base.scss'; */
*{
  box-sizing: border-box;
}
html,body{
  margin: 0;
  padding: 0;
  width: 100%;
  background: #f3f4f5;
}
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
