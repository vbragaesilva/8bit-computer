export const cl = (...args) => {
    let st = ''
    args.forEach(s => {
        st += `${s}`
    })
    console.log(st)
}

export const dec2bin = (num) => {
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


export const delay = ms =>  {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < ms);
}