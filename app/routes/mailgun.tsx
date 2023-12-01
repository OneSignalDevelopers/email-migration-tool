import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, Outlet, useActionData, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import {
  mailgunApiKeyKey,
  onesignalAppIdKey,
  prefsCookie,
} from '~/common/cookies'

export default function Mailgun() {
  const loaderData = useLoaderData<typeof loader>()

  useActionData<typeof action>()

  const [mailgunApiKey, setMailgunApiKey] = useState(loaderData.mailgunApiKey)

  return (
    <>
      <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Mailgun</h1>
        <h2 className="text-xl mb-4">Authentication</h2>
        <Form id="authForm" method="post" action={`/mailgun`}>
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
              htmlFor="mailgun-sending-domain"
              className="block text-sm font-medium mb-2"
            >
              Mailgun Sending Domain
            </label>
            <input
              type="text"
              id="mailgun-sending-domain"
              name="mailgun-sending-domain"
              className="bg-gray-700 text-white block w-full p-3 rounded-md"
              placeholder="Enter Mailgun Sending Domain Name"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="mailgun-api-key"
              className="block text-sm font-medium mb-2"
            >
              Mailgun API Key
            </label>
            <input
              type="text"
              id="mailgun-api-key"
              name="mailgun-api-key"
              className="bg-gray-700 text-white block w-full p-3 rounded-md"
              placeholder="Enter Mailgun API Key"
              value={mailgunApiKey}
              onChange={e => setMailgunApiKey(e)}
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
  const mailgunApiKey = cookie[mailgunApiKeyKey]

  return json({ mailgunApiKey })
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await prefsCookie.parse(cookieHeader)) || {}
  const body = await request.formData()
  const onesignalAppId = body.get('onesignal-app-id') as string
  const mailgunApiKey = body.get('mailgun-api-key') as string
  cookie[mailgunApiKeyKey] = mailgunApiKey
  cookie[onesignalAppIdKey] = onesignalAppId

  return json(
    {},
    {
      headers: {
        'Set-Cookie': await cookie.serialize(cookie),
      },
    }
  )
}
