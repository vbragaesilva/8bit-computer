import fs from 'fs'

export default function load(name){
    const filePath = `./${name}`
    const fileBuffer = fs.readFileSync(filePath, 'utf-8')
    return fileBuffer
}
