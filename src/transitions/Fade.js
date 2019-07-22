import anime from 'animejs'

const enter = el =>
  new Promise(resolve => {
    anime({
      targets: el,
      duration: 600,
      opacity: [0, 1],
      // easing: 'easeOutSine',
      easing: 'cubicBezier(.25,.01,.25,1)',
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
      // easing: 'easeInOutSine',
      easing: 'cubicBezier(.25,.01,.25,1)',
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
