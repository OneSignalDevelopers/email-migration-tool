import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import {
  loadCookies,
  mailchimpApiKeyKey as mailchimpApiKeyCookieKey,
  mailchimpServerPrefixKey,
  onesignalAppIdKey,
  prefsCookie,
} from '~/common/cookies'
import { buildMailchimpDao } from '~/common/mailchimp-dao'

export default function Mailchimp() {
  const actionData = useActionData<typeof action>()
  const loaderData = useLoaderData<typeof loader>()

  return (
    <>
      <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Mailchimp</h1>
        <h2 className="text-xl mb-4">Authentication</h2>
        <Form id="authForm" method="post" action={`/mailchimp`}>
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
              value={loaderData.onesignalAppId}
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
              value={loaderData.mailchimpServerPrefix}
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
              value={loaderData.mailgunApiKey}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Download
          </button>
        </Form>
        <pre>{JSON.stringify(actionData, null, 2)}</pre>
      </div>
    </>
  )
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { mailgunApiKey, onesignalAppId, mailchimpServerPrefix } =
    await loadCookies(request)

  return json({ mailgunApiKey, onesignalAppId, mailchimpServerPrefix })
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await prefsCookie.parse(cookieHeader)) || {}
  const body = await request.formData()
  const onesignalAppId = body.get('onesignal-app-id') as string
  const apiKey = body.get('mailchimp-api-key') as string
  const serverPrefix = body.get('mailchimp-server-prefix') as string
  cookie[mailchimpApiKeyCookieKey] = apiKey
  cookie[onesignalAppIdKey] = onesignalAppId
  cookie[mailchimpServerPrefixKey] = serverPrefix

  const mailchimpDao = buildMailchimpDao(apiKey, serverPrefix)
  const exportLink = await mailchimpDao.generateExport()
  return json(
    { exportLink },
    {
      headers: {
        'Set-Cookie': await prefsCookie.serialize(cookie),
      },
    }
  )
}
