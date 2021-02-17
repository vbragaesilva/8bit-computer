import Byte from './Byte.js'
import Decoder from './Decoder.js'
import Hbyte from './Hbyte.js'
import Memory from './Mem.js'
import ALU from './ALU.js'
import { cl, sleep, dec2bin } from './Func.js'

const LDA = '0001'
const ADD = '0010'
const SUB = '0011'
const STA = '0100'
const LDI = '0101'
const JMP = '0110'
const OUT = '1110'
const HLT = '1111'

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
alu.update(a, b)
// variables

{// MICRO-INSTRUCTIONS
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
    dec.subscribe('iomi', () => {
        i.out(bus)
        mr.in(bus)
        bus.reset()
    })
    dec.subscribe('roai', () => {
        ram.out(mr, bus)
        a.in(bus)
        alu.update(a, b)
        bus.reset()
    })
    dec.subscribe('halt', () => {
        halt = true
    })
    dec.subscribe('robi', () => {
        ram.out(mr, bus)
        b.in(bus)
        alu.update(a, b)
        bus.reset()
    })
    dec.subscribe('eoai', () => {
        alu.outSum(bus)
        a.in(bus)
        alu.update(a, b)
        bus.reset()
    })
    dec.subscribe('aooi', () => {
        const v = a.value
        const s = `0b${v}`
        cl(`>>> OUT: ${v} - ${Number(s)}`)
    })
    dec.subscribe('aori', () => {
        a.out(bus)
        ram.in(mr, bus)
        bus.reset()
    })
    dec.subscribe('ioai', () => {
        i.outLower(bus)
        a.in(bus)
        bus.reset()
    })
    dec.subscribe('ioci', () => {
        i.outLower(bus)
        pc.in(bus)
        bus.reset()
    })
    dec.subscribe('sueoai', () => {
        alu.outSub(bus)
        a.in(bus)
        alu.update(a, b)
        bus.reset()
    })
    dec.subscribe('reset', () => {
        sc.set('1110')
    })
}



// program----------------------------------------------------------
const delay = 50 //ms
ram.set('0000', `${LDA}1111`)
ram.set('0001', `${ADD}1110`)
ram.set('0010', `${OUT}0000`)
ram.set('0011', `${JMP}0001`)

ram.set('1111', dec2bin(0))
ram.set('1110', dec2bin(14))

while(! halt){
    let s = `${i.upper()}${sc.value}`
    dec.exec(s)
    sc.countOne()
    sc.countOne()
    sleep(delay)
}

