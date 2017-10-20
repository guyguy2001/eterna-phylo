<template>
  <div>
    <div>
      <grid :grid-width="width-120" :grid-start-x="120" @update="updateScoreData"></grid>
    </div>
    <score-panel :current="scoreData"></score-panel>
  </div>
</template>

<script>
  import grid from './components/Grid'
  import scorePanel from './components/ScorePanel'
  export default {
    name: 'app',
    components: {
      grid,
      scorePanel
    },
    data() {
      return {
        scoreData: {
          match: 0, mismatch: 0, open: 0, extend: 0
        },
        width: window.innerWidth,
      }
    },
    methods: {
      updateScoreData(data) {
        this.scoreData = data;
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
