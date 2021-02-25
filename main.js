import readline from 'readline-sync'
import Interpreter from './language-bots/interpreter.js'

const path = readline.question('Type the name of the .bit file: ')
const delayOrFPS = readline.question('Do you want to set the Delay or FPS? (delay): ') || 'delay'
let value
const int = new Interpreter()
if(delayOrFPS.toLowerCase() == 'fps'){
    value = readline.question('Type the value of FPS (FPS = 1000): ') || 1000
    int.setComputerFPS(value)
}else{
    value = readline.question('Type the value of delay in ms (delay = 1): ')
    int.setComputerDelay(value)
}
const logIt = readline.question('Do you want to log every step? (no): ') || 'no'
if (logIt == 'no'){
    int.setComputerLogging(false)
}else{
    int.setComputerLogging(true)
}

console.log('-'.repeat(40), '\n')
int.read(path)
