<template>
  <svg width="400" height="110">
    <nuc @mousedown="dragChild" type="A" :RY="false"/>
  </svg>
</template>

<script>
import nuc from './components/base'

export default {
  name: 'app',
  components: {
    nuc
  },
  methods: {
    dragChild (e) {
      console.log(e)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
