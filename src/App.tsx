import { useState } from 'react'
import { UploadFile, Files, UploadState } from './upload/UploadFiles'

const App = () => {
	const [files, setFiles] = useState<Files[]>([])
	const [state, setState] = useState<UploadState>()

	return (
		<div>
			<UploadFile
				getFiles={setFiles}
				getState={setState}
				supportFiles={[
					'image/png',
					'image/jpeg',
					'application/pdf',
					'image/jpg',
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				]}
				multiple
			/>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
				}}
			>
				<pre>{JSON.stringify(state, null, 2)}</pre>
				<pre>{JSON.stringify(files, null, 2)}</pre>
			</div>

			<button onClick={() => state?.removeFile(1)}>Clear</button>
		</div>
	)
}

export default App
