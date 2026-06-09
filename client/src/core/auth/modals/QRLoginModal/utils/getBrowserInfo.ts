/**
 * Get browser/device information for display on the mobile approval screen
 */
export default function getBrowserInfo(): string {
  const ua = navigator.userAgent

  let browser = 'Unknown Browser'

  let os = 'Unknown OS'

  // Detect browser
  if (ua.includes('Firefox')) {
    browser = 'Firefox'
  } else if (ua.includes('Chrome') && !ua.includes('Edg')) {
    browser = 'Chrome'
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browser = 'Safari'
  } else if (ua.includes('Edg')) {
    browser = 'Edge'
  } else if (ua.includes('Opera') || ua.includes('OPR')) {
    browser = 'Opera'
  }

  // Detect OS
  if (ua.includes('Windows')) {
    os = 'Windows'
  } else if (ua.includes('Mac OS')) {
    os = 'macOS'
  } else if (ua.includes('Linux')) {
    os = 'Linux'
  } else if (ua.includes('Android')) {
    os = 'Android'
  } else if (
    ua.includes('iOS') ||
    ua.includes('iPhone') ||
    ua.includes('iPad')
  ) {
    os = 'iOS'
  }

  return `${browser} on ${os}`
}
