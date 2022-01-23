export class SameEmailError extends Error {
  constructor() {
    super('User with the same email already exists.')
  }
}
