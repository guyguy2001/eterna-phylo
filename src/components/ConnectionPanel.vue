<template>
  <div>
    <table>
      <tr>
        <th>Name</th>
        <th>Position</th>
      </tr>
      <tr v-for="(lane, i) in lanes">
        <td>
          <b>{{lane.name}}</b>
        </td>
        <td>
          <input v-model="lane.eternaPos" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //lanes: 5,
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
</style>
