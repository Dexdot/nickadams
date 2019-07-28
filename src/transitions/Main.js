import anime from 'animejs'

const enter = el =>
  new Promise(resolve => {
    const items = el.querySelectorAll('.case li')
    anime({
      targets: items,
      duration: 900,
      delay: anime.stagger(50),
      opacity: [0, 1],
      translateY: ['50%', '0%'],
      easing: 'cubicBezier(.25,.01,.25,1)',
      begin: () => {
        anime.set(items, {
          willChange: 'transform, opacity'
        })
      },
      update: ({ progress }) => {
        if (progress >= 80) {
          anime.set(items, {
            willChange: ''
          })
          resolve()
        }
      }
    })
  })

const leave = el =>
  new Promise(resolve => {
    const items = el.querySelectorAll('.case li')

    anime({
      targets: [el.querySelector('.next'), el.querySelector('h1')],
      duration: 700,
      opacity: 0,
      easing: 'cubicBezier(.25,.01,.25,1)'
    })

    anime({
      targets: items,
      duration: 800,
      delay: anime.stagger(50),
      opacity: [1, 0],
      scale: [1, 0.96],
      translateY: ['0%', '-100%'],
      easing: 'easeInOutCirc',
      begin: () => {
        anime.set(items, {
          willChange: 'transform, opacity'
        })
      },
      update: ({ progress }) => {
        if (progress >= 80) {
          anime.set(items, {
            willChange: ''
          })
          resolve()
        }
      }
    })
  })

export default { enter, leave }
