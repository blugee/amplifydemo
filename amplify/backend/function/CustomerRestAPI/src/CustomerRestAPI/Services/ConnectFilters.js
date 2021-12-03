
const connectByAnd = (f1, f2) => {
    return `${f1} and ${f2}`
}

const connectByOr = (f1, f2) => {
    return `${f1} or ${f2}`
}

const Connecters = {
    connectByAnd,
    connectByOr
}


module.exports = Connecters