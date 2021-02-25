import Byte from './Byte.js'

export default function Memory(array){
    if(array){
        this.bytes = [];
        for(let i = 0 ; i < 16 ; i++){
            this.bytes[i] = new Byte(array[i])
        }
    }else{
        this.bytes = [];
        for(let i = 0 ; i < 16 ; i++){
            this.bytes[i] = new Byte('00000000')
        }
    }
    this.out = (add, bus) => {
        let address = this.getAdd(add)
        bus.byte.set(this.bytes[address])
    }

    this.in = (add, bus) => {
        let address = this.getAdd(add)
        this.bytes[address].set(bus.byte)
    }

    this.set = (add, val) => {
        let address = this.getAdd(add)
        this.bytes[address].set(val)
    }

    this.getAdd = thing => {
        let num = 0
        if(thing.constructor.name == 'Hbyte'){
            num = thing.dec()
        }else if(thing.constructor.name == 'Byte'){
            num = Number(`0b${thing.lower()}`)
        }else if(typeof thing == 'string'){
            num = Number(`0b${thing}`)
        }else if(typeof thing == 'number' && thing < 16){
            num = thing;
        }
        return num;
    }

}