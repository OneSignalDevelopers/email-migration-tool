import { useLocation } from '@remix-run/react'

export default function AuthenticateESP() {
  const { search } = useLocation()

  const renderFields = () => {
    switch (search.substring(1)) {
      case 'mailgun':
        return renderMailgunFields()
      case 'mailchimp':
        return renderMailchimpFields()
      case 'sendgrid':
        return renderSendgridFields()
      default:
        throw Error(`Invalid case '${search}'`)
    }
  }

  return (
    <>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Mailchimp</h1>
        <h2 className="text-xl mb-4">Authentication</h2>
        <form id="authForm">
          {renderFields()}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Continue
          </button>
        </form>
      </div>
    </>
  )
}

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
        <label htmlFor="sendgrid" className="block text-sm font-medium mb-2">
          Sendgrid
        </label>
        <input
          type="text"
          id="sendgrid"
          name="sendgrid"
          className="bg-gray-700 text-white block w-full p-3 rounded-md"
          placeholder="Enter Sendgrid Info"
        />
      </div>
    </>
  )
}
