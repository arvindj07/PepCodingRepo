let colorBtn=document.querySelectorAll(".filter_color");
let mainContainer=document.querySelector(".main_container");

for(let i=0;i<colorBtn.length;i++){
  colorBtn[i].addEventListener('click',function(e){
    let color=colorBtn[i].classList[1];// get color class at idx-1 in class-List

    mainContainer.style.backgroundColor=color; // set color-attribute of main-container
  });
}