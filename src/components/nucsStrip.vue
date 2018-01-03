<template>
  <g v-for="i in 1">
    <rect v-for="j in arraySize" :x="gridStartX + (j-1)*size + 4" :y="(i)*size + 4" width="27" height="27" rx="5" ry="5" style="fill:#AAAAAA; pointer-events:none;" />
    <nuc v-for="(nuc, j) in nucs" @changetype="changeType(i, j, $event)" @mousedown="dragChildStart(i,j, $event)" :type="nuc.type" :x="gridStartX + nuc.x" :y="i * 40" :RY="false" :key="j" />
  </g>
</template>

<script>

  export default {
    data() {
      return {

      }
    },
    props: ['grid-width', 'grid-start-x', 'lane'],
    computed: {
      nucs() {
        return this.lane.nucs;
      }
    },
    methods : {
      dragChildStart(i, j, e) {
        this.currentX = (e.clientX - this.gridStartX);
        this.selectedRow = this.nucs();
        this.selectedColumn = j;
        this.selectedRowY = i * this.size;

      },
      dragChildOngoing(e) {
        if (this.selectedColumn == -1)
          return;
        let index = this.selectedColumn;
        let dx = (e.clientX - this.gridStartX) - this.currentX;
        let newX = this.selectedRow[this.selectedColumn].x + dx;
        this.currentX += dx;
        this.changePos(this.selectedColumn, newX);
      },
      changePos(index, x) {
        if (index === 0 && x < 0)
          return this.selectedRow[index].x = 0;
        if (index === this.selectedRow.length - 1 && x + this.sizeNS > this.gridWidthExact)//////////////////  
          return this.selectedRow[index].x = this.arraySize * this.size - this.sizeNS;
        if (this.selectedRow.length > index + 1) {
          if (x + this.size > this.selectedRow[index + 1].x)
            x = this.changePos(index + 1, x + this.size) - this.size;
        }
        if (index > 0) {
          if (x < this.selectedRow[index - 1].x + this.size)
            x = this.changePos(index - 1, x - this.size) + this.size;
        }
        return this.selectedRow[index].x = x;
      },
      dragChildEnd(e) {
        if (this.selectedColumn === -1) return;
        for (let index = this.selectedColumn; index < this.selectedRow.length && this.snap(this.selectedRow[index]); index++);
        for (let index = this.selectedColumn - 1; index >= 0 && this.snap(this.selectedRow[index]); index--);
        this.score();
        let newText = '';
        for (let i = 0; i < this.selectedRow.length; i++)
          newText += this.selectedRow[i].type;
        this.textRows[this.nucs.indexOf(this.selectedRow)] = newText;
        this.selectedColumn = -1;
        this.selectedRow = null;
      },
      snap(nuc) {
        if (nuc.posIndex == nuc.x * this.size) {
          return false;
        }
        else {
          nuc.posIndex = Math.round(nuc.x / this.size);
          nuc.x = nuc.posIndex * this.size;
          return true;
        }
      },
      toArray(arr) {
        let res = [];
        for (let i = 0, j = 0; i < arr.length; i++ , j++) {
          for (; j < arr[i].posIndex; j++)
            res.push('X');
          res.push(arr[i].type);
        }
        return res;
      },
      changeType(i, j, newType) {
        if (newType === 'X')
          this.nucs().splice(j, 1);
        else
          this.$set(this.nucs()[j], 'type', newType);
        let newText = '';
        for (let index = 0; index < this.nucs().length; index++)
          newText += this.nucs()[index].type;
        this.textRows[i] = newText;
        this.score();
      },
      spawnNuc(evt) {

        let e = evt.target;
        let dim = e.getBoundingClientRect();
        let x = evt.clientX - this.gridStartX - dim.left;
        if (x < 0) return;
        let y = evt.clientY - dim.top;
        let i = Math.floor(y / this.size);
        let j = Math.floor(x / this.size);
        let k = 0;
        for (; k < this.nucs().length && j > this.nucs()[k].posIndex; k++);
        if (k < this.nucs().length && this.nucs()[k].posIndex == j)
          return;
        k = Math.max(k, 0);
        this.nucs().splice(k, 0, { x: j * this.size, type: 'A', posIndex: j });
        let newText = '';
        for (let index = 0; index < this.nucs().length; index++)
          newText += this.nucs()[index].type;
        this.textRows[i] = newText;
        this.score();
      },

    },
    mounted() {
      window.addEventListener('mousemove', this.dragChildOngoing);
      window.addEventListener('mouseup', this.dragChildEnd);
    }

  }
</script>

<style scoped>

</style>
