// src/entities/Email.ts
export class Email {
  private readonly value: string

  constructor(email: string) {
    if (!Email.isValid(email)) {
      throw new Error('Email inválido')
    }
    this.value = email
  }

  public getValue(): string {
    return this.value
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
