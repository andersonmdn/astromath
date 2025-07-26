// src/entities/Password.ts
export class Password {
  private value: string

  constructor(value: string) {
    if (!Password.isValid(value)) {
      throw new Error('Invalid password')
    }
    this.value = value
  }

  getValue(): string {
    return this.value
  }

  private static isValid(password: string): boolean {
    return (
      typeof password === 'string' &&
      password.length >= 8 &&
      /[A-Za-z]/.test(password) &&
      /\d/.test(password)
    )
  }
}
