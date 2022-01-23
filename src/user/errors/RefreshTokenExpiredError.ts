export class RefreshTokenExpiredError extends Error {
  constructor() {
    super('Refresh token expired, please sign in into your account.')
  }
}
