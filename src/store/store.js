import Vue from 'vue';
import Vuex from 'vuex';
import { update } from '../modules/update'

Vue.use(Vuex);

const size = 40; //BAD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
let state = {
  lanes: [],
  score: 0,
  scoreData: {}
};
const mutations = {
  changeType(state, payload) {
    let _lane = payload.lane, index = payload.index, newType = payload.newType;
    console.log(_lane.shared.links);
    for (let i in _lane.shared.links) {
      console.log('for');
      let lane = _lane.shared.links[i];
      if (newType === 'X')
        lane.nucs.splice(index, 1);
      else
        Vue.set(lane.nucs[index], 'type', newType);
    }
    let newText = '';
    for (let index = 0; index < _lane.nucs.length; index++)
      newText += _lane.nucs[index].type;
    Vue.set(_lane.shared, 'sequence', newText);
    update(state, payload.laneIndex);
  },
  spawnNuc(state, payload) {
    let _lane = payload.lane, index = payload.index, originalPosIndex = payload.posIndex;
    for (let i in _lane.shared.links) {
      let lane = _lane.shared.links[i];
      if (lane === _lane)
        continue;
      let posIndex;
      if (lane.nucs.length > 0)
        if (lane.nucs.length > index)
          posIndex = Math.max(0, lane.nucs[index].posIndex - 1);
        else
          posIndex = lane.nucs[index - 1].posIndex + 1; //TODO Math.min
      else
        posIndex = originalPosIndex;
      lane.nucs.splice(index, 0, { x: posIndex  * size, type: 'A', posIndex: posIndex });
    }
  },
  addLane(state) {
    let lane = { shared: { previousLength: 0, index: state.lanes.length, name: state.lanes.length, eternaPos: 0, links: [], sequence: '' }, nucs: [] };
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
