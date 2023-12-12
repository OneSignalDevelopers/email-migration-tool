import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, Outlet, useLoaderData } from '@remix-run/react'
import {
  onesignalAppIdKey,
  prefsCookie,
  sendgridApiKeyKey,
} from '~/common/cookies'

export default function Sendgrid() {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <>
      <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Sendgrid</h1>
        <h2 className="text-xl mb-4">Authentication</h2>
        <Form id="authForm" method="post" action={`/sendgrid/download`}>
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
              defaultValue={loaderData.onesginalAppId}
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
              defaultValue={loaderData.sendgridApiKey}
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
  const sendgridApiKey = cookie[sendgridApiKeyKey]
  const onesginalAppId = cookie[onesignalAppIdKey]

  return json({ sendgridApiKey, onesginalAppId })
}
