import Byte from './Byte.js'
import Hbyte from './Hbyte.js'
import Memory from './Mem.js'
import ALU from './ALU.js'
import { cl } from './Func.js'

const bus = {
    byte: new Byte('00000000'),
    reset(){
        this.byte.set('00000000')
    }
}
// variables
const a = new Byte('00000001')
const b = new Byte('00000000')
const i = new Byte('00000000')
const pc = new Hbyte('1100')
const sc = new Hbyte('0000')
const mr = new Hbyte('0000')
const mem = new Memory()
const alu = new ALU()
// variables






