import Byte from './Byte.js'
function dec2bin(num){
    let bin = num.toString(2)
    let len = bin.length
    let dif = 8 - len
    if(len < 8){
        let zeroes = '0'.repeat(dif)
        bin = zeroes + bin
    }else if (len > 8){
        bin = bin.substring(Math.abs(dif))
    }

    return bin
}

export default function ALU(){
    this.sum = (b1, b2) => {
        const v1 = b1.dec()
        const v2 = b2.dec()
        const sum = v1 + v2
        return dec2bin(sum)
    }
    
}