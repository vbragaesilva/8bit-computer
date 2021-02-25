import Byte from './Byte.js'
// import { dec2bin } from './Func.js'
const NEG = 0
const ZERO = 1
const CARRY = 2
function logIt(name){
    if(name == 'comi') console.log('pc > mr')
    if(name == 'roiice') console.log('ram > i; pc+')
    if(name == 'iomi') console.log('i > mr')
    if(name == 'roai') console.log('ram > a')
    if(name == 'halt') console.log('halt')
    if(name == 'robi') console.log('ram > b')
    if(name == 'eoai') console.log('alu +> a')
    if(name == 'aooi') console.log('a > out')
    if(name == 'aori') console.log('a > ram')
    if(name == 'ioai') console.log('i > a')
    if(name == 'ioci') console.log('i > pc')
    if(name == 'sueoai') console.log('alu -> a')
    if(name == 'reset-flags') console.log('0000 > fr')
    if(name == 'reset') console.log('0000 > sc')

}

export default class Decoder {
    constructor() {
        this.notifyNames = { nothing: [() => { } ] }
        this.values = []
        this.canLog = false
        for (let i = 0; i < 256; i++) {
            // let s = dec2bin(i)
            this.values[i] = new Byte('00000000')
        }
        this.subscribe = (name, callback) => {
            if (!this.notifyNames[name]) {
                this.notifyNames[name] = []
            }
            this.notifyNames[name].push(callback)
        }
        this.notifyAll = (name) => {
            for (let index in this.notifyNames[name]) {
                let callback = this.notifyNames[name][index]
                if (callback) {
                    if (name == 'nothing') {
                        if (this.canLog)
                            console.log(`DECODER: -`)
                    }
                    else {
                        if (this.canLog)
                            logIt(name)
                    }
                    callback()
                }
            }
        }
        this.exec = (byteString, flags = '0000') => {
            const l = byteString.substring(4)
            const u = byteString.substring(0, 4)
            if (l == '0000') { // FETCH
                this.notifyAll('comi')
            }
            else if (l == '0010') {
                this.notifyAll('roiice')
            }
            if (u == '0001') { // LDA
                if (l == '0100')
                    this.notifyAll('iomi')
                if (l == '0110')
                    this.notifyAll('roai')
                if (l == '1000')
                    this.notifyAll('reset')
            }
            if (u == '0010') { // ADD
                if (l == '0100')
                    this.notifyAll('iomi')
                if (l == '0110')
                    this.notifyAll('robi')
                if (l == '1000')
                    this.notifyAll('eoai')
                if (l == '1010')
                    this.notifyAll('reset')
            }
            if (u == '0011') { // SUB
                if (l == '0100')
                    this.notifyAll('iomi')
                if (l == '0110')
                    this.notifyAll('robi')
                if (l == '1000')
                    this.notifyAll('sueoai')
                if (l == '1010')
                    this.notifyAll('reset')
            }
            if (u == '0100') { // STA
                if (l == '0100')
                    this.notifyAll('iomi')
                if (l == '0110')
                    this.notifyAll('aori')
                if (l == '1000')
                    this.notifyAll('reset')
            }
            if (u == '0101') { // LDI
                if (l == '0100')
                    this.notifyAll('ioai')
                if (l == '0110')
                    this.notifyAll('reset')
            }
            if (u == '0110') { // JMP
                if (l == '0100')
                    this.notifyAll('ioci')
                if (l == '0110')
                    this.notifyAll('reset')
            }
            if (u == '0111') { // JPN
                if (l == '0100' && flags[NEG] == '1')
                    this.notifyAll('ioci')
                if (l == '0110')
                    this.notifyAll('reset-flags')
                if (l == '1000')
                    this.notifyAll('reset')
            }
            if (u == '1000') { // JPZ
                if (l == '0100' && flags[ZERO] == '1')
                    this.notifyAll('ioci')
                if (l == '0110')
                    this.notifyAll('reset-flags')
                if (l == '1000')
                    this.notifyAll('reset')
            }
            if (u == '1001') { // JPC
                if (l == '0100' && flags[CARRY] == '1')
                    this.notifyAll('ioci')
                if (l == '0110')
                    this.notifyAll('reset-flags')
                if (l == '1000')
                    this.notifyAll('reset')
            }
            if (u == '1110') { // OUT
                if (l == '0100')
                    this.notifyAll('reset-flags')
                if (l == '0110')
                    this.notifyAll('aooi')
                if (l == '1000')
                    this.notifyAll('reset')
            }
            if (u == '1111') { // HLT
                this.notifyAll('halt')
            }
        }
    }
}
