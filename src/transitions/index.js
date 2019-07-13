import Cover from './Cover'
import Main from './Main'
import Fade from './Case'

const transitions = {
  cover: {
    ...Cover
  },
  main: {
    ...Main,
    isDark: false
  },
  black: {
    ...Main,
    isDark: true
  },
  case: {
    ...Fade,
    isDark: false
  },
  about: {
    ...Fade,
    isDark: true
  },
  vision: {
    ...Fade,
    isDark: true
  }
}

export default transitions
