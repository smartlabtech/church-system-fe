export const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
)

export const validMobileRegex = RegExp(/^(00)?2?01[0125]\d{8}$/i)

export const validPhoneRegex = RegExp(/^0[23456789]\d{8}$/i)
