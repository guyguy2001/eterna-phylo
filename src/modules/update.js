import { score } from './score'
export function update(state, laneIndex) {
  state.scoreData = score(state.lanes);
  if (laneIndex) {
  }
}
