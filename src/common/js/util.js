function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let temp = _arr[i]
    let j = getRandomInt(0, i)
    _arr[i] = _arr[j]
    _arr[j] = temp
  }
  return _arr
}

// 截流，不要每次都执行。
// 没到delay时间，下次func又来的话，会清空在执行
export function debounce(func, delay) {
  let timer
  // 函数柯里化
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
