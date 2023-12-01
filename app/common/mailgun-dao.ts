export const buildMailgunDao = (apiKey: string, sendingDomain: string) => {
  const api = 'https://api.mailgun.net/v3'

  return {
    getMailingLists: async () => {
      const endpoint = `${api}/lists/pages`

      try {
        const res = await fetch(endpoint, {
          method: 'GET',
          headers: {
            Authorization: `api:${apiKey}`,
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
