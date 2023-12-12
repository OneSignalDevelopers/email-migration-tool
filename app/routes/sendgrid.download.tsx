import { ActionFunctionArgs, json } from '@remix-run/node'
import { Link, useActionData } from '@remix-run/react'
import { useState } from 'react'
import { prefsCookie, sendgridApiKeyKey } from '~/common/cookies'
import { buildSendgridDao } from '~/common/sendgrid-dao'

export default function SendgridContactListSelection() {
  const actionData = useActionData<typeof action>()

  const [selection, setSelection] = useState('')
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  let intervalHandle: number | null = null
  const onCreateExportClicked = async () => {
    const sendgridApiKey = actionData?.sendgridApiKey
    if (!sendgridApiKey) return

    const sendgridDao = buildSendgridDao(sendgridApiKey)
    const data = await sendgridDao.createContactExport(selection)
    if (!data) {
      return alert(`Couldn't created export`)
    }

    const exportStatus = await sendgridDao.checkDownloadStatus(data.id)
    if (exportStatus?.status === 'pending') {
      if (intervalHandle) return

      intervalHandle = window.setInterval(async () => {
        const exportStatus = await sendgridDao.checkDownloadStatus(data.id)

        if (exportStatus?.status !== 'pending') {
          intervalHandle = null
          setDownloadUrl(exportStatus?.urls[0])
        }
      }, 5000)

      return
    }
  }

  const onSelectionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Selection changed')
    setSelection(event.currentTarget.value)
  }

  return (
    <>
      <div className="mt-6">
        <label htmlFor="contact-list-select">
          Choose a Contact List for export:
        </label>
        <select
          name="contact-list-select"
          className="bg-gray-700 text-white py-2 px-4 w-full mt-2"
          onChange={onSelectionChanged}
        >
          <option key="---" value="">
            --Please choose an Audience--
          </option>
          {actionData?.audiences.map((list: any) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>

        {selection && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded w-full"
            onClick={onCreateExportClicked}
          >
            Create Export
          </button>
        )}

        {downloadUrl && renderDownloadLink()}
      </div>
    </>
  )

  function renderDownloadLink() {
    return (
      downloadUrl && (
        <Link to={downloadUrl} className="mt-6">
          Download...
        </Link>
      )
    )
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await prefsCookie.parse(cookieHeader)) || {}
  const body = await request.formData()
  const sendgridApiKey = body.get(sendgridApiKeyKey) as string
  if (!sendgridApiKey) return null

  cookie[sendgridApiKeyKey] = sendgridApiKey

  const sendgridDao = buildSendgridDao(sendgridApiKey)
  const lists = await sendgridDao.getContactLists()

  return json(
    {
      audiences: lists?.data || [],
      sendgridApiKey,
    },
    {
      headers: {
        'Set-Cookie': await prefsCookie.serialize(cookie),
      },
    }
  )
}
