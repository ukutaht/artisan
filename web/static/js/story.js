import Immutable from 'immutable'

const Story = new Immutable.Record({
    name: '',
    number: null,
    estimate: null,
    optimistic: null,
    realistic: null,
    pessimistic: null,
    state: 'backlog',
    row: 0,
    tags: [],
})

export default Story
