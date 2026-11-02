
import { describe, expect, it } from 'vitest'
import { toNewDevice, validate } from './validation.ts'

const valid = {
  name: 'Smart Thermostat',
  maximum_consumption: '125.5',
  description: 'Temperature control device',
  userId: '19e0cd8c-573e-436c-8f3b-90154459148e',
}

describe('validate', () => {
  it('accepts valid values', () => {
    expect(validate(valid)).toEqual({})
  })

  it('requires name and description after trimming', () => {
    const errors = validate({
      ...valid,
      name: '  ',
      description: '',
    })

    expect(errors.name).toBe('This field is required.')
    expect(errors.description).toBe('This field is required.')
  })

  it('limits name and description to 255 characters', () => {
    expect(
      validate({ ...valid, name: 'a'.repeat(256) }).name
    ).toBeDefined()

    expect(
      validate({ ...valid, name: 'a'.repeat(255) }).name
    ).toBeUndefined()
    expect(validate({ ...valid, description: 'a'.repeat(256) }).description)
      .toBeDefined()
    expect(validate({ ...valid, description: 'a'.repeat(255) }).description)
      .toBeUndefined()
  })

  it('requires a valid maximum consumption value', () => {
    expect(validate({ ...valid, maximum_consumption: '' }).maximum_consumption)
      .toBe('This field is required.')
    expect(validate({ ...valid, maximum_consumption: 'abc' }).maximum_consumption)
      .toBe('Enter a valid number.')
    expect(validate({ ...valid, maximum_consumption: '0' }).maximum_consumption)
      .toBeUndefined()
  })

  it('allows a missing userId', () => {
    expect(validate({ ...valid, userId: '' })).toEqual({})
  })
})

describe('toNewDevice', () => {
  it('trims all text fields', () => {
    expect(
      toNewDevice({
        name: ' Smart Thermostat ',
        maximum_consumption: ' 125.5 ',
        description: ' Temperature control device ',
        userId: ' 19e0cd8c-573e-436c-8f3b-90154459148e ',
      })
    ).toEqual({
      name: 'Smart Thermostat',
      maximum_consumption: 125.5,
      description: 'Temperature control device',
      userId: '19e0cd8c-573e-436c-8f3b-90154459148e',
    })
  })

  it('converts an empty userId to null', () => {
    expect(
      toNewDevice({
        name: 'Thermostat',
        maximum_consumption: '10',
        description: 'Temperature control',
        userId: ' ',
      }).userId
    ).toBeNull()
  })
})
