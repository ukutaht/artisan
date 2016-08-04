import React from 'react'
import TestUtils from 'react/lib/ReactTestUtils'
import Select from 'forms/select'

describe('Select', () => {
  let select;
  let onChange;
  const options = [
    {value: 1, label: 'Option 1'},
    {value: 2, label: 'Option 2'},
  ]

  beforeEach(() => {
    onChange = jasmine.createSpy('onChange')

    select = TestUtils.renderIntoDocument(<Select
      value={1}
      options={options}
      onChange={onChange}
      placeholder="Placeholder"
      />
    );
  })

  it('shows the selected value', () => {
    expect(select.value()).toEqual('Option 1')
  })

  it('can select a different value', () => {
    select.selectOption(2)

    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('shows placeholder when no value is selected', () => {
    select = TestUtils.renderIntoDocument(<Select value={null} options={options} placeholder="Placeholder" />);

    expect(select.value()).toEqual('Placeholder')
  })

  it('can open the dropdown', () => {
    select.toggle()

    expect(select.state.isOpen).toEqual(true)
  })

  it('can discard the selected value', () => {
    select.selectOption(1)
    select.discard({stopPropagation: () => {}})

    expect(onChange).toHaveBeenCalledWith(null)
  })
})
