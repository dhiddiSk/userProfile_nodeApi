type jwtTokenPayload = {
    id: string,
    name: string,
    email: string
  }

interface userRegistrationResponsePayload {
  success: boolean,
  token: string
}

interface userRegistrationRequestPayload {
  name: string,
  email: string,
  password: string,
  userName: string
}

interface userLoginRequestPayload {
  email: string,
  password: string
}

interface userLoginResponsePayload {
  success: boolean,
  token: string
}

export { jwtTokenPayload, userRegistrationRequestPayload, userRegistrationResponsePayload, userLoginResponsePayload, userLoginRequestPayload  }
