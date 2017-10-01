/**
 * (c) 2017, Hajime Yamasaki Vukelic
 * All rights reserved.
 */


const SLIDEMARK_KEY = 'SLIDEMARK_TABSYNC'


const tabStorage = (() => ({
  get: () => parseInt(localStorage.getItem(SLIDEMARK_KEY), 10),
  set: slide => localStorage.setItem(SLIDEMARK_KEY, '' + slide),
}))()


const plugin = {
  actions: {
    syncTab: (patch, slide) =>
      patch(model => model.currentSlide === slide
        ? model
        : {...model, currentSlide: slide}),
  },
  init: act =>
    window.addEventListener('storage', () => act('syncTab', tabStorage.get())()),
}


const middleware = patch => model => {
  const before = model.currentSlide
  const patched = patch(model)
  if (before !== patched.currentSlide) {
    // Update storage async so it doesn't interfere with current action
    setTimeout(() => tabStorage.set(patched.currentSlide))
  }
  return patched
}


module.exports = {
  plugin,
  middleware,
}
