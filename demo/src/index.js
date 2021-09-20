import { createStack } from '@dstack-js/lib'
const stack = createStack({ app: 'dstack' })

let node

const value = document.querySelector('#value')

stack.then(async (stack) => {
  window.stack = stack

  node = await stack.node('test.key')
  value.value = node.data

  value.addEventListener('change', async () => {
    await stack.node(node.path, value.value.toString())
  })

  node.on((data) => { value.value = data })
})
