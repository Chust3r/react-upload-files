import { useEffect, useState, useRef } from 'react'
import styles from './uploadFile.module.css'
import { covertToBase64 } from './lib.ts'
type TypeHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => void

export interface Files {
	blob: string
	base64: string
	type: string
	name: string
	size: number
}

type FilesTypes =
	| 'text/plain'
	| 'image/png'
	| 'image/jpeg'
	| 'application/pdf'
	| 'image/jpg'
	| 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export interface UploadState {
	isDragOver: boolean
	isLoading: boolean
	removeFile: (index?: number) => void
}

interface Props {
	multiple?: boolean
	getFiles?: (files: Files[]) => void
	supportFiles?: FilesTypes[]
	maxSize?: number
	getState?: (state: UploadState) => void
}

const MAX_SIZE = 4000000

export const UploadFile = ({
	multiple = false,
	getFiles,
	getState,
	supportFiles = ['text/plain', 'application/pdf'],
	maxSize = MAX_SIZE,
}: Props) => {
	const ref = useRef<HTMLDivElement>(null)

	const [files, setFiles] = useState<Files[]>([])

	const [state, setState] = useState<UploadState>({
		isDragOver: false,
		isLoading: false,
		removeFile: () => {},
	})

	useEffect(() => {
		const removeFile = (index?: number) => {
			if (!index || index < 0) {
				console.log('Remove all')
				setFiles([])
			} else {
				const newFiles = [...files]

				newFiles.splice(index, 1)

				setFiles(newFiles)
			}
		}

		setState((state) => ({ ...state, removeFile }))
	}, [files])

	useEffect(() => {
		if (getFiles) getFiles(files)
		if (getState) getState(state)
	}, [files, getFiles, getState, state])

	useEffect(() => {
		if (getState) getState(state)
	}, [state.isDragOver, state.isLoading, getState, state])

	//→ Get data file from input when it changes

	const handleChange: TypeHandleChange = async (event) => {
		setState((state) => ({ ...state, isLoading: true }))

		const files = event.target.files

		if (!files) return setState((state) => ({ ...state, isLoading: false }))

		const _files: Files[] = []

		for (const file of Array.from(files)) {
			if (supportFiles && !supportFiles.includes(file.type as FilesTypes)) {
				console.log('File type not supported', file.type)
				continue
			}

			if (file.size > maxSize) {
				console.log('File size not supported', file.size)
				continue
			}

			const base64 = await covertToBase64(file)

			_files.push({
				blob: URL.createObjectURL(file),
				base64: base64 as string,
				type: file.type,
				name: file.name,
				size: file.size,
			})
		}

		setFiles(_files)
		setState((state) => ({ ...state, isLoading: false }))
	}

	//→ handler dragover

	const handleDragOver = (ev: React.DragEvent<HTMLDivElement>) => {
		ev.preventDefault()
		ev.stopPropagation()
		setState((state) => ({ ...state, isDragOver: true }))
	}

	//→ Get data file from drop event

	const handleDrop = async (ev: React.DragEvent<HTMLDivElement>) => {
		setState((state) => ({ ...state, isDragOver: false }))
		ev.preventDefault()

		if (!ev.dataTransfer.files)
			return setState((state) => ({ ...state, isLoading: false }))

		const _files: Files[] = []

		for (const file of Array.from(ev.dataTransfer.files)) {
			if (supportFiles && !supportFiles.includes(file.type as FilesTypes)) {
				console.log('File type not supported', file.type)
				continue
			}

			if (file.size > maxSize) {
				console.log('File size not supported', file.size)
				continue
			}

			const base64 = await covertToBase64(file)

			_files.push({
				blob: URL.createObjectURL(file),
				base64: base64 as string,
				type: file.type,
				name: file.name,
				size: file.size,
			})
		}
		setFiles(_files)
		setState((state) => ({ ...state, isLoading: false }))
	}

	//→ remove elements

	return (
		<div
			className={styles.upload__wraper}
			ref={ref}
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			style={{ border: state.isDragOver ? '2px dashed black' : '' }}
		>
			<label htmlFor='_upload__file' className={styles.upload__label}>
				{state.isDragOver ? 'Drop files here' : 'Upload files'}
			</label>
			<input
				type='file'
				id='_upload__file'
				onChange={handleChange}
				multiple={multiple}
			/>
		</div>
	)
}
