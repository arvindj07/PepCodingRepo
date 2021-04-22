// array is a collection of any-kind of data

//Actually, array is an Object in javascript which we can use as an Array, but it is internally an Object
//Array is emulated using Object
let arr=[
  1,
  1.1,
  "String",
  null,
  true,
  {name:'Arvind'},
  [1,2,3,4],
  function sayHi(){
    console.log('Say hi');
    return 'Returned hi';
  }
];
console.log('displaying array and its elements');
console.log(arr);
console.log('value at idx 3-> ',arr[3]);
console.log('value at idx 5-> ',arr[5].name);
console.log('value at idx 7-> ',arr[7]()); // calling func sayHi()

console.log('------------------------------');
console.log('For loop');
//for loop as in Java
for(let i=0;i<arr.length;i++){
  console.log(arr[i]);
}

console.log('------------------------------');
console.log('For Update idx 5');
//Update
arr[5]="updated";

console.log('------------------------------');
console.log('For In Loop');
//For each loop works similarly like in Object
// here 'key' represents the idx and 'value' represents the value at that idx-> arr[key]
for(let key in arr){
  console.log('key: ',key ,' | value: ',arr[key]);
}

console.log('------------------------------');
console.log('Proof that array is internally an Object');
//Adding values at Random idx
arr[45]="some val";
arr['invalid idx']="still gets added";

console.log(arr); // Displaying the whole array
console.log('Array length',arr.length);

//Check-out Adapter Design Pattern

const a=[1,2,3];
// gives error as we cant change value of const
// a=[2,3];

// its possible as we are not changing 'a', but changing a value inside 'a'
//basically 'a' contains address, but a[0] contains value, 
a[0]=-1;

console.log(a);

// addLast-> push()
// removevLast-> pop()

// addFirst-> unshift()
// removevFirst-> shift()

//split(),join(),slice(),splice()
let string = "This is a string to be searched";

//split()-> string to array of strings using separator
// let strArr= string.split(" "); //here space is the seperator
// console.log(strArr);

//join()-> array of string to string using separator
// let joinedStr= strArr.join("+"); // '+' would be used bw each string to joiin them together
// console.log(joinedStr);

//slice(i,j)-> sliced copy of an array from i to j-1
// let sliced=arr.slice(2,4); // idx 4 is exclusive
// console.log(sliced);

//splice(i,j)-> to REMOVE elements from an Array , i-> start idx, j-> no. of elements
// let spliced=arr.splice(2,2);
// console.log(spliced);


