/**
 * (c) 2017, Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const jsdom = require('jsdom')
const Remarkable = require('remarkable')
const loaderUtils = require('loader-utils')


const asHTML = source => {
  const parser = new Remarkable()
  const html = parser.render(source)
  const dom = jsdom.JSDOM.fragment(`<div>${html}</div>`)
  ;[].forEach.call(dom.querySelectorAll('img'), img => {
    img.src = `{END_STR}require('${loaderUtils.urlToRequest(img.src)}'){START_STR}`
  })
  return JSON.stringify(dom.firstElementChild.innerHTML)
    .replace(/\{END_STR\}/g, '" + ')
    .replace(/\{START_STR\}/g, '+ "')
}


const asSimpleHTML = source => {
  return JSON.stringify(new Remarkable().render(source))
}


const parseSlide = source => {
  const [slide, notes] = source.split('~~~~')
  return `
  module.exports = {
    slide: ${asHTML(slide)},
    notes: ${asSimpleHTML(notes)},
    words: ${slide.trim().split(/\s+/).length},
    lines: ${slide.trim().split('\n').length}
  };
  `
}


module.exports = parseSlide
