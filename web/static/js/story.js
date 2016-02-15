import Immutable from 'immutable'

const Story = new Immutable.Record({
    name: '',
    number: null,
    estimate: null,
    optimistic: null,
    realistic: null,
    pessimistic: null,
    column: 'backlog',
    tags: []
})

export default Story
