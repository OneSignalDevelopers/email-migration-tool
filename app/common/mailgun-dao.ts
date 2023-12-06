export const buildMailgunDao = (apiKey: string, sendingDomain: string) => {
  const api = 'https://api.mailgun.net/v3'

  return {
    getMailingLists: async () => {
      const endpoint = `${api}/lists/pages`

      try {
        const auth = Buffer.from(`api:${apiKey}`).toString('base64')
        const res = await fetch(endpoint, {
          method: 'GET',
          headers: {
            Authorization: `Basic ${auth}`,
          },
        })

        const data = await res.json()

        return { data }
      } catch (error) {
        console.error(error)
        return null
      }
    },
  }
}
