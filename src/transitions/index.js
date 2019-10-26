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
    ...Fade
  },
  cases: {
    ...Case
  },
  about: {
    ...Fade
  },
  vision: {
    ...Fade
  },
  inspire: {
    ...Fade
  }
}

export default transitions
