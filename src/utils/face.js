export const faceUtils = {
  faceItems: Array(141),
  faces: function () {
    const self = this
    const arr = []
    for (let i = 1; i < self.faceItems.length; i++) {
      arr.push('/face/' + i + '.png')
    }

    return arr
  }
}
