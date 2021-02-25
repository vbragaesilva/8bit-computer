export const cl = (...args) => {
    let st = ''
    args.forEach(s => {
        st += `${s}`
    })
    console.log(st)
}

export const dec2bin = (num, bits = 8) => {
    let bin = num.toString(2)
    bin = bin.replace('-', '')
    let len = bin.length
    let dif = bits - len
    if(len < bits){
        let zeroes = '0'.repeat(dif)
        bin = zeroes + bin
    }else if (len > bits){
        bin = bin.substring(Math.abs(dif))
    }
    return bin
}


export const sleep = ms =>  {
    if(ms != 0){
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < ms);
    }
}