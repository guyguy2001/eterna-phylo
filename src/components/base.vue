<template>
  <rect @mousedown.left="mouseDown" @mousedown.right.stop="changeColor" :class="'nuc-' + computedType" width="35" height="35" rx="5" ry="5" style="stroke-width:1;stroke:rgb(0,0,0)" />
</template>

<script>
  export default {
    name: 'hello',
    data() {
      return {
        dragging: false
      }
    },
    props: ['type', 'RY', 'index'],
    computed: {
      computedType() {
        return this.RY ? this.type === 'G' || this.type === 'A' || this.type === 'R' ? 'R' : 'Y' : this.type
      }
    },
    methods: {
      mouseDown(e) {
        this.dragging = true;
        this.$emit('mousedown', e)
      },
      changeColor(e) {
        let newType = 'X';
        switch (this.type) {
          case 'A':
            newType = 'U';
            break;
          case 'U':
            newType = 'G';
            break;
          case 'G':
            newType = 'C';
            break;
          case 'C':
            newType = 'X';
            break;
        }
        this.$emit('changetype', newType);
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
    fill: rgb(255,255,0);
  }

  /*.nuc-A:hover {
    fill: rgb(200,200,0);
  }*/

  .nuc-U {
    fill: #1689cc;
  }

  .nuc-G {
    fill: #ff2828;
  }

  .nuc-C {
    fill: #17a54d;
  }

  .nuc-R {
    fill: #ffa500;
  }
</style>
