import Byte from './Byte.js'
import { dec2bin } from './Func.js'
import Hbyte from './Hbyte.js'

export default function ALU(){
    this.sum = new Byte('00000000')
    this.sub = new Byte('00000000')
    this.sumFlags = new Hbyte('0000') // NEG, ZERO, CARRY, 0
    this.subFlags = new Hbyte('0000') // NEG, ZERO, CARRY, 0
    this.update = (b1, b2) => {
        const v1 = b1.dec()
        const v2 = b2.dec()
        const add = v1 + v2
        const dif = v1 - v2
        let pflags = {neg: '0', zero: '0', carry: '0'}
        let mflags = {neg: '0', zero: '0', carry: '0'}
        this.sum.set(dec2bin(add))
        this.sub.set(dec2bin(dif))
            if(add > 255){
                pflags.carry = '1'
            }
            if(add == 0){
                pflags.zero = '1'
            }
            if(dif == 0){
                mflags.zero = '1'
            }
            if(dif < 0){
                mflags.neg = '1'
            }
            let plus_string = `${pflags.neg}${pflags.zero}${pflags.carry}0`
            this.sumFlags.set(plus_string)
            let minus_string = `${mflags.neg}${mflags.zero}${mflags.carry}0`
            this.subFlags.set(minus_string)
    }

    this.outSum = (bus, flag_bus) => {
        bus.byte.set(this.sum)
        flag_bus.hbyte.set(this.sumFlags)
    }
    this.outSub = (bus, flag_bus) => {
        bus.byte.set(this.sub)
        flag_bus.hbyte.set(this.subFlags)
    }
    
}