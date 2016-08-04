function resolvePromise(data) {
  return {
    then(callback) {
      callback(data)
      return this
    },
    catch(callback) {
      return this
    },
  }
}

function rejectPromise(error) {
  return {
    then(callback) {
      return this
    },
    catch(callback) {
      callback(error)
      return this
    },
  }
}

const fakePromise = {
  resolve(data) {
    return () => { return resolvePromise(data) }
  },
  reject(error) {
    return () => { return rejectPromise(error) }
  },
}

export default fakePromise
