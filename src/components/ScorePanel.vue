<template>
  <div>
    <h1>Score: {{score}} <!--&nbsp; Best: {{bestScore}}--></h1>
    <br />
    matches: {{current.match}} &nbsp;&nbsp;&nbsp; mismatches: {{current.mismatch}} &nbsp;&nbsp;&nbsp; opens: {{current.open}} &nbsp;&nbsp;&nbsp; extends: {{current.extend}}
  </div>
</template>

<script>
  export default {
    props: ['current'],
    data() {
      return {
        best: {
          match: 0,
          mismatch: 0,
          open: 0,
          extend: 0
        }
      }
    },
    computed: {
      score() {
        return this.tabulate(this.current);
      },
      bestScore() {
        return this.tabulate(this.best)
      }
    },
    methods: {
      tabulate(a) {
        let weight = {
          match: 1,
          mismatch: -1,
          open: -4,
          extend: -1
        };
        return (a.match * weight.match +
          a.mismatch * weight.mismatch +
          a.open * weight.open +
          a.extend * weight.extend);
      }
    },
    mounted() {
      this.$store.subscribe((mutation, state) => {
        console.log(mutation.type)
        console.log(mutation.payload)
      });
    }
  }
</script>

<style>

</style>
