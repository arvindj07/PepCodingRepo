let introduction= ['Hello','I','am','Tushar'];
// let greeting = introduction[0];
// let pronoun = introduction[1];
// let variable = introduction[2];
// console.log(greeting+" "+pronoun+" "+variable);
//////////////////////////////////////////Destructuring

// let [greeting,pronoun,variable,name] = introduction;
// console.log(greeting+" "+pronoun+" "+variable+" "+name);
// greeting='Hola';
// console.log(introduction);

////////////////////////skipping values

let [greeting,pronoun,,name]=introduction;
console.log(greeting+" "+pronoun+" "+name); 

/////////////////////////////////Default values

let arr =['Howdy'];
let [ab='hello',cd='bye',ef='say']=arr;
console.log(ab+" "+cd+" "+ef);

//////////////////////////////////swapping values

let a =3;
let b=6;
[a,b] =[b,a];
console.log(a);
console.log(b);

/////////////////////////// spread operator

let arr = [1,2,3,4,5,6,7,8,9,10,11];
let [fv,sv,tv,...narr]=arr;
// console.log(fv);
// console.log(sv);
// console.log(tv);
// console.log(narr);
narr[0] = 40;
console.log(narr);
console.log(arr);