import { memo } from 'react'
import OtpInput from 'react-otp-input'

import { Button } from '@components/inputs'
import { Box, Flex, Text } from '@components/primitives'

function OTPInputBox({
  otp,
  setOtp,
  verifyOTP,
  verifyOtpLoading,
  lighter
}: {
  otp: string
  setOtp: (otp: string) => void
  verifyOTP: (otp: string) => Promise<void>
  verifyOtpLoading: boolean
  lighter?: boolean
}) {
  return (
    <Flex direction="column" gap="md">
      <OtpInput
        shouldAutoFocus
        numInputs={6}
        renderInput={props => (
          <Box
            asChild
            shadow
            bg={
              lighter
                ? { base: 'bg-100', dark: 'bg-800' }
                : { base: 'bg-50', dark: 'bg-900' }
            }
            height="100%"
            maxHeight={{ base: '3rem', md: '4rem' }}
            maxWidth={{ base: '3rem', md: '4rem' }}
            mx="xs"
            rounded="md"
            style={{
              aspectRatio: '1/1'
            }}
            width="100%"
          >
            <Text
              asChild
              align="center"
              size={{ base: 'lg', md: '2xl' }}
              weight="medium"
            >
              <input
                {...props}
                inputMode="numeric"
                style={undefined}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    verifyOTP(otp).catch(err => {
                      console.error(err)
                    })
                  }
                }}
              />
            </Text>
          </Box>
        )}
        value={otp}
        onChange={setOtp}
      />
      <Box width="100%">
        <Button
          icon="tabler:arrow-right"
          iconPosition="end"
          loading={verifyOtpLoading}
          namespace="common.vault"
          width="100%"
          onClick={() => {
            verifyOTP(otp).catch(err => {
              console.error(err)
            })
          }}
        >
          otp.buttons.verify
        </Button>
      </Box>
    </Flex>
  )
}

export default memo(OTPInputBox)
