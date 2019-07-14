import anime from 'animejs'

const enter = el =>
  new Promise(resolve => {
    anime({
      targets: el,
      duration: 600,
      opacity: [0, 1],
      easing: 'easeOutSine',
      begin: () => {
        el.style.willChange = 'opacity'
      },
      complete: () => {
        el.style.willChange = ''
        // resolve()
      },
      update: ({ progress }) => {
        if (progress >= 60) resolve()
      }
    })
  })

const leave = el =>
  new Promise(resolve => {
    anime({
      targets: el,
      duration: 600,
      opacity: [1, 0],
      easing: 'easeInOutSine',
      begin: () => {
        el.style.willChange = 'opacity'
      },
      complete: () => {
        el.style.willChange = ''
        // resolve()
      },
      update: ({ progress }) => {
        if (progress >= 60) resolve()
      }
    })
  })

export default { enter, leave }
