import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, Outlet, useLoaderData } from '@remix-run/react'
import { loadCookies } from '~/common/cookies'

export default function Mailchimp() {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <>
      <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Mailchimp</h1>
        <h2 className="text-xl mb-4">Authentication</h2>
        <Form id="authForm" method="post" action={`/mailchimp/download`}>
          <div className="mb-4">
            <label
              htmlFor="oneSignal-app-id"
              className="block text-sm font-medium mb-2"
            >
              OneSignal APP ID
            </label>
            <input
              type="text"
              id="oneSignal-app-id"
              name="oneSignal-app-id"
              className="bg-gray-700 text-white block w-full p-3 rounded-md"
              placeholder="Enter OneSignal APP ID"
              defaultValue={loaderData.onesignalAppId}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="mailchimp-server-prefix"
              className="block text-sm font-medium mb-2"
            >
              Mailchimp Server Prefix
            </label>
            <input
              type="text"
              id="mailchimp-server-prefix"
              name="mailchimp-server-prefix"
              className="bg-gray-700 text-white block w-full p-3 rounded-md"
              placeholder="Enter Mailchimp Server Prefix"
              defaultValue={loaderData.mailchimpServerPrefix}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="mailchimp-api-key"
              className="block text-sm font-medium mb-2"
            >
              Mailchimp API Key
            </label>
            <input
              type="password"
              id="mailchimp-api-key"
              name="mailchimp-api-key"
              className="bg-gray-700 text-white block w-full p-3 rounded-md"
              placeholder="Enter Mailchimp API Key"
              defaultValue={loaderData.mailchimpApiKey}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Generate Export
          </button>
        </Form>
        <Outlet />
      </div>
    </>
  )
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { mailchimpApiKey, onesignalAppId, mailchimpServerPrefix } =
    await loadCookies(request)

  return json({ mailchimpApiKey, onesignalAppId, mailchimpServerPrefix })
}
