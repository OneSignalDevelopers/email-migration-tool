import { createCookie } from '@remix-run/node'

export const mailchimpApiKeyKey = 'mailchimp-api-key' as const
export const mailchimpServerPrefixKey = 'mailchimp-server-prefix' as const
export const mailgunApiKeyKey = 'mailgun-api-key' as const
export const mailgunSendingDomainKey = 'mailgun-sending-domain' as const
export const onesignalAppIdKey = 'onesignal-app-id' as const
export const prefsCookie = createCookie('prefs')
export const sendgridApiKeyKey = 'sendgrid-api-key' as const

export async function loadCookies(request: Request) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await prefsCookie.parse(cookieHeader)) || {}
  const sendgridApiKey: string | undefined = cookie[sendgridApiKeyKey]
  const mailgunApiKey: string | undefined = cookie[mailgunApiKeyKey]
  const mailgunSendingDomain: string | undefined =
    cookie[mailgunSendingDomainKey]
  const onesignalAppId: string | undefined = cookie[onesignalAppIdKey]
  const mailchimpServerPrefix: string | undefined =
    cookie[mailchimpServerPrefixKey]
  const mailchimpApiKey: string | undefined = cookie[mailchimpApiKeyKey]

  return {
    mailchimpApiKey,
    mailchimpServerPrefix,
    mailgunApiKey,
    mailgunSendingDomain,
    onesignalAppId,
    sendgridApiKey,
  }
}
