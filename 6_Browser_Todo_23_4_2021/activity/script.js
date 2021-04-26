let mainContainer = document.querySelector(".main_container");
let modalContainer = document.querySelector(".modal-container");
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
addTask.addEventListener('click', createModal);

// make Modal visible
function createModal() {
  modalContainer.style.opacity = 1; // Modal appears

  // handle Modal-Filter and Modal-Content
  handleModal(modalContainer);

}

function handleModal(modalContainer) {
  // ADD border To Modal-Filter

  let cColor = "black"; //default color of Modal-Filter-> current-Color
  let modalFilter = document.querySelectorAll(".modal-filter");
  modalFilter[3].classList.add("border");  // set border of last filter(i.e, black) by default

  // Add eventListner to each Modal-Filter -> click
  for (let i = 0; i < modalFilter.length; i++) {
    modalFilter[i].addEventListener('click', function (e) {
      // remove border class from all Filters
      // forEach() is kind of looping on modalFilter
      modalFilter.forEach((filters) => {
        filters.classList.remove("border");
      })

      // set border to currently-clicked Filter
      modalFilter[i].classList.add("border");

      let color = modalFilter[i].classList[1];// color of clicked-Filter
      cColor = color; // set current-Color;
      // console.log(cColor);
    })

  }

  // press 'Enter' on Modal-Content TextArea
  let textArea = document.querySelector('.modal-input');

  textArea.addEventListener('keydown', function (e) {
    if (e.key == 'Enter' && textArea.value != '') {
      let task=textArea.value;
      console.log(textArea.value + ' ', cColor);

      // Create Task-Card on 'Enter'-press
      createTask(cColor,task);

      // Set Modal-Container Back To Initial State
      // i.e Reset Modal-Container
      textArea.value = "";  //Set Content-empty
      // Set default-Filter to 'black'
      modalFilter.forEach((filters) => {
        filters.classList.remove("border");
      })
      modalFilter[3].classList.add("border");
      cColor = 'black';
      modalContainer.style.opacity = 0;// Modal-Container Disappear

      
    }
  })

}

// Create Task-Card
function createTask(color,task){
  // color-> Gives, task-filter bg-color
  // task-> Gives, task-desc
  let taskCard = document.createElement("div");
  taskCard.setAttribute("class", "task-card");
  taskCard.innerHTML = `<div class="task-filter ${color}"></div>
  <div class="task-content">
    <h3 class="uid">#Example</h3>
    <div class="task-desc">${task}</div>
  </div>`;

  mainContainer.appendChild(taskCard);  // append Task-card to Main-Container 
}







