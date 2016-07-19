import React from 'react'
import TestUtils from 'react/lib/ReactTestUtils'
import IterationView from 'iteration-view'

import * as iterations from 'iterations/service'
import * as stories from 'stories/service'

const fakePromise = {
  resolve(data) {
    return {
      then(callback) {
        return callback(data)
      }
    }
  }
}

describe('IterationView', () => {
  let view;

  const project = {
    id: 1
  }

  const iterationResponse = {
    iteration: {state: 'working'},
    all_iterations: [],
    stories: {
      backlog: [],
      ready: [],
      working: [],
      completed: []
    }
  }

  beforeEach(() => {
    spyOn(iterations, 'get').and.callFake(() => fakePromise.resolve(iterationResponse))

    view = TestUtils.renderIntoDocument(<IterationView
      project={project}
      routeParams={{iterationNumber: 'current'}}/>
    );
  })

  it('loads current iteration data when mounting', () => {
    expect(view.state.iteration).toEqual({state: 'working'})
    expect(view.state.allIterations).toEqual([])
    expect(view.state.stories.backlog).toEqual([])
  })

  it('can add a story', () => {
    spyOn(stories, 'add').and.callFake((story) => {
      return fakePromise.resolve(Object.assign({}, story, {
        id: 1,
        number: 1,
        creator: {
          avatar: null
        }
      }))
    })

    view.addStory({state: 'working', name: 'Hello'})

    expect(view.state.stories.working[0].name).toEqual('Hello')
  })

  it('can update a story', () => {
    view.setState({
      stories: {
        backlog: [],
        ready: [],
        working: [
          {
            id: 1,
            state: 'working',
            name: 'Existing story',
            creator: {
              avatar: null
            }
          }
        ],
        completed: []
      }
    })

    spyOn(stories, 'update').and.callFake((story) => {
      return fakePromise.resolve(Object.assign({}, story, {
        creator: {
          avatar: null
        }
      }))
    })
    view.updateStory({id: 1, state: 'working', name: 'New name'})

    expect(view.state.stories.working[0].name).toEqual('New name')
  })
})
