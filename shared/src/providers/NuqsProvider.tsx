import { NuqsAdapter } from 'nuqs/adapters/react'

export default function NuqsProvider({
  children
}: {
  children: React.ReactNode
}) {
  return <NuqsAdapter>{children}</NuqsAdapter>
}
