export const getWRTC = () => {
  try {
    return require('wrtc')
  } catch (error) {
    return require('@dstack-js/wrtc')
  }
}
