import Immutable from 'immutable'

const Story = new Immutable.Record({
    name: '',
    number: null,
    estimate: null,
    optimistic: null,
    realistic: null,
    pessimistic: null,
    column: 'backlog'
})


const columns = Immutable.Map({
  backlog: Immutable.List([
    new Story({
      name: "Find better way of organizing web helpers",
      number: 1,
      optimistic: 1,
      realistic: 1,
      pessimistic: 2,
      estimate: 1.5,
      column: "backlog",
    }),
    new Story({
      name: "Add a ticket type for a non-JCR event",
      number: 2,
      optimistic: 3,
      realistic: 3,
      pessimistic: 3,
      estimate: 3,
      column: "backlog",
    }),
    new Story({
      name: "Child ages: make the new designs work",
      number: 3,
      optimistic: 1,
      realistic: 2,
      pessimistic: 3,
      estimate: 2.75,
      column: "backlog",
    }),
  ]),
  ready: Immutable.List([
    new Story({
      name: "BUG: No hotels found returns 503",
      number: 1,
      optimistic: 1,
      realistic: 2,
      pessimistic: 2,
      estimate: 2.25,
      column: "ready",
    }),
    new Story({
      name: "Allow admin to write description for events.",
      number: 2,
      optimistic: 1,
      realistic: 2,
      pessimistic: 4,
      estimate: 3.25,
      column: "ready",
    }),
  ]),
  working: Immutable.List([
    new Story({
      name: "[BUG] dev serving of CSS-referenced image assets",
      number: 2,
      optimistic: 1,
      realistic: 2,
      pessimistic: 3,
      estimate: 2.75,
      column: "working",
    }),
  ]),
  completed: Immutable.List([
    new Story({
      name: "Move GA snippet to end of <head>",
      number: 2,
      column: "completed",
    }),
    new Story({
      name: "Fix 'contact us'",
      number: 3,
      optimistic: 1,
      realistic: 1,
      pessimistic: 1,
      estimate: 1,
      column: "completed",
    }),
  ])
})


class StoryService {
  constructor() {
    this.columns = columns;
  }

  all() {
    return columns
  }

  update(story) {
    return story;
  }
}

export default StoryService
