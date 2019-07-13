import anime from 'animejs'

const enter = el =>
  new Promise(resolve => {
    anime({
      targets: el,
      duration: 400,
      opacity: [0, 1],
      easing: 'easeInOutSine',
      begin: () => {
        el.style.willChange = 'opacity'
      },
      complete: () => {
        el.style.willChange = ''
        resolve()
      }
    })
  })

const leave = el =>
  new Promise(resolve => {
    anime({
      targets: el,
      duration: 400,
      opacity: [1, 0],
      easing: 'easeInOutSine',
      begin: () => {
        el.style.willChange = 'opacity'
      },
      complete: () => {
        el.style.willChange = ''
        resolve()
      }
    })
  })

export default { enter, leave }
