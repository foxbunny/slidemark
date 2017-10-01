/**
 * (c) 2017, Hajime Yamasaki Vukelic
 * All rights reserved.
 */

require('./index.styl')

const duckweed = require('duckweed')

const slideshow = require('./slideshow')
const syncTabs = require('./sync-tabs')


const init = (slides, theme) =>
  duckweed.runner(
    slideshow.init(slides),
    slideshow.actions,
    slideshow.view(theme),
    {middleware: [syncTabs.middleware], plugins: [syncTabs.plugin]}
  )


module.exports = init
