<template>
  <div>
    <table style="border: 1px solid black;">
      <tr v-for="(lane, i) in lanes">
        <td>
          {{lane.name}}
        </td>
        <td>

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

<style>

</style>
