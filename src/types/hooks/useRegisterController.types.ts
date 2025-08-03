export interface UseRegisterControllerReturn {
  emailInput: string
  username: string
  birthday: string
  passwordInput: string
  confirmPassword: string
  setEmailInput: (value: string) => void
  setUsername: (value: string) => void
  setBirthday: (value: string) => void
  setPasswordInput: (value: string) => void
  setConfirmPassword: (value: string) => void
  handleRegister: () => Promise<void>
}
