//function definition
function hello(param){
  console.log('Greetings everyone with', param);
  return 'returned val';
}

//function invocation
hello('Hi');
let rVal=hello('Hola');
console.log(rVal);
console.log('----------------------------');

// OBJECTS
//object-> its a key:value pair
//object consists of properties and methods
//Properties eg- name:'Steve'
//Methods eg- sayHi:function(param){..}, refer below obj for reference
let obj={}; // Empty object declaration
let obj={
  name:'Steve',
  age:35,
  address:{
    city:'Manhattan',
    state:'New York',
  },
  movies:['first avenger','civi war','end game'],
  sayHi:function(param){
    console.log(param,' Says Hi');
    return "returned blessings";
  }
}
console.log(obj.movies[0]);
console.log(obj.address.state);
let key="address";
console.log("we can get-property also using square brackets[]");
console.log(obj[key]); // we can get-property also using square brackets[]
console.log('----------------------------');
console.log('Function in an object',obj.sayHi('Captain'));//in Stack memory, first,sayHi() is executed,then console.log() 
                                                          //func is printed/executed,
                                                    //Same logic as in java for functions in a Stack Memory,ie, when the inner func completes executing then only the outer func can execute
console.log("-----------------------------------");
console.log('Set');
//set -> update
obj.age=45;
obj.friends=['Thor','Tony'];
console.log("obj-> ",obj);

console.log("-----------------------------------");
console.log('Delete');
//delete
delete obj.movies;
console.log("obj-> ",obj);

console.log("-----------------------------------");
console.log('For In Loop');
//For in loop is used for looping in an Object
for(let val in obj){
  console.log("key: ",val," | value: ",obj[val]); // we will use square brackets in loop [] as val is a string not the                                             // the actual key, so we cant write obj.val(it will undefined)
}