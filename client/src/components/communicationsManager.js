export async function getComandes(){
   const response= await fetch(`http://localhost:3001/getComandes`);
   const result = await response.json();
   return result;
}