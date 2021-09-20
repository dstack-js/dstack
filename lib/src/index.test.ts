/* eslint-disable no-undef */
import { createStack, Stack } from '.'

describe('Stack', () => {
  let stack: Stack

  beforeAll(async () => {
    stack = await createStack({ app: 'test' })
  })

  test('node write', async () => {
    const { data, on } = await stack.node<string>('hello', 'world')
    on((data) => expect(data).toBe('world'))
    expect(data).toBe('world')
  })

  test('node read', async () => {
    const { data, on, get } = await stack.node<string>('hello')
    on((data) => expect(data).toBe('world'))
    expect(data).toBe('world')
    expect(await get()).toBe('world')
  })
})
