import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, Outlet, useActionData, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { prefsCookie } from '~/common/persistence'

export default function Sendgrid() {
  const loaderData = useLoaderData<typeof loader>()

  useActionData<typeof action>()

  const [sendgridApiKey, setSendgridApiKey] = useState(
    loaderData.sendgridApiKey
  )

  return (
    <>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Sendgrid</h1>
        <h2 className="text-xl mb-4">Authentication</h2>
        <Form id="authForm" method="post" action={`/sendgrid/contact-lists`}>
          <div className="mb-4">
            <label
              htmlFor="onesignal-app-id"
              className="block text-sm font-medium mb-2"
            >
              OneSignal APP ID
            </label>
            <input
              type="text"
              id="onesignal-app-id"
              name="onesignal-app-id"
              className="bg-gray-700 text-white block w-full p-3 rounded-md"
              placeholder="Enter OneSignal APP ID"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="sendgrid-api-key"
              className="block text-sm font-medium mb-2"
            >
              Sendgrid API Key
            </label>
            <input
              type="password"
              id="sendgrid-api-key"
              name="sendgrid-api-key"
              className="bg-gray-700 text-white block w-full p-3 rounded-md"
              placeholder="Enter Sendgrid Info"
              value={sendgridApiKey}
              onChange={e => setSendgridApiKey(e.currentTarget.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Select Contact List
          </button>
        </Form>
        <Outlet />
      </div>
    </>
  )
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await prefsCookie.parse(cookieHeader)) || {}
  const sendgridApiKey = cookie['sendgrid-api-key']

  return json({ sendgridApiKey })
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await prefsCookie.parse(cookieHeader)) || {}
  const body = await request.formData()
  const onesignalAppId = body.get('onesignal-app-id') as string
  const sendgridApiKey = body.get('sendgrid-api-key') as string
  cookie['sendgrid-api-key'] = sendgridApiKey
  cookie['onesignal-app-id'] = onesignalAppId

  return json(
    {},
    {
      headers: {
        'Set-Cookie': await prefsCookie.serialize(cookie),
      },
    }
  )
}
