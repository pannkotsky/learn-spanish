import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main className="mx-auto flex w-full max-w-full flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Hello, learn Spanish</h1>
    </main>
  )
}
