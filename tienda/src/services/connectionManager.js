
export async function getProductos(){
    const response= await fetch('http://localhost:3001/getProductes');
    const result= await response.json();
    return result;
}

export async function getTipos(){
    const response= await fetch('http://localhost:3001/getTipos');
    const result= await response.json();
    return result;
}