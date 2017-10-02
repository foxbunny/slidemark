/**
 * (c) 2017, Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const init = require('./app')
const defaultTheme = require('./default-theme.styl')

const content = require('content')

init(content.slides, content.theme || defaultTheme, content.presenter)
