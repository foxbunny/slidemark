/** @jsx duckweed.html
 * (c) 2017, Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const duckweed = require('duckweed')

const E = duckweed.events

const LEFT = 'l'
const RIGHT = 'r'


// MODEL


const init = slides => ({
  currentSlide: 0,
  slides,
  direction: RIGHT,
  presenterMode: false,
})


// ACTIONS

const actions = {
  toSlide: (patch, index) => {
    if (index == null) {
      return
    }
    patch(model =>
      index < 0 || index >= model.slides.length
        ? model
        : {...model, currentSlide: index, direction: model.currentSlide > index ? LEFT : RIGHT })
  },
  togglePresenterMode: patch =>
    patch(model => ({...model, presenterMode: !model.presenterMode})),
}


// VIEW


const KEYS = {
  backsp: 8,
  enter: 13,
  esc: 27,
  lArrow: 37,
  rArrow: 39,
  space: 32,
}


const keyEvent = currentSlide => e => {
  switch (e.keyCode) {
    // To next slide
    case KEYS.space:
    case KEYS.rArrow:
      e.preventDefault()
      return ['toSlide', currentSlide + 1]

    // To previous slide
    case KEYS.backsp:
    case KEYS.lArrow:
      e.preventDefault()
      return ['toSlide', currentSlide - 1]

    // Go to first slide
    case KEYS.esc:
      e.preventDefault()
      return ['toSlide', 0]

    // Toggle presenter/audience
    case KEYS.enter:
      e.preventDefault()
      return ['togglePresenterMode']

    // Ignore
    default:
      return []
  }
}

const transition = direction =>
  Object.assign(
    {
      transition: 'transform 0.7s',
      delayed: {
        opacity: 1,
        transform: 'translateX(0)',
      },
    },
    direction === RIGHT
      ? {
          transform: 'translateX(100vw)',
          opacity: 0.5,
          remove: {
            opacity: 0.5,
            transform: 'translateX(-100vw)',
          },
        }
      : {
        transform: 'translateX(-100vw)',
        opacity: 0.5,
        remove: {
          opacity: 0.5,
          transform: 'translateX(100vw)',
        },
      }
  )

const view = css => ({model, act}) => (current =>
  <div class={{[css.presenterMode]: model.presenterMode}}>
    {model.presenterMode
      ? <div
        class={css.progress}
        style={{width: `${(model.currentSlide + 1) / model.slides.length * 100}%`}}
        />
      : undefined}
    <div
      class={{
        [css.slide]: true,
        [css.slide_presenterMode]: model.presenterMode,
        [css.titleSlide]: model.currentSlide === 0,
      }}
      key={`slide-${model.currentSlide}`}
      doc-keydown={E.from(keyEvent(model.currentSlide), (...args) => act(...args)())}
      on-click={act('toSlide', model.currentSlide + 1)}
      style={model.presenterMode
        ? {}
        : transition(model.direction)
      }
    >
      <div
        class={{
          [css.slideContents]: true,
          [css.slideContents_presenterMode]: model.presenterMode,
          [css.slideContents_short]: current.lines === 1,
          [css.slideContents_shortish]: current.lines < 4,
          [css.slideContents_medium]: current.lines < 10,
        }}
        innerHTML={current.slide}
        />
    </div>
    <div
      key={`note-${model.currentSlide}`}
      class={{[css.notes]: true, [css.notes_presenterMode]: model.presenterMode}}
    >
      <div
        class={{[css.nodeContents]: true, [css.noteContents_presenterMode]: model.presenterMode}}
        innerHTML={current.notes}
        />
    </div>
  </div>
)(model.slides[model.currentSlide])


module.exports = {
  init,
  actions,
  view,
}
