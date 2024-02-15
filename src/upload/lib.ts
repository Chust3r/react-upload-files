export const covertToBase64 = (blob: File) => {
	return new Promise((resolve, reject) => {
		try {
			const reader = new FileReader()

			reader.readAsDataURL(blob)

			reader.onload = () => {
				resolve(reader.result)
			}
			reader.onerror = () => {
				reject(reader.error)
			}
		} catch (error) {
			reject(error)
		}
	})
}
