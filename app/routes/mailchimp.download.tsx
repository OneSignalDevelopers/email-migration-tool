import { ActionFunctionArgs, json } from '@remix-run/node'
import { Link, Outlet, useActionData } from '@remix-run/react'
import {
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
          to={(actionData?.exportLink as any) || ''}
          target="_blank"
          className="font-l text-blue-600 dark:text-blue-500 hover:underline"
        >
          Download...
        </Link>
        <Outlet />
      </div>
    </>
  )
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
  const exportLink = await mailchimpDao.generateExport()
  return json(
    {
      exportLink,
    },
    {
      headers: {
        'Set-Cookie': await prefsCookie.serialize(cookie),
      },
    }
  )
}
