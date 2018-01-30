<template>
  <svg @mousedown.right="spawnNuc" @contextmenu.prevent :width="gridWidth + gridStartX" height="500">
    <drag-line v-show="selectedRow" :y="selectedRowY + 5" />
    <g v-for="(lane, i) in $store.state.lanes" :key="i">
      <rect v-for="j in arraySize" :x="gridStartX + (j-1)*size + 4" :y="(i)*size + 4" width="27" height="27" rx="5" ry="5" style="fill:#AAAAAA; pointer-events:none;"/>
      <nuc v-for="(nuc, j) in lane.nucs" @changetype="changeType(i, j, $event)"@mousedown="dragChildStart(i,j, $event)" :type="nuc.type" :x="gridStartX + nuc.x" :y="i * 40" :RY="false" :key="j" />
      <foreignObject x="10" :y="i*size + 7" width="90" :height="size">
        <input @input="changedText(i, $event)" v-model="textRows[i]" style="width:90px"/>
      </foreignObject>
      <foreignObject x="110" :y="i*size + 7" width="10" :height="size">
        <input style="width:10px" v-model="$store.state.lanes[i].name" @input="updateNames(i)"/>
      </foreignObject>
    </g>
  </svg>
</template>
<script>
  import nuc from './base'
  import dragLine from './dragLine'
  import { message_broadcast, message_receive } from '../modules/connection'

  export default {
    data() {
      return {
        currentX: 0,
        size: 35 + 5, //the size of a nuc with spacing
        sizeNS: 35, //the size of a nuc without spacing
        selectedRow: null,
        selectedRowY: 0,
        selectedColumn: -1,
        selectedRowIndex: -1,
        textRows: new Array(9),
        names: new Array(9)
      }
    },
    props: ['grid-width', 'grid-start-x'],
    components: {
      nuc,
      dragLine,
    },
    methods: {
      nucs(i) {
        return this.$store.state.lanes[i].nucs;
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
        this.score();
        let newText = '';
        for (let i = 0; i < this.selectedRow.length; i++)
          newText += this.selectedRow[i].type;
        this.textRows[this.selectedRowIndex] = newText;
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
      score() {
        let data = {
          match: 0,
          mismatch: 0,
          open: 0,
          extend: 0
        };
        if (this.$store.state.lanes.length <= 1)
          return data;
        console.log(this.nucs(0));
        let prev = this.toArray(this.nucs(0));
        for (let i = 1; i < this.$store.state.lanes.length; i++) {
          let curr = this.toArray(this.nucs(i));
          let pairData = this.scorePair(prev, curr);
          data.match += pairData.match;
          data.mismatch += pairData.mismatch;
          data.open += pairData.open;
          data.extend += pairData.extend;
          prev = curr;
        }
        this.$emit('update', data);
      },
      scorePair(a, b) {
        var score = 0;
        function toRY(a) {
          return a === 'G' || a === 'A' || a === 'R' ? 'R' : 'Y';
        }
        function tabulate(a) {
          var weight = {
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
        let data = {
          match: 0,
          mismatch: 0,
          open: 0,
          extend: 0
        };
        let firstA = -1, firstB = -1;
        for (let i = 0; i < a.length; i++)
          if (a[i] !== 'X') {
            firstA = i;
            break;
          }
        for (let i = 0; i < b.length; i++)
          if (b[i] !== 'X') {
            firstB = i;
            break;
          }
        for (let i = a.length - 1; i >= 0 && a[i] == 'X'; i++)
          a.pop();
        for (let i = b.length - 1; i >= 0 && b[i] == 'X'; i++)
          b.pop();
        for (let i = 0; i < Math.min(a.length, b.length); i++) {
          console.log(i + " " + a[i] + " " + b[i]);

          if (a[i] === 'X')
            if (b[i] === 'X')
              continue;
            else if (firstA > i)
              continue;
            else if (i === 0 || a[i - 1] !== 'X')
              data.open++;
            else
              data.extend++;
          else
            if (b[i] === 'X')
              if (firstB > i)
                continue;
              else if (i === 0 || b[i - 1] !== 'X')
                data.open++;
              else
                data.extend++;
            else if (toRY(a[i]) === toRY(b[i]))
              data.mismatch++;
            else
              data.match++;
        }
        return data;
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
          this.nucs(i).splice(j, 1);
        else
          this.$set(this.nucs(i)[j], 'type', newType);
        let newText = '';
        for (let index = 0; index < this.nucs(i).length; index++)
          newText += this.nucs(i)[index].type;
        this.textRows[i] = newText;
        this.uploadToEterna(i, newText.length);
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
        for (; k < this.nucs(i).length && j > this.nucs(i)[k].posIndex; k++);
        if (k < this.nucs(i).length && this.nucs(i)[k].posIndex == j)
          return;
        k = Math.max(k, 0);
        this.nucs(i).splice(k, 0, { x: j * this.size, type: 'A', posIndex: j });
        let newText = '';
        for (let index = 0; index < this.nucs(i).length; index++)
          newText += this.nucs(i)[index].type;
        this.textRows[i] = newText;
        this.uploadToEterna(i, newText.length - 1);
        this.score();
      },
      changedText(index, e) {
        console.log(e);
        this.$store.state.lanes[index].nucs = [];
        let text = this.textRows[index] = this.textRows[index].toUpperCase();
        for (let i = 0; i < text.length; i++)
          this.nucs(index).push({ type: text.charAt(i), x: (i + 5) * 40, posIndex: i + 5 });
        this.$store.state.lanes[index].sequence = text;
        this.uploadToEterna(index, text.length - 1); // TODO: CHANGE IF THE EVENT IS CHANGED TO ON ENTER!!!!!!!!!!!!!!!!!!
        this.score();
      },
      updateNames(i) {
        this.$store.state.lanes[i].name = this.names[i];
      },
      uploadToEterna(index, oldLength) {
        message_broadcast({
          'command': 'update-lane',
          'id': index,
          'startIndex': this.$store.state.lanes[index].eternaPos,
          'newSeq': this.$store.state.lanes[index].sequence,
           oldLength,
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
      }
    },
    mounted() {
      let ms2 = this.textRows[0] = 'ACAUGAGGAUCACCCAUGU';
      for (let i = 0; i < ms2.length; i++)
        this.nucs(0).push({ type: ms2.charAt(i), x: (i+5) * 40, posIndex: i+5 });
      window.addEventListener('mousemove', this.dragChildOngoing);
      window.addEventListener('mouseup', this.dragChildEnd);
    }
  }
</script>
<style scoped>

</style>
