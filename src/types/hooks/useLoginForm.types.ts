export interface UseLoginFormReturn {
  email: string
  password: string
  setEmailInput: (value: string) => void
  setPasswordInput: (value: string) => void
  handleLogin: () => Promise<void>
}
