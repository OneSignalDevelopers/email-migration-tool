import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { useState } from 'react'
import {
  mailgunApiKeyKey,
  onesignalAppIdKey,
  prefsCookie,
  sendgridApiKeyKey,
} from '~/common/cookies'
import { buildMailgunDao } from '~/common/mailgun-dao'

export default function MailgunMailingListSelection() {
  const actionData = useActionData<typeof action>()
  const [selection, setSelection] = useState('')

  const onSelectionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Selection changed')
    setSelection(event.currentTarget.value)
  }

  return (
    <>
      <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <div>
          <label htmlFor="contact-list-select">
            Choose a Mailing List to export:
          </label>
          <select
            name="contact-list-select"
            className="bg-gray-700 text-white py-2 px-4 w-full"
            onChange={onSelectionChanged}
          >
            <option key="---" value="">
              --Please choose a Mailing List--
            </option>
            {actionData?.mailingLists.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          {/* {selection && (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded w-full"
              onClick={onCreateExportClicked}
            >
              Create Export
            </button>
          )} */}

          {/* {downloadUrl && renderDownloadLink()} */}
        </div>
      </div>
    </>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  console.log('ACTION FUNCTION')
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await prefsCookie.parse(cookieHeader)) || {}
  const body = await request.formData()
  const onesignalAppId = body.get('onesignal-app-id') as string
  const mailgunApiKey = body.get('mailgun-api-key') as string
  const sendingDomain = body.get('mailgun-sending-domain') as string
  cookie[mailgunApiKeyKey] = mailgunApiKey
  cookie[onesignalAppIdKey] = onesignalAppId
  cookie[sendgridApiKeyKey] = sendingDomain

  const mailgunDao = buildMailgunDao(mailgunApiKey, sendingDomain)
  const list = await mailgunDao.getMailingLists()

  return json(
    { mailingLists: list?.data || [] },
    {
      headers: {
        'Set-Cookie': await prefsCookie.serialize(cookie),
      },
    }
  )
}
