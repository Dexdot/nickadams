import anime from 'animejs'

const enter = el =>
  new Promise(resolve => {
    anime({
      targets: el.querySelectorAll('.case li'),
      duration: 800,
      delay: anime.stagger(50),
      opacity: [0, 1],
      translateY: ['-30%', '0%'],
      easing: 'easeInOutSine',
      complete: resolve
    })
  })

const leave = el =>
  new Promise(resolve => {
    anime({
      targets: el.querySelectorAll('.case li'),
      duration: 800,
      delay: anime.stagger(50),
      opacity: [1, 0],
      translateY: ['0%', '-30%'],
      easing: 'easeInOutSine',
      complete: resolve
    })
  })

export default { enter, leave }
