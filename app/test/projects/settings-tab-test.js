import React from 'react'
import TestUtils from 'react/lib/ReactTestUtils'
import fakePromise from 'helpers/fake-promise'

import SettingsTab from 'projects/settings-tab'

describe('ProjectSettingsTab', () => {
  let updateProject;
  let settings;
  const project = {
    id: 1,
    name: 'project name',
    slug: 'project-slug'
  };

  const fakeSubmit = {preventDefault: () => {}}

  beforeEach(() => {
    updateProject = jasmine.createSpy('updateProject')
    settings = TestUtils.renderIntoDocument(<SettingsTab project={project} updateProject={updateProject} />)
  })

  it('updates name and slug', () => {
    settings.change('name', {target: {value: 'New name'}})
    settings.change('slug', {target: {value: 'new-slug'}})

    settings.save(fakeSubmit)

    expect(updateProject).toHaveBeenCalledWith(project.id, {name: 'New name', slug: 'new-slug'})
  })

  it('validates presence of name', () => {
    settings.change('name', {target: {value: ''}})

    settings.save(fakeSubmit)

    expect(updateProject).not.toHaveBeenCalled()
    expect(settings.state.formErrors.name).toEqual('Cannot be blank')
  })

  it('validates presence of slug', () => {
    settings.change('slug', {target: {value: ''}})

    settings.save(fakeSubmit)

    expect(updateProject).not.toHaveBeenCalled()
    expect(settings.state.formErrors.slug).toEqual('Cannot be blank')
  })

  it('validates slug format', () => {
    settings.change('slug', {target: {value: 'XYZ??__  '}})

    settings.save(fakeSubmit)

    expect(updateProject).not.toHaveBeenCalled()
    expect(settings.state.formErrors.slug).toEqual('Can only use lower case letters, numbers, and dashes')
  })
})
