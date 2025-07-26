export interface UseForgotPasswordFormReturn {
  email: string
  setEmail: (email: string) => void
  handleResetPassword: () => Promise<void>
}
