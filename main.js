import Computer from './Computer.js'

const comp = new Computer();
const c = {}
for(let i in comp.commands){
    c[i] = comp.commands[i].hbyte
}
comp.setFPS(60)
comp.setLogging(false)
comp.ram.set(0, `${c.LDA}1100`)
comp.ram.set(1, `${c.ADD}1111`)
comp.ram.set(2, `${c.STA}1100`)
comp.ram.set(3, `${c.LDA}1110`)
comp.ram.set(4, `${c.SUB}1101`)
comp.ram.set(5, `${c.JPZ}1000`)
comp.ram.set(6, `${c.STA}1110`)
comp.ram.set(7, `${c.JMP}0000`)
comp.ram.set(8, `${c.LDA}1100`)
comp.ram.set(9, `${c.OUT}0000`)
comp.ram.set(10, `${c.HLT}0000`)
comp.ram.set('1100', `00000000`)
comp.ram.set('1101', `00000001`)
comp.ram.set('1110', `00000111`)
comp.ram.set('1111', `00001001`)
comp.run();