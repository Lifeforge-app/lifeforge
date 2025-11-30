import { LoadingScreen } from 'lifeforge-ui'
import { useEffect, useState } from 'react'

import Code from '../../../components/Code'

function EnvExample() {
  const [envContent, setEnvContent] = useState('')

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/LifeForge-app/lifeforge/refs/heads/main/env/.env.example'
    )
      .then(response => response.text())
      .then(text => setEnvContent(text))
      .catch(error => console.error('Error fetching .env.example:', error))
  }, [])

  return !envContent ? (
    <div className="mt-4">
      <LoadingScreen />
    </div>
  ) : (
    <Code language="bash">{envContent}</Code>
  )
}

export default EnvExample
