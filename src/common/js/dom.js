export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData(el, name, val) {
	let prefix = 'data-'
	name = prefix + name
	if (val) {
		el.setAttribute(name, val)
	} else {
		return el.getAttribute(name)
	}
}

// 兼容性
let elementStyle = document.createElement('div').style

let vendor = (() => {
  // 这里只是给出一个属性用来测试，使用translation其实也可以
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standar: 'transform'
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standar') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
