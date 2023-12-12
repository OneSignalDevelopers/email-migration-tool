export function buildMailchimpDao(apiKey: string, datacenter: string) {
  const api = `https://${datacenter}.api.mailchimp.com/3.0/`

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

        const data = await res.json()

        console.log(data)

        return { data }
      } catch (error) {
        console.log(error)
        return error
      }
    },
  }
}
