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
  console.log('_arr:', _arr[0])
  return _arr
}
