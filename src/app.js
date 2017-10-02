/**
 * (c) 2017, Hajime Yamasaki Vukelic
 * All rights reserved.
 */

require('./index.styl')

const duckweed = require('duckweed')

const slideshow = require('./slideshow')
const syncTabs = require('./sync-tabs')


const init = (slides, theme, mode = false) =>
  duckweed.runner(
    slideshow.init(slides, mode),
    slideshow.actions,
    slideshow.view(theme),
    {middleware: [syncTabs.middleware], plugins: [syncTabs.plugin]}
  )


module.exports = init
