import { StatusCodes } from 'http-status-codes'

export function buildMailchimpDao(apiKey: string, datacenter: string) {
  const api = `https://${datacenter}.api.mailchimp.com/3.0`

  return {
    generateExport: async () => {
      try {
        const endpoint = `${api}/account-exports`
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${apiKey}`,
          },
          body: JSON.stringify({
            include_stages: ['audiences'],
          }),
        })

        console.log(
          'Generate Export Response: \n',
          JSON.stringify(res, null, 2)
        )
        const data = await res.json()
        console.log(`Response body`, data)
        return { data }
      } catch (error) {
        console.error('Failed to generate the export', error)
        return { data: null }
      }
    },

    downloadExport: async (exportId: string) => {
      try {
        const endpoint = `${api}/account-exports/${exportId}`
        const auth = btoa(`api:${apiKey}`)
        const res = await fetch(endpoint, {
          method: 'GET',
          headers: {
            Authorization: `Basic ${auth}`,
          },
        })

        if (res.status !== StatusCodes.OK) return { downloadUrl: null }

        const data = await res.json()

        return { downloadUrl: data.download_url }
      } catch (error) {
        console.error('Failed to download export', error)
        return { downloadUrl: null }
      }
    },
  }
}
