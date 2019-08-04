import Main from './Main'
import Fade from './Fade'
import Case from './Case'

const transitions = {
  main: {
    ...Main
  },
  black: {
    ...Main
  },
  case: {
    ...Case
  },
  about: {
    ...Fade
  },
  vision: {
    ...Fade
  }
}

export default transitions
