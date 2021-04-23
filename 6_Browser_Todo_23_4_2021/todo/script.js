let input= document.querySelector(".input_box");
let ul=document.querySelector(".task_list");

input.addEventListener("keydown",function(e){
  
  if(e.key=="Enter"){
    // console.log('event object',e);
    
    let task=input.value;
    console.log(task);
    let li= document.createElement('li');
    li.innerText=task;
    li.setAttribute("class","task");// set Attribute-> class

    // add event on 'li'-> double click
    li.addEventListener("dblclick",function(e){
      li.remove();  // remove- li element
    })

    ul.appendChild(li);
    input.value=""; // clear Input
  }
})