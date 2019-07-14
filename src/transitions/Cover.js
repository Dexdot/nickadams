import anime from 'animejs'

const enter = el =>
  new Promise(resolve => {
    anime({
      targets: el,
      duration: 800,
      // opacity: [0, 1],
      easing: 'easeInOutCirc',
      translateY: ['101%', '0%'],
      begin: () => {
        el.style.willChange = 'transform'
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
      duration: 800,
      translateY: ['0%', '-101%'],
      // translateX: ['0%', '-101%'],
      easing: 'easeInOutCirc',
      begin: () => {
        el.style.willChange = 'transform'
      },
      complete: () => {
        el.style.willChange = ''
        resolve()
      }
    })
  })

export default { enter, leave }
