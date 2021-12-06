import { StackOptions } from '.'

export const defaults: StackOptions = {
  app: '',
  gun: {
    peers: ['https://gun-server-0x77.herokuapp.com/gun', 'http://localhost:8765/gun']
  }
}
