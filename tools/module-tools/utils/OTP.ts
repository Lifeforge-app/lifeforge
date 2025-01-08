async function fetchOTP(login: any): Promise<string | undefined> {
  const res = await fetch(`${process.env.VITE_API_HOST}/user/auth/otp`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${login.token}`
    }
  })

  if (res.status !== 200) {
    return undefined
  }

  const data = await res.json()

  if (data.state === 'error') {
    return undefined
  }

  return data.data
}

async function validateOTP(
  login: any,
  OTPId: string,
  otp: string
): Promise<boolean> {
  const res = await fetch(`${process.env.VITE_API_HOST}/user/auth/otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${login.token}`
    },
    body: JSON.stringify({
      otpId: OTPId,
      otp
    })
  })

  if (res.status !== 200) {
    return false
  }

  const data = await res.json()

  if (data.state === 'error') {
    return false
  }

  return data.data
}

export { fetchOTP, validateOTP }
