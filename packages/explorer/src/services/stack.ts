import { Stack, StackOptions } from '@dstack-js/lib'

export const init = (options: StackOptions): Stack => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.$stack = new Stack(options)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return window.$stack
}

export const get = (): Stack => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!window.$stack) {
    throw new Error('non initialized')
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return window.$stack
}
