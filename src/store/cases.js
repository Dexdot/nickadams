export default {
  state: {
    // BLACK_ID: '211zl80RZxQhtGrawZYmSE',
    // MAIN_ID: '1XHOEik80zQ2MY8aHdrKFd',
    // SPACE_ID: 'gwqnjet7ukqq',
    // ACCESS_TOKEN:
    //   'b47a19fd395378fb5e76b2020fb91a0455d2b5ed7d4b9df29101e2e76fd00cc1',
    cases: { main: [], black: [] }
  },
  getters: {
    // space: state => state.SPACE_ID,
    // accessToken: state => state.ACCESS_TOKEN,
    // BLACK_ID: state => state.BLACK_ID,
    // MAIN_ID: state => state.MAIN_ID,
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
