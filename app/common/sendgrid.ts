const api = 'https://api.sendgrid.com/v3'
export async function checkDownloadStatus(
  sendgridApiKey: string,
  exportId: string
) {
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
}

export async function createContactExport(
  sendgridApiKey: string,
  listId: string
) {
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
}
