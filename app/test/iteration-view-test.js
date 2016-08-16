import React from 'react'
import TestUtils from 'react/lib/ReactTestUtils'
import fakePromise from 'helpers/fake-promise'
import IterationView from 'iteration-view'

import * as iterations from 'iterations/service'

describe('IterationView', () => {
  let view;

  const project = {
    id: 1
  }

  const iterationResponse = {
    iteration: {state: 'working'},
    all_iterations: [{number: 1}],
    stories: {
      backlog: [],
      ready: [],
      working: [],
      completed: []
    }
  }

  beforeEach(() => {
    spyOn(iterations, 'get').and.callFake(fakePromise.resolve(iterationResponse))

    view = TestUtils.renderIntoDocument(<IterationView
      project={project}
      routeParams={{iterationNumber: 'current'}}/>
    );
  })

  it('loads current iteration data when mounting', () => {
    expect(view.state.iteration).toEqual({state: 'working'})
    expect(view.state.allIterations).toEqual([{number: 1}])
    expect(view.state.stories.backlog).toEqual([])
  })
})
