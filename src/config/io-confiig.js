const protocol = 'http';
const host     = 'localhost';
const port     = '4000';

function getServerURL(){
    return `${protocol}://${host}:${port}`;
}

module.export  = {getServerURL};