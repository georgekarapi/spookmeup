import { defineEventHandler, readMultipartFormData } from 'h3'
import { generateSpookyFileName } from '../utils/stringHelpers'

export default defineEventHandler(async event => {
    try {
        const client = event.context.storachaClient
        const files = await readMultipartFormData(event)
        if (!files) throw new Error('No files were uploaded')
        if (files.length !== 1) throw new Error('Exactly one file must be uploaded')
        const file = files[0]
        if (file.type !== 'audio/mpeg') {
            throw new Error('Only MP3 files are allowed')
        }

        const blob = new Blob([file.data], { type: file.type })
        const baseFileName = file.name?.replace('.mp3', '') || ''
        console.log(baseFileName, { type: file.type })
        const fileName =
            baseFileName && baseFileName !== 'file' ? `${baseFileName}.mp3` : `${generateSpookyFileName()}.mp3`
        console.log(fileName, { type: file.type })
        const fileToUpload = new File([blob], fileName, { type: file.type })
        const fileCid = await client.uploadFile(fileToUpload)

        return fileCid.toString()
    } catch (e) {
        console.error(e)
    }
})
