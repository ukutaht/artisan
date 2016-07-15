import pert from 'stories/pert'

describe('Pert', () => {
  it('calculates estimate', () => {
    const estimates = {
      optimistic: 1,
      realistic: 2,
      pessimistic: 3
    }

    expect(pert(estimates)).toEqual(2.75)
  })

  it('returns null if all estimates are missing', () => {
    const estimates = {
      optimistic: null,
      realistic: null,
      pessimistic: null
    }

    expect(pert(estimates)).toEqual(null)
  })

  it('treats null as zeroes', () => {
    const withNulls = {
      optimistic: 2,
      realistic: null,
      pessimistic: null
    }

    const withZeroes = {
      optimistic: 2,
      realistic: 0,
      pessimistic: 0
    }

    expect(pert(withNulls)).toEqual(pert(withZeroes))
  })
})
