<template>
  <svg @mousedown.right="spawnNuc" @contextmenu.prevent :width="gridWidth" :height="lanes.length*size + size">
    <drag-line v-show="selectedRow" :y="selectedRowY + 5" />
    <g v-for="(lane, i) in lanes" :key="i">
      <rect v-for="j in arraySize" :x="gridStartX + (j-1)*size + 4" :y="(i)*size + 4" width="27" height="27" rx="5" ry="5" style="fill:#AAAAAA; pointer-events:none;"/>
      <nuc v-for="(nuc, j) in nucs(i)" @changetype="changeType(i, j, $event)"@mousedown="dragChildStart(i,j, $event)" :type="nuc.type" :x="gridStartX + nuc.x" :y="i * 40" :RY="false" :key="j" />
      <foreignObject x="10" :y="i*size + 7" width="90" :height="size">
        <input @input="changedText(i, $event)" v-model="lanes[i].shared.sequence" style="width:90px"/>
      </foreignObject>
      <foreignObject x="110" :y="i*size + 7" width="20" :height="size">
        <input style="width:20px" v-model="lanes[i].shared.name"/>
      </foreignObject>
    </g>
    <text x="10" :y="lanes.length*size + size/2" font-weight="700" font-size="24" style="cursor:pointer" @click="$store.commit('addLane')">+</text>
  </svg>
</template>
<script>
  import nuc from './base'
  import dragLine from './dragLine'
  import { message_broadcast, message_receive } from '../modules/connection'
  import { update } from '../modules/update'

  export default {
    data() {
      return {
        gridStartX: 135,
        currentX: 0,
        size: 35 + 5, //the size of a nuc with spacing
        sizeNS: 35, //the size of a nuc without spacing
        selectedRow: null,
        selectedRowY: 0,
        selectedColumn: -1,
        selectedRowIndex: -1,
        names: new Array(9)
      }
    },
    props: ['grid-width'],
    components: {
      nuc,
      dragLine,
    },
    methods: {
      nucs(i) {
        return this.lanes[i].nucs;
      },
      dragChildStart(i, j, e) {
        this.currentX = (e.clientX - this.gridStartX);
        this.selectedRow = this.nucs(i);
        this.selectedRowIndex = i;
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
        //this.uploadToEterna(this.selectedRowIndex);
        update(this.$store.state);
        let newText = '';
        for (let i = 0; i < this.selectedRow.length; i++)
          newText += this.selectedRow[i].type;
        this.lanes[this.selectedRowIndex].sequence = newText;
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
        this.$store.commit('changeType', {
          lane: this.lanes[i],
          index: j,
          newType,
          laneIndex: i
        });
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
        for (; k < this.nucs(i).length && j > this.nucs(i)[k].posIndex; k++);
        if (k < this.nucs(i).length && this.nucs(i)[k].posIndex == j)
          return;
        k = Math.max(k, 0);
        this.nucs(i).splice(k, 0, { x: j * this.size, type: 'A', posIndex: j });
        let newText = '';
        for (let index = 0; index < this.nucs(i).length; index++)
          newText += this.nucs(i)[index].type;
        this.lanes[i].shared.sequence = newText;
        this.$store.commit('spawnNuc', {
          lane: this.lanes[i],
          index: k,
          posIndex: j
        });

        update(this.$store.state, i);
      },
      changedText(index, e) {
        this.$store.commit('changedText', {
          index: index
        });
      },
      uploadToEterna(index) {
        message_broadcast({
          'command': 'update-lane',
          'id': index,
          'startIndex': this.lanes[index].shared.eternaPos - 1, //The booster uses 0 based indexing, but the users use 1 based indexing
          'newSeq': this.lanes[index].shared.sequence,
          'uid': (new Date).getTime() + Math.random()
        });
      }
    },
    computed: {
      arraySize() {
        return Math.floor((this.gridWidth - this.sizeNS) / this.size) + 1;
        //this.sizeNS
      },
      gridWidthExact() {
        return this.size * this.arraySize + this.sizeNS - this.size;
      },
      lanes() {
        return this.$store.state.lanes;
      }
    },
    mounted() {
      let ms2 = this.lanes[0].shared.sequence = 'ACAUGAGGAUCACCCAUGU';
      for (let i = 0; i < ms2.length; i++)
        this.nucs(0).push({ type: ms2.charAt(i), x: (i+5) * 40, posIndex: i+5 });
      window.addEventListener('mousemove', this.dragChildOngoing);
      window.addEventListener('mouseup', this.dragChildEnd);
    }
  }
</script>
<style scoped>

</style>
