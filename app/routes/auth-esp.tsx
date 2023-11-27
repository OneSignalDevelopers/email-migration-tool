import { ActionFunctionArgs, json } from '@remix-run/node'
import { Link, useLocation } from '@remix-run/react'
import { Form, useActionData } from '@remix-run/react'
import { checkDownloadStatus, createContactExport } from '~/common/sendgrid'

export default function AuthenticateESP() {
  const { search } = useLocation()
  const data = useActionData<typeof action>()

  const renderFields = () => {
    switch (search.substring(1)) {
      case 'mailgun':
        return renderMailgunFields()
      case 'mailchimp':
        return renderMailchimpFields()
      case 'sendgrid':
        return renderSendgridFields()
      default:
        return renderPostResponse()
    }
  }

  const esp = () => {
    switch (search.substring(1)) {
      case 'mailgun':
        return 'Mailgun'
      case 'mailchimp':
        return 'MailChimp'
      case 'sendgrid':
        return 'SendGrid'
      default:
        return ''
    }
  }

  return (
    <>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">{esp()}</h1>
        <h2 className="text-xl mb-4">Authentication</h2>
        <Form id="authForm" method="post" action="">
          {renderFields()}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Continue
          </button>
        </Form>
      </div>
    </>
  )

  function renderMailchimpFields() {
    return (
      <>
        <div className="mb-4">
          <label
            htmlFor="oneSignalAppId"
            className="block text-sm font-medium mb-2"
          >
            OneSignal APP ID
          </label>
          <input
            type="text"
            id="oneSignalAppId"
            name="oneSignalAppId"
            className="bg-gray-700 text-white block w-full p-3 rounded-md"
            placeholder="Enter OneSignal APP ID"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="sendgrid" className="block text-sm font-medium mb-2">
            Mailchimp Server Prefix
          </label>
          <input
            type="text"
            id="mailchimpServerPrefix"
            name="mailchimpServerPrefix"
            className="bg-gray-700 text-white block w-full p-3 rounded-md"
            placeholder="Enter Mailchimp Server Prefix"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="mailchimpApiKey"
            className="block text-sm font-medium mb-2"
          >
            Mailchimp API Key
          </label>
          <input
            type="text"
            id="mailchimpApiKey"
            name="mailchimpApiKey"
            className="bg-gray-700 text-white block w-full p-3 rounded-md"
            placeholder="Enter Mailchimp API Key"
          />
        </div>
      </>
    )
  }

  function renderMailgunFields() {
    return (
      <>
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
            type="text"
            id="mailgun-api-key"
            name="mailgun-api-key"
            className="bg-gray-700 text-white block w-full p-3 rounded-md"
            placeholder="Enter Mailgun API Key"
          />
        </div>
      </>
    )
  }

  function renderSendgridFields() {
    return (
      <>
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
          />
        </div>
      </>
    )
  }

  function renderPostResponse() {
    const link = data?.urls ? data.urls[0] : ''

    return link && <Link to={link}>Download...</Link>
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData()
  const onesignalAppId = body.get('onesignal-app-id') as string
  const sendgridApiKey = body.get('sendgrid-api-key') as string

  const data = await createContactExport(
    sendgridApiKey,
    'b3be5083-50c9-44b7-bb5e-36a415eeff1a'
  )
  if (!data) return

  const download = await checkDownloadStatus(sendgridApiKey, data.id)

  return json({
    ...download,
  })
}
