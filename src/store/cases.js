export default {
  state: {
    cases: { main: [], black: [] }
  },
  getters: {
    mainCases: state => state.cases.main,
    blackCases: state => state.cases.black
  },
  mutations: {
    setMainCases: (state, payload) => {
      state.cases.main = [...payload]
    },
    setBlackCases: (state, payload) => {
      state.cases.black = [...payload]
    }
  },
  actions: {
    setCases({ commit }, { black, cases }) {
      if (black) {
        commit('setBlackCases', cases)
      } else {
        commit('setMainCases', cases)
      }
    }
  }
}
