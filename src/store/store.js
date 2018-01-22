import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let state = {
  lanes: [],

};
for (let i = 0; i < 7; i++)
  state.lanes.push({ name: i, eternaPos: 1, nucs: [] });
export const store = new Vuex.Store({
    state,
});
