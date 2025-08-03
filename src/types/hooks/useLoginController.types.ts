export interface UseLoginControllerReturn {
  email: string
  password: string
  setEmailInput: (value: string) => void
  setPasswordInput: (value: string) => void
  handleLogin: () => Promise<void>
}
