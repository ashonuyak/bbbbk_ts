export class ChangePasswordError extends Error {
  constructor() {
    super("The entered password is user's current password")
  }
}
