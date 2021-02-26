import load from './read.js'
import Computer from '../components/Computer.js'
import { dec2bin } from '../components/Func.js'
function splitn(string){
    try{
        return string.split('\r\n').filter(i => {if(i) return i})
    }catch{console.log('Error!')}
}
export default class Interpreter{
    constructor(){
        this.acceptedCommands = {
            LDA: '0001',
            ADD: '0010',
            SUB: '0011',
            STA: '0100',
            LDI: '0101',
            JMP: '0110', 
            JPN: '0111', 
            JPZ: '1000', 
            JPC: '1001', 
            OUT: '1110',
            HLT: '1111',
            MOV: 'mov'
        }
        this.currentFileName = null
        this.comp = new Computer()
        this.comp.setLogging(false)
        this.firstLineNotMOV = 999999999
        this.findFirstNotMOV = true
        this.numberOfProgramLines = 0
    }

    getTokens(string){
        const splittedLines = splitn(string)
        let tokens = []             
        for(let i in splittedLines){
            let element = splittedLines[i]
            let commentIndex = element.indexOf('#')
            if(commentIndex > 0) element = element.substring(0, commentIndex) // remove comments
            if(! element.startsWith('#')){
                tokens.push( element.split(' ').filter(i => {if(i) return i}))

            }
        } 
        tokens = tokens.filter(el => {if(el != []) return el})
        return tokens
    }

    read(fileName){
        let content = null
        try{ // LOAD CONTENT
            if(fileName.includes('.bit')){
                content = load(`zbits/${fileName}`)
                this.currentFileName = fileName
                
            }else{
                content = load(`zbits/${fileName}.bit`)
                this.currentFileName = `${fileName}.bit`
            }
        }catch(err){    
            console.log('Error!')
        }
        const tokens = this.getTokens(content)
        this.exec(tokens)
    }

    throwError(type, line, lineNumber){
        let wordLen = line[0].length
        let indicator = '^'
        let lineString = (() => {
                let string = ''
                line.forEach(i => string+=` ${i}`)
                string = string.trim()
                return string
        })()

        if(type == 'Unknown command'){
            indicator = ' '.repeat(wordLen-1) + indicator
        }
        if(type == 'Too big:' || type == 'Overwriting program Commands' || type == 'Param is NaN:'){
            indicator = ' '.repeat(4) + indicator
        }
        if(type == 'Too big' || type == 'Too many parameters' || type == 'Missing parameters'){
            indicator = ' '.repeat(lineString.length-1) + indicator
        }
        if(type == 'Param is NaN'){
            indicator = ' '.repeat(lineString.length-1) + indicator
        }



        lineString = ' '.repeat(5) + lineString
        indicator = ' '.repeat(5) + indicator
        console.error(`Error: ${type}`)
        console.error(lineString)
        console.error(indicator)
        console.log()
        console.log(`at file:///${this.currentFileName}:${Number(lineNumber)+1}`)
        process.exit()
    }

    exec(tokensArray){
        for(let i in tokensArray){// CHECK FOR ERRORS 
            const line = tokensArray[i]
            const command = line[0].toUpperCase()
            const param_num = line.length 
            if(!this.acceptedCommands[command]){
                this.throwError('Unknown command', line, i)
            }
            if(command == 'MOV' && line[1] > 15){
                this.throwError('Too big:', line, i)
            }
            if( (Number(line[1]) > 15) || (Number(line[2]) > 255 && command == 'MOV') ){
                this.throwError('Too big', line, i)
            }
            if( (param_num>2 && command != 'MOV') || (param_num > 3 && command == 'MOV') ){
                this.throwError('Too many parameters', line, i)
            }
            if( (param_num<2 && command != 'MOV') || (param_num < 3 && command == 'MOV') ){
                if(command != 'OUT' && command != 'HLT'){
                    this.throwError('Missing parameters', line, i)
                }
            }
            
            
            if(command != 'MOV'){
                if( this.findFirstNotMOV){
                    this.firstLineNotMOV = i
                    this.findFirstNotMOV = false
                    this.numberOfProgramLines = tokensArray.length - this.firstLineNotMOV
                }
                if(isNaN(parseFloat(line[1]))) {
                    if(command != 'OUT' && command != 'HLT'){
                        this.throwError('Param is NaN', line, i)
                    }
                }
            }else{
                if (i > this.firstLineNotMOV){
                    this.throwError('MOV after computer init', line, i)
                }
                if(isNaN(parseFloat(line[1]))) this.throwError('Param is NaN:', line, i)
                if(isNaN(parseFloat(line[2]))) this.throwError('Param is NaN', line, i)
            }
    
        }
        for(let i in tokensArray){ 
            const line = tokensArray[i]
            const command = line[0].toUpperCase()
            if(command == 'MOV' && line[1] <= this.numberOfProgramLines - 1){// CHECK OVERWRITING
                this.throwError('Overwriting program Commands', line, i)
            }

            //EXECUTING
            if(command == 'MOV'){//PROGRAMMING RAM
                this.comp.ram.set(Number(line[1]), dec2bin(Number(line[2]), 8))
            }else{
                const lineAfterMOV = i - this.firstLineNotMOV
                const hbyte = this.acceptedCommands[command]
                const param = line[1] || '0'
                const fullInstruction = `${hbyte}${dec2bin(Number(param), 4)}`
                this.comp.ram.set(lineAfterMOV, fullInstruction)
            }
        }

        this.comp.run()

    }

    setComputerFPS(value){
        this.comp.setFPS(value)
    }
    setComputerDelay(value){
        this.comp.setDelay(value)
    }
    setComputerLogging(value){
        this.comp.setLogging(value)
    }
    
}

/* const jose = new Interpreter()
console.log(jose.name) */