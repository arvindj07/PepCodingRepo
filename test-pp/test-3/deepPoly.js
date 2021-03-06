
let person = {
    firstName: 'John',
    lastName: 'Doe',
    address: {
        street: 'North 1st street',
        city: 'San Jose',
        state: 'CA',
        country: 'USA'
    },
    movies: ["Die hard", "First Avenger"]
};
let superClone = (object) => {
    let cloning = {};
    // [fn,lastName,address]
    Object.keys(object).map((prop) => {
        if (Array.isArray(object[prop])) { // array
            // copy array 
            // cloning[prop]= [].concat(object[prop]);
            
            // let newArr = [];
            // for (let i = 0; i < object[prop].length; i++) {
            //     newArr.push(object[prop][i]);
            // }
            // cloning[prop]=newArr;
            cloning[prop]=[...object[prop]];
        } else if (typeof object[prop] === "object") {
            cloning[prop] = superClone(object[prop]);   // object
        } else cloning[prop] = object[prop];        // value
    });

    return cloning;
};
let topLevelObject = superClone(person);
person.address.street = "12";
person.lastName = "Rogers";
topLevelObject.firstName = "Steve";
console.log("person", person);
console.log("top level ", topLevelObject);

