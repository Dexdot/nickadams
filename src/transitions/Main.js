import anime from 'animejs'

const enter = el =>
  new Promise(resolve => {
    anime({
      targets: el.querySelectorAll('.case li'),
      duration: 900,
      delay: anime.stagger(50),
      opacity: [0, 1],
      translateY: ['50%', '0%'],
      easing: 'easeOutQuint',
      // begin: resolve
      update: ({ progress }) => {
        if (progress >= 80) resolve()
      }
    })
  })

const leave = el =>
  new Promise(resolve => {
    anime({
      targets: [el.querySelector('.next'), el.querySelector('h1')],
      duration: 700,
      opacity: 0,
      easing: 'easeOutCirc'
    })

    anime({
      targets: el.querySelectorAll('.case li'),
      duration: 800,
      delay: anime.stagger(50),
      opacity: [1, 0],
      scale: [1, 0.96],
      translateY: ['0%', '-100%'],
      easing: 'easeInOutCirc',
      // begin: resolve
      update: ({ progress }) => {
        if (progress >= 80) resolve()
      }
    })
  })

export default { enter, leave }
