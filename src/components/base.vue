<template>
    <rect @mouseup="mouseUp()" @mousedown="mouseDown()" :class="'nuc-' + computedType" width="35" height="35" rx="5" ry="5" style="stroke-width:1;stroke:rgb(0,0,0)" />
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
    }
  },
  props: ['type', 'RY'],
  computed: {
    computedType () {
      return this.RY ? this.type === 'G' || this.type === 'A' || this.type === 'R' ? 'R' : 'Y' : this.type
    }
  },
  methods: {
    mouseDown () {
      this.$emit('mousedown', this)
    },
    mouseUp () {
      this.$emit('mouseup', this)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  * {
    cursor: pointer;
  }
  .nuc-A {
    fill:rgb(255,255,0);    
  }
  .nuc-A:hover {
    fill:rgb(200,200,0);
  }
  .nuc-R {
    fill:#ffa500;  
  }
</style>
