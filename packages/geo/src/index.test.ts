import { createStack, Stack } from '@dstack-js/lib'
import { encode } from '.'

// eslint-disable-next-line no-undef
describe('Geo', () => {
  let stack: Stack

  // eslint-disable-next-line no-undef
  beforeAll(async () => {
    stack = await createStack({ app: 'test' })
  })

  // eslint-disable-next-line no-undef
  test('set places', async () => {
    const map = await stack.node('map')

    const [p1, p2] = await Promise.all([
      encode(stack, map, 50.450_678, 30.522_395, 7),
      encode(stack, map, 50.440_239, 30.520_194, 7)
    ])

    await p1.put('Ukraine, Kyiv, Maydan')
    await p2.put('Ukraine, Kyiv, Arena')

    // eslint-disable-next-line no-undef
    expect(p1.path).toBe('map.$geo.u.8.v.x.n.8.3')
    // eslint-disable-next-line no-undef
    expect(p2.path).toBe('map.$geo.u.8.v.w.y.w.2')
  })

  // eslint-disable-next-line no-undef
  test('get near places', async () => {
    const map = await stack.node('map')

    const box = await encode(stack, map, 50.45, 30.52, 3)

    // TODO: verify places
    console.log(box)
  })
})
