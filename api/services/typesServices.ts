type jwtTokenPayload = {
    id: string,
    name: string,
    email: string
  }

type userRegistrationRequestPayload = {
    name: string,
    email: string,
    password: string,
    userName: string
  }

type userRegistrationResponsePayload = {
  status: number
  success: boolean,
  token: string
}


export { jwtTokenPayload, userRegistrationRequestPayload, userRegistrationResponsePayload }
