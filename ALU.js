import Byte from './Byte.js'
import { dec2bin } from './Func.js'

export default function ALU(){
    this.sum = new Byte('00000000')
    this.sub = new Byte('00000000')
    this.update = (b1, b2) => {
        const v1 = b1.dec()
        const v2 = b2.dec()
        const add = v1 + v2
        const dif = v1 - v2
        this.sum.set(dec2bin(add))
        this.sub.set(dec2bin(dif))
    }

    this.outSum = bus => {
        bus.byte.set(this.sum)
    }
    this.outSub = bus => {
        bus.byte.set(this.sub)
    }
    
}