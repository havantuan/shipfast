const oAuth2Config = {
  client: {
    id: 'test',
    secret: 'test'
  },
  auth: {
    tokenPath: process.env.SITE === 'KH' ? '/api/v1/oauth/token' : '/api/v1/oauth/staff/token',
    revokePath: '/api/v1/oauth/revoke'
  }
};

export {
  oAuth2Config
}