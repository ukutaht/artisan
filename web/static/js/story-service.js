import Immutable from 'immutable'

import Story from './story'

const columns = Immutable.Map({
  backlog: Immutable.List([
    new Story({
      name: "Find better way of organizing web helpers",
      number: 1,
      optimistic: 1,
      realistic: 1,
      pessimistic: 2,
      estimate: 1.5,
      column: "backlog"
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
      tags: ['design']
    }),
  ]),
  ready: Immutable.List([
    new Story({
      name: "No hotels found returns 503",
      number: 4,
      optimistic: 1,
      realistic: 2,
      pessimistic: 2,
      estimate: 2.25,
      column: "ready",
      tags: ['bug']
    }),
    new Story({
      name: "Allow admin to write description for events.",
      number: 5,
      optimistic: 1,
      realistic: 2,
      pessimistic: 4,
      estimate: 3.25,
      column: "ready",
    }),
  ]),
  working: Immutable.List([
    new Story({
      name: "Dev serving of CSS-referenced image assets",
      number: 6,
      optimistic: 1,
      realistic: 2,
      pessimistic: 3,
      estimate: 2.75,
      column: "working",
      tags: ['bug']
    }),
  ]),
  completed: Immutable.List([
    new Story({
      name: "Move GA snippet to end of <head>",
      number: 7,
      column: "completed",
    }),
    new Story({
      name: "Fix 'contact us'",
      number: 8,
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
    this.number  = 8
  }

  byColumn() {
    return columns
  }

  update(story) {
    return story;
  }

  add(story) {
    this.number += 1
    return story.merge({number: this.number})
  }
}

export default StoryService
