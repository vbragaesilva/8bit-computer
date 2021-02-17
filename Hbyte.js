
export default function Hbyte(valor){
    this.value = valor

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
}