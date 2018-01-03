<template>
  <div>
    <div v-for="(lane, i) in lanes"></div>
    <input @change="uploadToEterna(i)" @input="changedText(i, $event)" v-model="textRows[i]" style="width:90px" />
    <input style="width:25px" v-model="names[i]" @input="updateNames(i)" />
    <grid :grid-width="width - 145" :grid-start-x="145" @update="updateScoreData"></grid>
  </div>
</template>
<script>
  import grid from './Grid'

  export default {
    data() {
      return {
        textRows: new Array(9),
        names: new Array(9),
        width: window.innerWidth,
      }
    }
  }

</script>
<style scoped>
</style>
