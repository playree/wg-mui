export const getAppName = () => process.env.APP_NAME || 'WG-MUI'
export const isGoogleSimpleLogin = () =>
  process.env.GOOGLE_SIMPLE_LOGIN ? process.env.GOOGLE_SIMPLE_LOGIN.toUpperCase() !== 'FALSE' : false
