export default function Byte(val, name){
    this.value = val
    this.name = name
    this.print = () => {
        console.log(`${this.name}: ${this.value}`)
    }

    this.lower = () => {
        return this.value.substring(4)
    }

    this.upper = () => {
        return this.value.substring(0, 4)
    }

    this.dec = () => {
        const s = `0b${this.value}`
        return Number(s)
    }

    this.set = arg => {
        if(arg.constructor.name == "Byte"){
            this.value = arg.value
        }else if(arg.constructor.name == "Hbyte"){
            this.value = `0000${arg.value}`
        }else if(typeof arg == 'string'){
            this.value = arg
        }
    }

    this.out = bus => {
        bus.byte.set(this)
    }

    this.in = bus => {
        this.set(bus.byte)
    }
}