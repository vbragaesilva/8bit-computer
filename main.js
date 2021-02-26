import readline from 'readline-sync'
import Interpreter from './language-bots/interpreter.js'

const path = readline.question('Type the name of the .bit file: ')
const int = new Interpreter()
int.setComputerDelay(75)
// int.setComputerFPS(13)
int.setComputerLogging(false)
console.log('-'.repeat(40), '\n')
int.read(path)
