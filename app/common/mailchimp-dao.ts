export function buildMailchimpDao(apiKey: string, datacenter: string) {
  const api = `https://${datacenter}.api.mailchimp.com/3.0/`

  return {
    generateExport: async () => {
      const endpoint = `${api}/account-exports`

      try {
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

        return { data }
      } catch (error) {
        console.log(error)
        return error
      }
    },
  }
}
