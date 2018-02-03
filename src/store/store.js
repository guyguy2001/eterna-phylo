import Vue from 'vue';
import Vuex from 'vuex';
import { update } from '../modules/update'

Vue.use(Vuex);

let state = {
  lanes: [],
  score: 0,
  scoreData: {}
};
const mutations = {
  addLane(state) {
    let lane = { shared: { index: state.lanes.length, name: state.lanes.length, eternaPos: 0, links: [], sequence: '' }, nucs: [] };
    state.lanes.push(lane);
    lane.shared.links.push(lane);
  },
  changedText(state, payload) {
    let index = payload.index;
    let originalLane = state.lanes[index];
    let text = originalLane.shared.sequence = originalLane.shared.sequence.toUpperCase();
    for (let i in originalLane.shared.links) {

      changeForSingleLane(text, originalLane.shared.links[i]);
    }
    update(state, index);
    function changeForSingleLane(text, lane) {
      lane.nucs = [];
      for (let i = 0; i < text.length; i++)
        lane.nucs.push({ type: text.charAt(i), x: (i + 5) * 40, posIndex: i + 5 });
      console.log(lane.nucs);
      lane.shared.sequence = text;
    }
  }
}



for (let i = 0; i < 7; i++)
  mutations.addLane(state);
export const store = new Vuex.Store({
  state,
  mutations
});
