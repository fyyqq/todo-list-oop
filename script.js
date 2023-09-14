
function deleteList(event) {
    event.preventDefault();

    const listElement = Action.getList(event);
    listElement.remove();
    const listId = listElement.getAttribute('data-id');
    const filterObj = todoArray.filter(todo => {
        return todo.id.toString() != listId;
    });
    UI.emptyList();
    todoArray = filterObj;
    return localStorage.setItem('todo', JSON.stringify(todoArray));
}

function editList(event) {
    event.preventDefault();
    const thisIcon = event.currentTarget;

    const listElement = Action.getList(event);
    listElement.className += ' border-warning shadow';
    const inputList = listElement.querySelector('input');
    inputList.removeAttribute('readonly', true);
    inputList.focus();

    thisIcon.classList.add('d-none');
    thisIcon.nextElementSibling.classList.remove('d-none');
}

class Storage {
    static addStorage(data) {
        return localStorage.setItem('todo', JSON.stringify(data));
    }
    static getStorage() {
        return localStorage.getItem('todo') === null ? [] : JSON.parse(localStorage.getItem('todo'));
    }
    static clearStorage() {
        return localStorage.clear(this.getStorage());
    }
    static updateListStorage(id, text) {
        todoArray.find(list => {
            if (list.id == id) {
                return list.todo = text;
            }
        });
        this.addStorage(todoArray);
    }
}

const form = document.getElementById('form');
const input = form.querySelector('input');
const empty_list = document.getElementById('empty_list');

let todoArray = Storage.getStorage();

window.addEventListener('DOMContentLoaded', () => {
    UI.displayData(todoArray);
    UI.emptyList();
    Action.editList();
});


form.addEventListener('submit', e => {
    e.preventDefault(); 
    const randomId = Math.random() * 100000;
    
    const checkValue = input.value.trim() ? true : false;
    
    if (checkValue) {
        const todo = new Todo(randomId, input.value);
        todoArray = [...todoArray, todo];
        UI.displayData(todoArray);
        Storage.addStorage(todoArray);
    }
    
    UI.warningValue(checkValue);
    input.value = '';
    input.focus();
    Storage.getStorage();

    UI.emptyList();
});

class Todo {
    constructor(id, todo) {
        this.id = id;
        this.todo = todo;
    }
}

const list_container = document.getElementById('lists');
const list = document.getElementById('list');

class UI {
    static displayData(todoList) {
        while (list_container.firstChild) {
            list_container.removeChild(list_container.firstChild);
        }
        todoList.forEach(item => {
            const copyList = list.cloneNode(true);
            copyList.setAttribute('data-id', item.id);
            copyList.classList.remove('d-none');
            copyList.querySelector('input').value = item.todo;
            list_container.prepend(copyList);
        });

    }
    static warningValue(bool) {
        if (!bool) {
            input.classList.add('border-danger');
            setTimeout(() => {
                input.classList.remove('border-danger');
            }, 1500);
        }
    }
    static emptyList() {
        const listsElement = list_container.children;

        let getAllElement = [];
        for (let i = 0; i < listsElement.length; i++) {
            if (!listsElement[i].className.includes('d-none')) {
                getAllElement.push(listsElement[i]);
            }
        }

        if (getAllElement.length < 1) {
            empty_list.classList.remove('d-none');
        } else {
            empty_list.classList.add('d-none');
        }
    }
}


class Action {
    static getList(event) {
        const list = event.currentTarget;
        return list.parentElement.parentElement.parentElement;
    }
    static editList() {
        const formUpdate = document.querySelectorAll('#updateList');
        formUpdate.forEach(form => {
            form.addEventListener('submit', event => {
                event.preventDefault();

                const thisForm = event.currentTarget;
                Storage.updateListStorage(thisForm.parentElement.getAttribute('data-id'), thisForm.querySelector('input').value);
                
                const input = thisForm.querySelector('input');
                if (input.value.length > 0) {
                    thisForm.parentElement.classList.remove('border-warning');
                    thisForm.parentElement.classList.remove('border-danger');
                    this.updateList(thisForm, input.value);
                } else {
                    thisForm.parentElement.classList.add('border-danger');
                }
            });
        });
    }
    static updateList(element, text) {
        const list_container = element.parentElement;
        list_container.classList.add('border-success');
        list_container.classList.remove('shadow');
        setTimeout(() => {
            list_container.classList.remove('border-success');
        }, 1000);
        const input = element.querySelector('input');
        const updateBtn = element.querySelectorAll('#todoAction')[1];
        const editBtn = element.querySelectorAll('#todoAction')[0];
        input.value = text;
        input.setAttribute('readonly', true);
        updateBtn.classList.add('d-none');
        editBtn.classList.remove('d-none');
    }
}


function deleteAll() {
    const lists = list_container.children;

    let getAllElement = [];
    for (let i = 0; i < lists.length; i++) {
        if (!lists[i].className.includes('d-none')) {
            getAllElement.push(lists[i]);
        }
    }

    const checkDelete = confirm('Really Nugget ?');
    if (checkDelete) {
        getAllElement.forEach(element => {
            element.remove();
            Storage.clearStorage()
        });
    }

    UI.emptyList();    
}






