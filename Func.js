export const cl = (...args) => {
    let st = ''
    args.forEach(s => {
        st += `${s}`
    })
    console.log(st)
}
