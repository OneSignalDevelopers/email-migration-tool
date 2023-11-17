import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { useState } from 'react'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

const emailServiceProviders = ['MailChimp', 'Mailgun', 'SendGrid']

export default function Index() {
  const [selection, setSelection] = useState<string>(
    emailServiceProviders[0].toLowerCase()
  )

  const onChange = (e: React.SyntheticEvent<HTMLInputElement, Event>) =>
    setSelection(e.currentTarget.value)

  return (
    <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Email Migration Tool</h1>
      <form id="emailProviderForm">
        <fieldset className="pb-6">
          <legend className="text-xl mb-4">
            Select email service provider
          </legend>
          <div className="space-y-4">
            {emailServiceProviders.map(esp => (
              <label className="flex items-center" key={esp}>
                <input
                  type="radio"
                  name="emailProvider"
                  value={esp.toLowerCase()}
                  onChange={onChange}
                  checked={esp.toLowerCase() === selection}
                  className="text-blue-600 bg-dark-bg border-gray-600 focus:ring-blue-500"
                />
                <span className="ml-2">{esp}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {selection && (
          <Link
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            to={`/auth-esp?${selection}`}
          >
            Continue
          </Link>
        )}
      </form>
    </div>
  )
}
