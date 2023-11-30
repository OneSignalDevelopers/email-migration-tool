export const buildSendgridDao = (sendgridApiKey: string) => {
  const api = 'https://api.sendgrid.com/v3'

  return {
    checkDownloadStatus: async (exportId: string) => {
      const endpoint = `${api}/marketing/contacts/exports/${exportId}`

      try {
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${sendgridApiKey}`,
          },
        })

        const { status, urls, message } = await res.json()

        return {
          status,
          message: message || '',
          urls: urls || [],
        }
      } catch (error) {
        console.error(error)
        return null
      }
    },

    createContactExport: async (listId: string) => {
      const endpoint = `${api}/marketing/contacts/exports`

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sendgridApiKey}`,
          },
          body: JSON.stringify({
            list_ids: [listId],
          }),
        })

        const { id } = await res.json()
        return { id }
      } catch (error) {
        console.error(error)
        return null
      }
    },
    getContactLists: async () => {
      const endpoint = `${api}/marketing/lists`

      try {
        const res = await fetch(endpoint, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sendgridApiKey}`,
            'data-urlencode': 'page_size=100',
          },
        })

        const data = await res.json()

        return { data: [...data.result] }
      } catch (error) {
        console.error(error)
        return null
      }
    },
  }
}
