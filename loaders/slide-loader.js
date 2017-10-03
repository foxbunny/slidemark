/**
 * (c) 2017, Hajime Yamasaki Vukelic
 * All rights reserved.
 */

const hljs = require('highlight.js')
const jsdom = require('jsdom')
const Remarkable = require('remarkable')
const loaderUtils = require('loader-utils')


const asHTML = source => {
  const parser = new Remarkable('full', {
    html: true,
    highlight: (str, lang) => {
      try {
        return (lang && hljs.getLanguage(lang)
          ? hljs.highlight(lang, str)
          : hljs.highlightAuto(str)).value
      } catch (e) {
        return ''
      }
    },
  })
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


const lineCount = slide => {
  const dom = jsdom.JSDOM.fragment(new Remarkable().render(slide))
  return [
    dom.querySelectorAll('p').length,
    dom.querySelectorAll('blockquote').length,
    dom.querySelectorAll('li').length,
    dom.querySelectorAll('br').length,
    [].reduce.call(
      dom.querySelectorAll('pre code'),
      (s, pre) => {
        return s + (pre.textContent || '').split('\n').length
      },
      0
    ),
  ].reduce((x, y) => x + y)
}


const parseSlide = source => {
  const slides = source
    .split(/^\+{4,}$/gm)
    .map(doc => {
      const [slide, notes, style] = doc.split(/^\.{4,}$/gm)
      return `
      {
        slide: ${asHTML(slide)},
        notes: ${asSimpleHTML(notes)},
        lines: ${lineCount(slide)},
        style: ${JSON.stringify(style && style.trim())},
      }
      `
    })
  return `module.exports = [${slides.join(',')}]`
}


module.exports = parseSlide
