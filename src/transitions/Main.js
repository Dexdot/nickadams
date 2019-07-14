import anime from 'animejs'

const enter = el =>
  new Promise(resolve => {
    anime({
      targets: el.querySelectorAll('.case li'),
      duration: 800,
      delay: anime.stagger(50),
      opacity: [0, 1],
      translateY: ['30%', '0%'],
      easing: 'easeInOutSine',
      // complete: resolve,
      begin: () => {
        console.log('main enter begin')
      },
      update: ({ progress }) => {
        if (progress >= 60) resolve()
      }
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
      // complete: resolve,
      update: ({ progress }) => {
        if (progress >= 60) resolve()
      }
    })
  })

export default { enter, leave }
