export class EmailCheckError extends Error {
  constructor() {
    super("User with this email doesn't exist")
  }
}
