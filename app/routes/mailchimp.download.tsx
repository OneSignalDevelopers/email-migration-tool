import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, Outlet, useActionData } from '@remix-run/react'
import {
  loadCookies,
  mailchimpApiKeyKey,
  mailchimpServerPrefixKey,
  onesignalAppIdKey,
  prefsCookie,
} from '~/common/cookies'
import { buildMailchimpDao } from '~/common/mailchimp-dao'

export default function Mailchimp() {
  const actionData = useActionData<typeof action>()

  return (
    <>
      <div className="mt-6">
        <Link
          to={(actionData?.downloadUrl as any) || ''}
          target="_blank"
          className="font-medium text-2xl text-blue-600 dark:text-blue-500 hover:underline"
        >
          Download...
        </Link>
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

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await prefsCookie.parse(cookieHeader)) || {}
  const body = await request.formData()

  const onesignalAppId = body.get('onesignal-app-id') as string
  const apiKey = body.get('mailchimp-api-key') as string
  const serverPrefix = body.get('mailchimp-server-prefix') as string
  cookie[mailchimpApiKeyKey] = apiKey
  cookie[onesignalAppIdKey] = onesignalAppId
  cookie[mailchimpServerPrefixKey] = serverPrefix

  const mailchimpDao = buildMailchimpDao(apiKey, serverPrefix)
  const downloadedExport = await mailchimpDao.downloadExport('2468')

  return json(
    {
      downloadUrl: downloadedExport.downloadUrl,
    },
    {
      headers: {
        'Set-Cookie': await prefsCookie.serialize(cookie),
      },
    }
  )
}
