const BASE_URL = 'http://localhost:8080';

const fetcher = async(path, method, body = null, isFormData = false) => {
    const token = localStorage.getItem('token');
    let payload;

    if(token && body && !isFormData){
        payload = {
            method: method,
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: body
        }
    }
    else if(token && body){
        payload = {
            method: method,
            headers: {
                Authorization: 'Bearer ' + token
            },
            body: body
        }
    }
    else if(body){
        payload = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        }
    }
    else if(token){
        payload = {
            method: method,
            headers: {
                Authorization: 'Bearer ' + token
            }
        }
    }
    let result, finalResult;

    try{
        result = await fetch( BASE_URL + path, payload );

        finalResult = await result.json();
        console.log(finalResult);
        if(!(result.status === 200 || result.status === 201)){
           throw new Error('Error occurred!!');
        }
        return finalResult;
    }
    catch(error){
        console.log('Error is', error);
        return finalResult;
    } 
}

export default fetcher;