<template>
  <div>
    <b>Name:</b> The name of the lane.<br/>
    <b>Position:</b> The starting position of the lane in Eterna. A position of <b>0</b> is an oligo.
    <table>
      <tr>
        <th>Name</th>
        <th>Position</th>
        <th>Link</th>
        <th>Reversed</th>
      </tr>
      <tr v-for="(lane, i) in lanes">
        <td>
          <b>{{lane.shared.name}}</b>
        </td>
        <td>
          <input v-model="lane.shared.eternaPos" />
        </td>
        <td>
          <input type="button" value="Link" :class="{selectedLink : selectedForLink == i}" @click="linkLanes(i)"/>
        </td>
        <td>
          <input type="checkbox" v-model="lane.shared.reversed" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        selectedForLink: -1
        //lanes: 5,
      }
    },
    methods: {
      linkLanes(i) {
        console.log(this.selectedForLink);

        if (this.selectedForLink === -1) {
          this.selectedForLink = i;
        }
        else {
          if (this.$store.state.lanes[i].shared.links.indexOf(this.$store.state.lanes[this.selectedForLink]) === -1) {
            let aLinks = this.$store.state.lanes[i].shared.links;
            let bLinks = this.$store.state.lanes[this.selectedForLink].shared.links;
            let shared = this.$store.state.lanes[i].shared = this.$store.state.lanes[this.selectedForLink].shared;
            shared.links = [];
            for (let i in aLinks) {
              shared.links.push(aLinks[i]);
            }
            for (let i in bLinks) {
              shared.links.push(bLinks[i]);
            }
            for (let i in aLinks) {
              updateASingleLane(shared.sequence, aLinks[i]);
            }
          }
          this.selectedForLink = -1;
        }
        function updateASingleLane(text, lane) {
          lane.nucs = [];
          for (let i = 0; i < text.length; i++)
            lane.nucs.push({ type: text.charAt(i), x: (i + 5) * 40, posIndex: i + 5 });
          console.log(lane.nucs);
          lane.shared.sequence = text;
        }
      }
    },
    computed: {
      lanes() { return this.$store.state.lanes },
    },//lanes[i] = {name, eternaPos, eternaDirection?, sequence}
  }
</script>

<style scoped>
  table, tr, td, th{
    border: 1px solid black;
  }
  input.selectedLink{
    border-style: dashed;
  }
</style>
