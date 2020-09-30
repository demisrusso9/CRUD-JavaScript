let list = [];

document.querySelector('#add').addEventListener('click', createItem)

function createItem() {
    let input = document.querySelector('.input');

    let obj = { id: Math.random() + 1, name: input.value }
    list.push(obj)

    input.value = "";
    input.focus()
    updateAll()
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
    console.log(list);
}

function deleteItem(id) {
    let array = list.filter(item => item.id != id)
    list = array;
    updateAll()
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