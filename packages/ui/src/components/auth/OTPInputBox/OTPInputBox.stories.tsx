import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Bordered, Flex } from '@/components/primitives'

import { OTPInputBox } from './index'

const meta = {
  component: OTPInputBox,
  title: 'Auth/OTPInputBox'
} satisfies Meta<typeof OTPInputBox>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Default OTP input box with 6 digit inputs and verify button.
 */
export const Default: Story = {
  args: {
    otp: '',
    setOtp: () => {},
    verifyOTP: async () => {},
    verifyOtpLoading: false
  },
  render: props => {
    const [otp, setOtp] = useState('')

    return <OTPInputBox {...props} otp={otp} setOtp={setOtp} />
  }
}

/**
 * OTP input box with the loading state on the verify button.
 */
export const Verifying: Story = {
  args: {
    otp: '123456',
    setOtp: () => {},
    verifyOTP: async () => {},
    verifyOtpLoading: true
  },
  render: props => {
    const [otp, setOtp] = useState('123456')

    return <OTPInputBox {...props} otp={otp} setOtp={setOtp} />
  }
}

/**
 * OTP input box with the lighter background variant.
 */
export const LighterVariant: Story = {
  args: {
    lighter: true,
    otp: '',
    setOtp: () => {},
    verifyOTP: async () => {},
    verifyOtpLoading: false
  },
  render: props => {
    const [otp, setOtp] = useState('')

    return <OTPInputBox {...props} otp={otp} setOtp={setOtp} />
  }
}

/**
 * OTP input box with a small container mimicking a mobile screen width.
 */
export const SmallScreen: Story = {
  args: {
    otp: '',
    setOtp: () => {},
    verifyOTP: async () => {},
    verifyOtpLoading: false
  },
  render: props => {
    const [otp, setOtp] = useState('')

    return (
      <Bordered asChild borderColor="bg-500" height="100%" p="lg" width="320px">
        <Flex centered>
          <OTPInputBox {...props} otp={otp} setOtp={setOtp} />
        </Flex>
      </Bordered>
    )
  }
}
