import { createCookie } from '@remix-run/node'

export const prefsCookie = createCookie('prefs')
export const onesignalAppIdKey = 'onesignal-app-id' as const
export const mailgunApiKeyKey = 'mailgun-api-key' as const
export const mailgunSendingDomainKey = 'mailgun-sending-domain' as const
export const mailchimpApiKeyKey = 'mailchimp-api-key' as const
export const mailchimpServerPrefixKey = 'mailchimp-server-prefix' as const
export const sendgridApiKeyKey = 'sendgrid-api-key' as const
