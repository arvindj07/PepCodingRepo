let mainContainer = document.querySelector(".main_container");
let modalContainer= document.querySelector(".modal-container");
let colorBtn = document.querySelectorAll(".filter_color"); //Navbar-> Color Buttons
let addTask = document.querySelector(".task-add"); // '+' button in Navbar

// Add event-listener to Color-Button in Navbar
for (let i = 0; i < colorBtn.length; i++) {
  colorBtn[i].addEventListener('click', function (e) {
    let color = colorBtn[i].classList[1];// get color class at idx-1 in class-List

    mainContainer.style.backgroundColor = color; // set color-attribute of main-container
  });
}

// Modal-Container appears on click on-> '+' button
addTask.addEventListener('click',function(){
  modalContainer.style.opacity=1;
})

// remember to reset modal-Container to empty and back to default selections



