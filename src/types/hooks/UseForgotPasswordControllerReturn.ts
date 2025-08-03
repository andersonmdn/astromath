export interface UseForgotPasswordControllerReturn {
  email: string
  setEmail: (email: string) => void
  handleResetPassword: () => Promise<void>
}
