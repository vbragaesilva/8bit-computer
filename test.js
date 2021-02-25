import Hbyte from "./Hbyte.js";
import Byte from "./Byte.js";

const bus = {
    hbyte: new Hbyte('1010')
}
const bigbus = {
    byte: new Byte('10101111')
}
const hbyte = new Hbyte('0000')
hbyte.in(bigbus)
console.log(hbyte.value)