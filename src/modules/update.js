import { score } from './score'
import { message_broadcast } from './connection'

export function update(state, laneIndex) {
  state.scoreData = score(state.lanes);
  if (laneIndex && state.lanes[laneIndex].shared.eternaPos !== 0) {

    message_broadcast({
      'command': 'update-lane',
      'id': laneIndex,
      'startIndex': state.lanes[laneIndex].shared.eternaPos - 1, //The booster uses 0 based indexing, but the users use 1 based indexing
      'newSeq': state.lanes[laneIndex].shared.reversed ? state.lanes[laneIndex].shared.sequence.split('').reverse().join('') :
                                                         state.lanes[laneIndex].shared.sequence,
      'uid': (new Date).getTime() + Math.random(),
      oldLength: state.lanes[laneIndex].shared.oldLength
    });
    console.log(laneIndex);
    console.log(state.lanes);
    state.lanes[laneIndex].shared.oldLength = state.lanes[laneIndex].shared.sequence;

  }
}
