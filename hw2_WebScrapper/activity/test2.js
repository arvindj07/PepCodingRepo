// let arr=[1,2,3,4];

// function f(arr){
//   let narr=[...arr];
//   for(x in narr){
//     narr[x]=0
//   }
//   return narr;
// }

// console.log(arr);

// console.log(f(arr));

// console.log(arr);

//-------------------------

// let obj={
//   1:0,
//   2:1,
//   3:2,
//   4:3,
//   5:4,
//   length:5,
// };

// function f(){
//   let nobj=JSON.parse(JSON.stringify(obj)); 

//   for(let i=1;i<nobj.length;i++){
//     nobj[i]=nobj[i]+1;
//   }

//   delete nobj["length"];
  
//   return nobj;
// }

// function g(f){
//   let n1obj={...f()};
//   for(let x in n1obj){
//     console.log(`at index ${x} we  have value ${n1obj[x]}`);
//   }
// }

// g(f);

//-----------

// function f(x,y){
//   return x*y;
// }

// function f(x){
//   return function (y){
//     return x*y;
//   }
// }

// console.log(f(2)(3));
