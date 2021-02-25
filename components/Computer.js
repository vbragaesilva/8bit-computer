import Byte from './Byte.js'
import Decoder from './Decoder.js'
import Hbyte from './Hbyte.js'
import Memory from './Mem.js'
import ALU from './ALU.js'
import { cl, sleep } from './Func.js'
const NEG = 0
const ZERO = 1
const CARRY = 2
export default class Computer{
    constructor(){
        this.commands = {
            LDA: {hbyte: '0001', micro_inst: 5},
            ADD: {hbyte: '0010', micro_inst: 6},
            SUB: {hbyte: '0011', micro_inst: 6},
            STA: {hbyte: '0100', micro_inst: 5},
            LDI: {hbyte: '0101', micro_inst: 4},
            JMP: {hbyte: '0110', micro_inst: 4}, 
            JPN: {hbyte: '0111', micro_inst: 5}, 
            JPZ: {hbyte: '1000', micro_inst: 5}, 
            JPC: {hbyte: '1001', micro_inst: 5}, 
    
            OUT: {hbyte: '1110', micro_inst: 4},
            HLT: {hbyte: '1111', micro_inst: 3},
        }
        this.delay = 1
        this.halt = false
        this.a = new Byte('00000000', 'A') // REGISTER A
        this.b = new Byte('00000000', 'B') // REGISTER B
        this.i = new Byte('00000000', 'I') // INSTRUCTION REGISTER
        this.pc = new Hbyte('0000', 'PC') // PROGRAM COUNTER
        this.sc = new Hbyte('0000', 'SC') // STEP COUNTER
        this.fr = new Hbyte('0000', 'FR') // FLAGS REGISTER
        this.mr = new Hbyte('0000', 'MR') // MEMORY ADDRESS REGISTER
        this.ram = new Memory() // RANDOM ACCESS MEMORY
        this.dec = new Decoder() // INSTRUCTION AND STEP DECODER
        this.alu = new ALU() // ARITHMETIC AND LOGIC UNIT
        this.alu.update(this.a, this.b) 
        this.bus = {
            byte: new Byte('00000000'),
            reset(){
                this.byte.reset()
            }
        }
        this.flagBus = {
            // NEG / ZERO / CARRY / 0
            hbyte: new Hbyte('0000'),
            reset(){
                this.hbyte.reset()
            }
        }
        
        { // MICRO INSTRUCTIONS
            this.dec.subscribe('comi', () => {
                this.pc.out(this.bus)
                this.mr.in(this.bus)
                this.bus.reset()
            })
            this.dec.subscribe('roiice', () => {
                this.ram.out(this.mr, this.bus)
                this.i.in(this.bus)
                this.pc.countOne()
                this.bus.reset()
            })
            this.dec.subscribe('iomi', () => {
                this.i.out(this.bus)
                this.mr.in(this.bus)
                this.bus.reset()
            })
            this.dec.subscribe('roai', () => {
                this.ram.out(this.mr, this.bus)
                this.a.in(this.bus)
                this.alu.update(this.a, this.b)
                this.bus.reset()
            })
            this.dec.subscribe('halt', () => {
                this.halt = true
                console.log('HLT')
            })
            this.dec.subscribe('robi', () => {
                this.ram.out(this.mr, this.bus)
                this.b.in(this.bus)
                this.alu.update(this.a, this.b)
                this.bus.reset()
            })
            this.dec.subscribe('eoai', () => {
                this.alu.outSum(this.bus, this.flagBus)
                this.fr.in(this.flagBus)
                // console.log(this.fr.value)
                this.a.in(this.bus)
                this.alu.update(this.a, this.b)
                this.flagBus.reset()
                this.bus.reset()
            })
            this.dec.subscribe('aooi', () => {
                const v = this.a.value
                const s = `0b${v}`
                if(this.isNeg()){
                    cl(`OUT >>> -${v} : -${Number(s)}`)
                }else{
                    cl(`OUT >>> ${v} : ${Number(s)}`)
                }
            })
            this.dec.subscribe('aori', () => {
                this.a.out(this.bus)
                this.ram.in(this.mr, this.bus)
                this.bus.reset()
            })
            this.dec.subscribe('ioai', () => {
                this.i.outLower(this.bus)
                this.a.in(this.bus)
                this.bus.reset()
            })
            this.dec.subscribe('ioci', () => {
                this.i.outLower(this.bus)
                this.pc.in(this.bus)
                this.bus.reset()
            })
            this.dec.subscribe('sueoai', () => {
                this.alu.outSub(this.bus, this.flagBus)
                this.fr.in(this.flagBus)
                // console.log(this.fr.value)
                this.a.in(this.bus)
                this.alu.update(this.a, this.b)
                this.flagBus.reset()
                this.bus.reset()
            })
            this.dec.subscribe('reset-flags', () => {
                this.fr.reset()
            })
            this.dec.subscribe('reset', () => {
                this.sc.set('1110')
            })
        }
    
        this.isNeg = () => {
            return Boolean(Number(this.fr.value[NEG]))
        }
        this.isZero = () => {
            return Boolean(Number(this.fr.value[ZERO]))
        }
        this.isCarry = () => {
            return Boolean(Number(this.fr.value[CARRY]))
        }
        
        this.reset = () => {
            this.a.reset()
            this.b.reset()
            this.i.reset()
            this.pc.reset()
            this.fr.reset()
            this.sc.reset()
            this.mr.reset()
            for(let i = 0; i < 16; i ++){
                this.ram.set(i, '00000000')
            }
            this.alu.update(this.a, this.b)
        }
    
        this.run = () => {
            while(! this.halt){
                let s = `${this.i.upper()}${this.sc.value}`
                this.dec.exec(s, this.fr.value)
                this.sc.countOne()
                this.sc.countOne()
                sleep(this.delay)
            }
        }
        
        this.setDelay = delay => {
            this.delay = delay
        }
    
        this.setFPS = fps => {
            this.delay = Math.floor(1000/fps)
        }
    
        this.setLogging = log => {
            this.dec.canLog = log;
        }

    }
}