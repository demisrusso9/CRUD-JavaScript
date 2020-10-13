let list = JSON.parse(localStorage.getItem('favorites')) || [];
let dark = document.querySelector('.dark');
let deleteData = document.querySelector('.delete')
let input = document.querySelector('.input');
let btn = document.querySelector('.save');

input.onkeypress = (e) => (e.key === 'Enter') ? createItem() : createItem
btn.onclick = () => createItem()
deleteData.onclick = () => deleteSavedData()
dark.onclick = () => darkMode()

showSavedData();
searchItem();

if (localStorage.getItem('isDarkMode') === 'true') darkMode()

//CRUD
function createItem() {
    let input = document.querySelector('.input');

    if (!input.value.trim()) return;

    let obj = { id: Math.random() + 1, name: input.value }
    list.push(obj)

    input.value = "";
    input.focus()
    updateAll()
    saveLocalStorage()
}

function renameItem(id) {
    list.map(item => {
        if (item.id != id) return
        document.querySelector('.list').innerHTML = ""
        createRenameElement(item)
    })

}

function updateAll() {
    document.querySelector('.list').innerHTML = ""
    list.map(item => createElements(item))
    saveLocalStorage()
}

function deleteItem(id) {
    let array = list.filter(item => item.id != id)
    list = array;
    updateAll()
    saveLocalStorage()
}

function searchItem() {
    document.querySelector('.search').addEventListener('input', (e) => {
        let inputValue = (e.target.value.toLowerCase().trim());
        let filteredValues = list.filter(item => item.name.toLowerCase().includes(inputValue))

        document.querySelector('.list').innerHTML = ""
        filteredValues.map(item => createElements(item))
    })
}
//Local Storage
function saveLocalStorage() {
    localStorage.setItem('favorites', JSON.stringify(list))
}

function showSavedData() {
    list.map(item => createElements(item))
}

function deleteSavedData() {
    updateAll()
    list.filter(item => deleteItem(item.id))
    localStorage.clear();
}

// Utils Functions
function createElements({ id, name }) {
    let div = document.createElement('div')
    let p = document.createElement('p')
    let renameBtn = document.createElement('button');
    let deleteBtn = document.createElement('button');

    renameBtn.textContent = 'Rename';
    deleteBtn.textContent = 'Delete';

    renameBtn.classList.add('btn', 'update-item')
    deleteBtn.classList.add('btn', 'delete-item')

    renameBtn.onclick = () => renameItem(id)
    deleteBtn.onclick = () => deleteItem(id)

    p.textContent = name;
    div.classList.add('item')
    div.append(p, renameBtn, deleteBtn)
    document.querySelector('.list').append(div)
}

function createRenameElement({ id, name }) {
    let input = document.createElement('input');
    let btn = document.createElement('button');
    let div = document.createElement('div');

    input.value = name;
    input.classList.add('input')

    btn.classList.add('btn', 'save-item')
    btn.textContent = 'Salvar';


    div.append(input, btn)
    document.querySelector('.list').append(div)
    input.focus()

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveUpdate(id, input.value);
        btn.onclick = () => saveUpdate(id, input.value);
    })
}

function saveUpdate(id, value) {
    list.map((item, i) => {
        if (item.id === id) list[i] = { id, name: value }
    })

    updateAll()
}

//Dark Mode
function darkMode() {
    let pageHeader = document.querySelector('.page-header');

    pageHeader.classList.contains('dark-mode-header') ?
        disableDarkMode() : enableDarkMode()
}

function enableDarkMode() {
    document.querySelector('.page-header').classList.add('dark-mode-header')
    document.querySelector('body').classList.add('dark-mode-body')
    document.querySelector('.list').classList.add('dark-mode-list')
    localStorage.setItem('isDarkMode', true);
}

function disableDarkMode() {
    document.querySelector('.page-header').classList.remove('dark-mode-header')
    document.querySelector('body').classList.remove('dark-mode-body')
    document.querySelector('.list').classList.remove('dark-mode-list')
    localStorage.setItem('isDarkMode', false);
}