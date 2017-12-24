import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        lanes: [{ name: 'A', eternaPos: 1 }, { name: 'A', eternaPos: 1 }, { name: 'A', eternaPos: 1 }]
    }
});