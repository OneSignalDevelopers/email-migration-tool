import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, useActionData, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { prefsCookie } from '~/common/persistence'
import { buildSendgridDao } from '~/common/sendgrid'

export default function SendgridContactListSelection() {
  const actionData = useActionData<typeof action>()
  const loaderData = useLoaderData<typeof loader>()
  const [selection, setSelection] = useState('')
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const onCreateExportClicked = async () => {
    console.log('Create export clickedd')
    const { sendgridApiKey } = loaderData
    if (!sendgridApiKey) return

    const sendgridDao = buildSendgridDao(sendgridApiKey)
    const data = await sendgridDao.createContactExport(selection)
    if (!data) {
      return console.log(`Couldn't created export`)
    }

    const exportStatus = await sendgridDao.checkDownloadStatus(data.id)
    const url = exportStatus?.urls[0]

    setDownloadUrl(url || null)
  }

  const onSelectionChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Selection changed')
    setSelection(event.currentTarget.value)
  }

  return (
    <>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        {actionData && (
          <div>
            <label htmlFor="contact-list-select">
              Choose a Contact List for export:
            </label>
            <select
              name="contact-list-select"
              className="bg-gray-700 text-white py-2 px-4 w-full"
              onChange={onSelectionChanged}
            >
              <option key="---" value="">
                --Please choose an ESP--
              </option>
              {actionData.lists?.map((list: any) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>

            {selection && (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                onClick={onCreateExportClicked}
              >
                Create Export
              </button>
            )}

            {downloadUrl && renderDownloadLink()}
          </div>
        )}
      </div>
    </>
  )

  function renderDownloadLink() {
    return downloadUrl && <Link to={downloadUrl}>Download...</Link>
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await prefsCookie.parse(cookieHeader)) || {}
  const sendgridApiKey = cookie['sendgrid-api-key']
  if (!sendgridApiKey) return

  const sendgridDao = buildSendgridDao(sendgridApiKey)
  const lists = await sendgridDao.getContactLists()

  return json({
    lists: lists?.data,
  })
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await prefsCookie.parse(cookieHeader)) || {}
  const sendgridApiKey = cookie['sendgrid-api-key']

  return json({ sendgridApiKey })
}
