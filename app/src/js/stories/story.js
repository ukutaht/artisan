import Immutable from 'immutable'

const Story = new Immutable.Record({
    id: null,
    project_id: null,
    name: null,
    acceptance_criteria: null,
    number: null,
    estimate: null,
    optimistic: null,
    realistic: null,
    pessimistic: null,
    state: 'backlog',
    position: 0,
    tags: [],
})

export default Story
