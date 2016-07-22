const fakePromise = {
  resolve(data) {
    return {
      then(callback) {
        return callback(data)
      }
    }
  }
}

export default fakePromise
