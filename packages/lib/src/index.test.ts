/* eslint-disable no-undef */
import { createStack, Stack } from '.'

describe('Stack', () => {
  let s1: Stack
  let s2: Stack

  beforeAll(async () => {
    s1 = await createStack({ app: 'test' })
    s2 = await createStack({ app: 'test' })
  })

  test('write/read', async () => {
    const { data, on, get } = await s2.node<string>('hello')
    await s1.node<string>('hello')
    on((data) => expect(data).toBe('world'))
    expect(data).toBe('world')
    expect(await get()).toBe('world')
  })

  test('node put file', async () => {
    const { data, on, get, putFile } = await s1.node<string>('hello')

    on((data) => expect(data).toBe('world'))
    expect(data).toBe('world')
    expect(await get()).toBe('world')

    putFile({
      type: 'text/plain',
      size: 1,
      data: [...Buffer.from('a')]
    })
  })

  test('node get file', async () => {
    const { data, on, get, file } = await s1.node<string>('hello')

    on((data) => expect(data).toBe('world'))
    expect(data).toBe('world')
    expect(await get()).toBe('world')

    expect(Buffer.from((await file()).data).toString()).toBe('a')
  })
})
