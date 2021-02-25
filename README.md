# 8 BIT COMPUTER

A programmable 8 bit computer

## Using the computer
---
The entry point of the application is `main.js`
This file will ask for a `.bit` file in the same directory.

## THE .bit SYNTAX
 
The commands are: 
```
MOV x y -> used before the program starts to set data in RAM
LDA x -> set register A with the content of the address x of RAM
ADD x -> A = A + content of the address x of RAM
SUB x -> A = A - content of the address x of RAM
STA x -> store A in address x of RAM
JMP x -> Go to x° instruction (MOV are not counted)
JPN x -> Go to x if the previous math operation is negative
JPZ x -> Go to x if the previous math operation is zero
JPC x -> Go to x if the previous math operation is > 255
```

## Using the computer with javascript

```javascript
    import Computer from './components/Computer.js'
    const comp = new Computer()
    comp.setFPS(value: int) // Set computer operation per second
    comp.setDelay(value: int) // Set computer delay, in ms, between each operation
    comp.setLoggin(value: boolean) // Set if computer logs every operation
    c = {}
    for(let command in comp.commands){
        c[command] = comp.commands[command].hbyte // Transforms commands in 4bits(Half-Byte)
    }
    comp.ram.set(address, value)
    comp.ram.set('0000', `${c.LDA}0001`) // 00010001
    comp.ram.set(1     , `${c.ADD}1111`)// ram.set accepts numbers and 4bit strings
    //After everything is set run the computer
    comp.run()

```
