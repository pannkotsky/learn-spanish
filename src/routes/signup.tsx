import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const { error: signError } = await authClient.signUp.email({
        name,
        email,
        password,
      })
      if (signError) {
        setError(signError.message ?? 'Could not sign up')
        return
      }
      window.location.assign('/')
    } catch {
      setError('Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Sign up</h1>
        <p className="mt-1 text-sm opacity-80">
          <Link to="/" className="link link-primary">
            ← Back home
          </Link>
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={(e) => void onSubmit(e)}>
        <label className="form-control w-full">
          <span className="label label-text">Name</span>
          <input
            className="input input-bordered w-full"
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="form-control w-full">
          <span className="label label-text">Email</span>
          <input
            className="input input-bordered w-full"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="form-control w-full">
          <span className="label label-text">Password</span>
          <input
            className="input input-bordered w-full"
            type="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>
        {error ? <p className="text-sm text-error">{error}</p> : null}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm opacity-80">
        Already have an account?{' '}
        <Link to="/login" className="link link-primary">
          Log in
        </Link>
      </p>
    </main>
  )
}
