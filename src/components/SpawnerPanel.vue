<template>
  <div style="padding: 10px;margin: 10px; border: 1px solid black;">
    <select name="Oligos" v-model="oligoText">
      <option value="GUCGGACAAGGACGUAGACA">A</option>
      <option value="GUUUGGUAGGUAGUGGUACC">B</option>
      <option value="GGUGGACAGAGAGAUACAUG">C</option>
      <option value="CAGUCUUGAAUCAG">R</option>
    </select>
    Reversed: <input type="checkbox" v-model="reversed"/>
    <input type="text" readonly="readonly" :value="text"/>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        oligoText: '',
        reversed: false
      }
    },
    computed: {
      text() {
        return this.reversed ? this.oligoText.split('').reverse().join('') : this.oligoText;
      }
    }
  }
</script>

<style>

</style>
