import { dec2bin } from './Func.js'
export default function Hbyte(valor, name){
    this.value = valor
    this.name = name
    this.print = () => {
        console.log(`${this.name}: ${this.value}`)
    }

    this.dec = () => {
        const s = '0b' + this.value
        return Number(s)
    }

    this.set = arg => {
        if(arg.constructor.name == "Hbyte"){
            this.value = arg.value
        }else if(typeof arg == 'string'){
            this.value = arg
        }
    }

    this.out = bus => {
        bus.byte.value = `0000${this.value}`
    }

    this.in = bus => {
        this.set(bus.byte.lower())
    }

    this.countOne = () => {
        const num = this.dec() + 1
        this.value = dec2bin(num).substring(4)
    }
}