import { ActionFunctionArgs, json } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { useState } from 'react'
import {
  mailgunApiKeyKey,
  mailgunSendingDomainKey,
  onesignalAppIdKey,
  prefsCookie,
} from '~/common/cookies'
import { buildMailgunDao } from '~/common/mailgun-dao'

export default function MailgunMailingListSelection() {
  const actionData = useActionData<typeof action>()
  const [selection, setSelection] = useState('')

  const onSelectionChanged = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelection(event.currentTarget.value)

  const onCreateExportRecipientClicked = async () => {
    const apiKey = actionData?.mailgunApiKey
    const sendingDomain = actionData?.mailgunSendingDomain

    if (!apiKey || !sendingDomain) return

    const dao = buildMailgunDao(apiKey, sendingDomain)
    const exportStatus = await dao.getMailingListVerificationStatus()

    console.log('Verification status', exportStatus)
  }

  return (
    <>
      <div className="mt-6">
        <label htmlFor="contact-list-select">
          Choose a Mailing List to export:
        </label>
        <select
          name="contact-list-select"
          className="bg-gray-700 text-white py-2 px-4 mt-2 w-full"
          onChange={onSelectionChanged}
        >
          <option key="---" value="">
            --Please choose a Mailing List--
          </option>
          {actionData?.mailingLists.map((item: any) => (
            <option key={item.address} value={item.address}>
              {item.name}
            </option>
          ))}
        </select>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded w-full"
          type="button"
          onClick={onCreateExportRecipientClicked}
          disabled={!selection}
        >
          Export Recipients
        </button>
      </div>
    </>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await prefsCookie.parse(cookieHeader)) || {}
  const body = await request.formData()
  const onesignalAppId = body.get('onesignal-app-id') as string
  const mailgunApiKey = body.get('mailgun-api-key') as string
  const mailgunSendingDomain = body.get('mailgun-sending-domain') as string
  cookie[mailgunApiKeyKey] = mailgunApiKey
  cookie[mailgunSendingDomainKey] = mailgunSendingDomain
  cookie[onesignalAppIdKey] = onesignalAppId

  const mailgunDao = buildMailgunDao(mailgunApiKey, mailgunSendingDomain)
  const list = await mailgunDao.getMailingLists()

  return json(
    {
      mailingLists: list?.data.items || [],
      mailgunSendingDomain,
      mailgunApiKey,
    },
    {
      headers: {
        'Set-Cookie': await prefsCookie.serialize(cookie),
      },
    }
  )
}
