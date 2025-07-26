export interface UseLoginFormReturn {
  email: string
  password: string
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  handleLogin: () => Promise<void>
}
