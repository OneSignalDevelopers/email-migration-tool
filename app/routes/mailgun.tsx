import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, Outlet, useLoaderData } from '@remix-run/react'
import { loadCookies } from '~/common/cookies'

export default function Mailgun() {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <>
      <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Mailgun</h1>
        <h2 className="text-xl mb-4">Authentication</h2>
        <Form id="authForm" method="post" action={`/mailgun/download`}>
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
              defaultValue={loaderData.onesignalAppId}
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
              defaultValue={loaderData.mailgunSendingDomain}
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
              type="password"
              id="mailgun-api-key"
              name="mailgun-api-key"
              className="bg-gray-700 text-white block w-full p-3 rounded-md"
              placeholder="Enter Mailgun API Key"
              defaultValue={loaderData.mailgunApiKey}
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
  const { mailgunApiKey, mailgunSendingDomain, onesignalAppId } =
    await loadCookies(request)

  return json({ mailgunApiKey, mailgunSendingDomain, onesignalAppId })
}
