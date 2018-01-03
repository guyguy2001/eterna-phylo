<template>
  <svg :style="{left: gridStartX}" @mousedown.right="spawnNuc" @contextmenu.prevent :width="gridWidth" height="500">
    <drag-line v-show="selectedRow" :y="selectedRowY + 5" />
    <g v-for="(subA, i) in nucs" :key="i">
      <rect v-for="j in arraySize" :x="gridStartX + (j-1)*size + 4" :y="(i)*size + 4" width="27" height="27" rx="5" ry="5" style="fill:#AAAAAA; pointer-events:none;" />
      <nuc v-for="(nuc, j) in subA" @changetype="changeType(i, j, $event)" @mousedown="dragChildStart(i,j, $event)" :type="nuc.type" :x="gridStartX + nuc.x" :y="i * 40" :RY="false" :key="j" />
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
      }
    },
    props: ['grid-width', 'grid-start-x'],
    components: {
      nuc,
      dragLine,
    },
    copmuted: {
      lanes() {
        return this.$store.state.lanes;
      }
    },
    methods: {
      nucs(i) {
        return this.$store.state.lanes[i].nucs;
      },
      score() {
        let data = {
          match: 0,
          mismatch: 0,
          open: 0,
          extend: 0
        };
        if (this.nucs.length <= 1)
          return data;
        console.log(this.nucs(0));
        let prev = this.toArray(this.nucs(0));
        for (let i = 1; i < this.nucs.length; i++) {
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
      changedText(index, e) {
        console.log(e);
        this.nucs[index] = [];

        let text = this.textRows[index] = this.textRows[index].toUpperCase();
        for (let i = 0; i < text.length; i++)
          this.nucs[index].push({ type: text.charAt(i), x: (i + 5) * 40, posIndex: i + 5 });
        this.score();
        this.$store.state.lanes[index].sequence = text;
      },
      updateNames(i) {
        this.$store.state.lanes[i].name = this.names[i];
      },
      uploadToEterna(index) {
        message_broadcast(this, { 'command': 'update-lane', 'id': 0, 'position': this.$store.state.lanes[index].eternaPos, 'sequence': this.$store.state.lanes[index].sequence, 'uid': (new Date).getTime() + Math.random() });
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
