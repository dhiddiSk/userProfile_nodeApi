import { type } from "os"

type jwtTokenPayload = {
    id: string,
    name: string,
    email: string
  }

type userRegistrationRequestPayload = {
    body: any,
    name: string,
    email: string,
    password: string,
    userName: string
  }

type userRegistrationResponsePayload = {
  success: boolean,
  token: string
}



export { jwtTokenPayload, userRegistrationRequestPayload, userRegistrationResponsePayload }
