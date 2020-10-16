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
selectOption()

if (localStorage.getItem('isDarkMode') === 'true') darkMode()

//CRUD
function createItem() {
  let input = document.querySelector('.input');

  if (!input.value.trim()) return alert('Não deixe o campo vazio')
  if (existsInArray(input.value)) return alert('Item já existente na lista, tente procurar com a busca')

  let obj = { id: Math.random() + 1, name: input.value, done: false }
  list.unshift(obj)

  input.value = "";
  updateAll()
  saveLocalStorage()
}

function renameItem(id) {
  list.map(item => {
    if (item.id == id) {
      clearListView()
      createRenameElement(item)
    }
  })
}

function updateAll() {
  clearListView()
  list.map(item => createElements(item))
  saveLocalStorage()
}

function deleteItem(id) {
  let array = list.filter(item => item.id != id)
  list = array;
  updateAll()
  saveLocalStorage()
}

//Search
function searchItem() {
  let search = document.querySelector('.search');

  search.addEventListener('input', (e) => {
    let value = (e.target.value.toLowerCase().trim());
    let filteredValues = list.filter(item => item.name.toLowerCase().includes(value))

    clearListView()
    filteredValues.map(item => createElements(item))
  })
}

function selectOption() {
  let select = document.querySelector('#selection');
  let all = document.querySelector('option[name="all"]').value;
  let todo = document.querySelector('option[name="todo"]').value;
  let done = document.querySelector('option[name="done"]').value;

  select.addEventListener('change', (e) => {
    clearListView()
    let option = e.target.value;

    if (option === all) updateAll()
    if (option === todo) list.map(item => !item.done ? createElements(item) : '')
    if (option === done) list.map(item => item.done ? createElements(item) : '')
  })
}

function itemDone(id) {
  let item = document.querySelectorAll('.item');
  item.forEach(element => element.addEventListener('click', () => element.classList.add('item-done')))

  list.map((item, i) => (item.id === id) ? list[i] = { ...list[i], done: true } : '')
  saveLocalStorage()
}

//Local Storage
function saveLocalStorage() {
  localStorage.setItem('favorites', JSON.stringify(list))
}

function showSavedData() {
  list.map(item => createElements(item))
}

function deleteSavedData() {
  if (list.length === 0) {
    alert('Não existe itens na lista para deletar!')
    return;
  }

  if (confirm('Tem certeza que gostaria de deletar todos os itens na lista?')) {
    clearListView()
    list.filter(item => deleteItem(item.id))
    localStorage.removeItem('favorites');
  }
}

// Utils Functions
function createElements({ id, name, done }) {
  let icons = createIcons(id);
  let div = itemsContainsDarkMode(done);
  let p = document.createElement('p')

  p.textContent = name;

  div.append(p, ...icons)
  document.querySelector('.list').append(div)
}

function createIcons(id) {
  let doneIcon = document.createElement('img');
  let renameIcon = document.createElement('img');
  let deleteIcon = document.createElement('img');

  doneIcon.setAttribute('src', "assets/icons/done.png");
  renameIcon.setAttribute('src', "assets/icons/edit.png");
  deleteIcon.setAttribute('src', "assets/icons/delete.png");

  doneIcon.classList.add('icon');
  renameIcon.classList.add('icon');
  deleteIcon.classList.add('icon');

  doneIcon.onclick = () => itemDone(id);
  renameIcon.onclick = () => renameItem(id);
  deleteIcon.onclick = () => deleteItem(id);

  return [doneIcon, renameIcon, deleteIcon];
}

function createRenameElement({ id, name }) {
  let input = document.createElement('input');
  let icon = document.createElement('img');
  let div = document.createElement('div');

  input.value = name;
  input.classList.add('input')

  icon.setAttribute('src', "assets/icons/edit.png")
  icon.classList.add('icon')

  div.classList.add('search-block')
  div.append(input, icon)
  document.querySelector('.list').append(div)
  input.focus()

  input.addEventListener('keypress', (e) => {
    e.key === 'Enter' ? saveUpdate(id, input.value) : icon.onclick = () => saveUpdate(id, input.value);
  })
}

function saveUpdate(id, value) {
  if (existsInArray(value)) return alert('Valor já existe na lista')

  list.map((item, i) => (item.id === id) ? list[i] = { ...list[i], name: value } : '')
  updateAll()
}

function clearListView() {
  document.querySelector('.list').textContent = "";
}

function existsInArray(value) {
  return list.some(item => item.name.toLowerCase() === value.toLowerCase());
}

//Dark Mode
function darkMode() {
  let pageHeader = document.querySelector('.page-header');

  pageHeader.classList.contains('dark-mode-header') ?
    disableDarkMode() : enableDarkMode()
}

function enableDarkMode() {
  let item = document.querySelectorAll('.item');

  document.querySelector('.page-header').classList.add('dark-mode-header')
  document.querySelector('body').classList.add('dark-mode-body')

  item.forEach(el => {
    el.classList.add('dark-mode-items');
    el.classList.contains('item-done') ? el.classList.add('item-done-dark') : '';
  })

  localStorage.setItem('isDarkMode', true);
}

function disableDarkMode() {
  let item = document.querySelectorAll('.item');

  document.querySelector('.page-header').classList.remove('dark-mode-header')
  document.querySelector('body').classList.remove('dark-mode-body')

  item.forEach(el => {
    el.classList.remove('dark-mode-items')
    el.classList.contains('item-done') ? el.classList.remove('item-done-dark') : '';
  })

  localStorage.setItem('isDarkMode', false);
}

function itemsContainsDarkMode(done) {
  let div = document.createElement('div');

  let pageHeader = document.querySelector('.page-header');
  pageHeader.classList.contains('dark-mode-header') ?
    div.classList.add('item', 'dark-mode-items') : div.classList.add('item')

  if (done) div.classList.add('item-done')

  return div;
}