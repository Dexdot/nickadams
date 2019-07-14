import Cover from './Cover'
import Main from './Main'
import Fade from './Case'

const transitions = {
  cover: {
    ...Cover
  },
  main: {
    ...Main
  },
  black: {
    ...Main
  },
  case: {
    ...Fade
  },
  about: {
    ...Fade
  },
  vision: {
    ...Fade
  }
}

export default transitions
