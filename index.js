let list = JSON.parse(localStorage.getItem('favorites')) || [];

document.querySelector('.input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') createItem()
    document.querySelector('.add').addEventListener('click', createItem)
})

document.querySelector('.local').addEventListener('click', showSavedData);
document.querySelector('.delete').addEventListener('click', deleteSavedData);
document.querySelector('.dark').addEventListener('click', darkMode);

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
        createRenameElement(item)
    })
}

function updateAll() {
    document.querySelector('.list').innerHTML = ""
    list.map(item => createElements(item))    
}

function deleteItem(id) {
    let array = list.filter(item => item.id != id)
    list = array;
    updateAll()
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
function createElements(item) {
    let p = document.createElement('p')
    let renameBtn = document.createElement('button');
    let deleteBtn = document.createElement('button');

    renameBtn.textContent = 'Rename';
    deleteBtn.textContent = 'Delete';

    renameBtn.classList.add('btn', 'update')
    deleteBtn.classList.add('btn', 'delete')

    renameBtn.onclick = () => renameItem(item.id)
    deleteBtn.onclick = () => deleteItem(item.id)
    
    p.textContent = item.name;
    p.append(renameBtn, deleteBtn)
    document.querySelector('.list').appendChild(p)
}

function createRenameElement(item) {
    let input = document.createElement('input');
    let btn = document.createElement('button');
    let div = document.createElement('div');

    input.value = item.name;
    input.classList.add('input')

    btn.classList.add('btn', 'save')
    btn.textContent = 'Salvar';

    btn.onclick = () => saveUpdate(item.id, input.value);

    div.append(input, btn)
    document.querySelector('.list').append(div)
}

function saveUpdate(id, value) {
    list.map((item, i) => {
        if (item.id === id) list[i] = { id, name: value }
    })

    updateAll()
}

function darkMode() {
    document.querySelector('.page-header').classList.toggle('dark-mode-header')
    document.querySelector('body').classList.toggle('dark-mode-body')    
    document.querySelector('.list').classList.toggle('dark-mode-list')    
}