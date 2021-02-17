import Byte from './Byte.js'
import { dec2bin } from './Func.js'

export default function ALU(){
    this.sum = (b1, b2) => {
        const v1 = b1.dec()
        const v2 = b2.dec()
        const sum = v1 + v2
        return dec2bin(sum)
    }
    
}