let mainContainer = document.querySelector(".main_container");
let modalContainer = document.querySelector(".modal-container");
let colorBtn = document.querySelectorAll(".filter_color"); //Navbar-> Color Buttons
let plusButton = document.querySelector(".task-add"); // '+' button in Navbar
let crossBtn = document.querySelector(".task-delete");
let deleteState = false;

// local-Storage -> array of objects
let allTasks = []; 
// if local-Storage contains Task, then to Display it
if (localStorage.getItem("allTasks")) {
  let arrStr = localStorage.getItem("allTasks");
  allTasks = JSON.parse(arrStr);

  for (let i = 0; i < allTasks.length; i++) {
    let { id, color, task } = allTasks[i];
    // Create Task->for already Present Tasks
    createTask(color, task, false, id);
  }
}

// Add event-listener to Color-Button in Navbar
for (let i = 0; i < colorBtn.length; i++) {
  colorBtn[i].addEventListener('click', function (e) {
    let color = colorBtn[i].classList[1];// get color class at idx-1 in class-List

    mainContainer.style.backgroundColor = color; // set color-attribute of main-container
  });
}

// Modal-Container appears on click on-> '+' button
plusButton.addEventListener('click', createModal);
crossBtn.addEventListener('click', setDeleteState);

// call Func
// SetUp ModalContainer-> EventListners 
handleModal(modalContainer);

// make Modal visible
function createModal() {
  modalContainer.style.opacity = 1; // Modal appears
  modalContainer.classList.add("z_index"); // set z-index
}

// handle Modal-Filter and Modal-Content
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

  // Add eventListner on press->'Enter' on Modal-Content TextArea
  let textArea = document.querySelector('.modal-input');
  textArea.addEventListener('keydown', function (e) {
    if (e.key == 'Enter' && textArea.value != '') {
      let task = textArea.value;
      console.log(textArea.value + ' ', cColor);

      // Create Task-Card on 'Enter'-press
      createTask(cColor, task, true);

      // Set Modal-Container Back To Initial State i.e Reset Modal-Container
      textArea.value = "";  //Set Content-empty
      // Set default-Filter to 'black'
      modalFilter.forEach((filters) => {
        filters.classList.remove("border");
      })
      modalFilter[3].classList.add("border");
      cColor = 'black';
      modalContainer.style.opacity = 0;// Modal-Container Disappear
      modalContainer.classList.remove("z_index"); // reset-> z-index
    }
  })

}

// Create Task-Card
function createTask(color, task, flag, id) {
  // parameters, color-> Gives, task-filter bg-color
  // task-> Gives, task-desc
  // flag-> true- means new Task to be created , false- means just display existing task in local-storage

  // create-> unique-id
  let uid;
  if (id) {
    // id from array-> allTasks
    uid = id;
  } else {
    // craeting new id for new added-Task 
    uid = new ShortUniqueId();
    uid = uid();
  }


  let taskCard = document.createElement("div");
  taskCard.setAttribute("class", "task-card");
  taskCard.innerHTML = `<div class="task-filter ${color}"></div>
  <div class="task-content">
    <h3 class="uid">${uid}</h3>
    <div class="task-desc" contenteditable="true" >${task}</div>
  </div>`;

  mainContainer.appendChild(taskCard);  // append Task-card to Main-Container 

  // addEvent-> change Color of Task-Filter
  let taskFilter = taskCard.querySelector(".task-filter");
  taskFilter.addEventListener("click", changeColor);

  // addEvent-> Edit the Task Content
  let task_desc=taskCard.querySelector(".task-desc");
  task_desc.addEventListener("keypress",editTask);

  // set local storage, for new added Task
  if (flag) {
    let obj = {
      id: uid,
      color: color,
      task: task,
    };
    allTasks.push(obj);
    let data = JSON.stringify(allTasks);
    localStorage.setItem("allTasks", data);
  }

  // Delete Task-Card
  taskCard.addEventListener("click", deleteTask);
}

function changeColor(e) {
  // currentTarget->get element onto which listener was attached
  let taskFiter = e.currentTarget;
  let colors = ["pink", "blue", "green", "black"];
  let cColor = taskFiter.classList[1];  // current-Color

  let idx = colors.indexOf(cColor); // find-idx in array
  let newIdx = (idx + 1) % 4;
  let newColor=colors[newIdx];

  taskFiter.classList.remove(cColor); // remove old-color
  taskFiter.classList.add(newColor);// add new-color

  // Update Local-Storage for Color
  let taskContainer=taskFiter.parentNode;
  let uid=taskContainer.querySelector(".uid").innerText;
  for (let i = 0; i < allTasks.length; i++) {
    let { id } = allTasks[i];
    if (id == uid) {
      allTasks[i].color=newColor; // update Task-Desc
      let data = JSON.stringify(allTasks);
      localStorage.setItem("allTasks", data);
    }
  }

}

// Edit Task-Description/Content
function editTask(e){
  let task_desc=e.currentTarget;
  let uidEle=task_desc.parentNode.children[0]; // get Sibling-Element-> uid
  let uid=uidEle.innerText;

  // Edit content in Local-storage
  for (let i = 0; i < allTasks.length; i++) {
    let { id } = allTasks[i];
    if (id == uid) {
      let newTask=task_desc.innerText;
      allTasks[i].task=newTask; // update Task-Desc
      let data = JSON.stringify(allTasks);
      localStorage.setItem("allTasks", data);
    }
  }

}

// Set Delete State
function setDeleteState(e) {
  let crossBtn = e.currentTarget;
  if (deleteState == false) {
    crossBtn.classList.add("active");
    deleteState = true;
  } else {
    crossBtn.classList.remove("active");
    deleteState = false;
  }

}

// Delete Task-Card
function deleteTask(e) {
  let taskCard = e.currentTarget;
  // check deleteState
  if (deleteState) {
    taskCard.remove();
    // Remove from local-Storage
    let uid = taskCard.querySelector(".uid").innerText;
    for (let i = 0; i < allTasks.length; i++) {
      let { id } = allTasks[i];
      if (id == uid) {
        allTasks.splice(i, 1);// remove from array
        let data = JSON.stringify(allTasks);
        localStorage.setItem("allTasks", data);
      }
    }
  }

}






