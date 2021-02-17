import Byte from './Byte.js'
import Decoder from './Decoder.js'
import Hbyte from './Hbyte.js'
import Memory from './Mem.js'
import ALU from './ALU.js'
import { cl, delay } from './Func.js'

const bus = {
    byte: new Byte('00000000'),
    reset(){
        this.byte.set('00000000')
    }
}
// variables
let halt = false
const a = new Byte('00000000', 'A')
const b = new Byte('00000000', 'B')
const i = new Byte('00000000', 'I')
const pc = new Hbyte('0000', 'PC')
const sc = new Hbyte('0000', 'SC')
const mr = new Hbyte('0000', 'MR')
const ram = new Memory()
const dec = new Decoder()
const alu = new ALU()
// variables

{ // FETCH
    dec.subscribe('comi', () => {
        pc.out(bus)
        mr.in(bus)
        bus.reset()
    })

    dec.subscribe('roiice', () => {
        ram.out(mr, bus)
        i.in(bus)
        pc.countOne()
        bus.reset()
    })
}

{ // LDA
    dec.subscribe('iomi', () => {
        i.out(bus)
        mr.in(bus)
        bus.reset()
    })

    dec.subscribe('roai', () => {
        ram.out(mr, bus)
        a.in(bus)
        bus.reset()
        a.print()
    })
}


{
    dec.subscribe('halt', () => {
        halt = true
    })
}




// program----------------------------------------------------------
ram.set('0000', '00011111')
ram.set('0001', '00011110')
ram.set('0010', '11110000')
ram.set('1111', '00000111')
ram.set('1110', '00011000')

while(! halt){
    let s = `${i.upper()}${sc.value}`
    dec.exec(s)
    sc.countOne()
    sc.countOne()
    delay(1000)
}

