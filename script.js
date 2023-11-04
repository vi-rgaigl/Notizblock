
function render() {
    let content = document.getElementById('content');
    content.innerHTML = '';
    initArrays();
    openPostSection();
    renderPosts();
}


function renderPosts() {
    let titlesArray = getArray('titles');
    let postsArray = getArray('posts');
    for (let i = 0; i < postsArray.length; i++) {
        content.innerHTML += generatePostHTML(titlesArray, postsArray, i);
        document.getElementById(`input-title-${i}`).readOnly = true;
        document.getElementById(`textarea-${i}`).readOnly = true;
    }
}


function renderTrashes() {
    let content = document.getElementById('content');
    content.innerHTML = '';
    let deleteTitlesArray = getArray('delete-titles');
    let deletePostsArray = getArray('delete-posts');
    for (let i = 0; i < deletePostsArray.length; i++) {
        content.innerHTML += generateTrashsHTML(deleteTitlesArray, deletePostsArray, i); 
    }
}


function openPostSection() {
    let container = document.getElementById('input-section');
    container.innerHTML = '';
    container.innerHTML += generatePostSectionHTML();
}


function openInputSection() {
    let container = document.getElementById('input-section');
    container.innerHTML = generateInputSectionHTML();
}


function openUpdateInput(i) {
    document.getElementById(`input-title-${i}`).readOnly = false;
    document.getElementById(`textarea-${i}`).readOnly = false;
    document.getElementById(`input-title-${i}`).classList.add('update-border');
    document.getElementById(`textarea-${i}`).classList.add('update-border');
    let button = document.getElementById(`tooltip-${i}`);
    button.innerHTML = generateUpdateInputHTML(i);
}


function openTrashSection() {
    let container = document.getElementById('input-section');
    container.innerHTML = generateTrashSectionHTML();
    renderTrashes();
}

// start CRUD functions
function addPost() {
    let title = document.getElementById('input-title');
    let post = document.getElementById('textarea');
    if (isEmtpy(title, post)) {
        let titlesArray = getArray('titles');
        let postsArray = getArray('posts');
        titlesArray.push(title.value);
        postsArray.push(post.value);
        savePosts(titlesArray, postsArray);
        render();
        title.value = '';
        post.value = '';
    }
}


function deletePost(i) {
    let titlesArray = getArray('titles');
    let postsArray = getArray('posts');
    let deleteTitlesArray = getArray('delete-titles');
    let deletePostsArray = getArray('delete-posts');
    deleteTitlesArray.push(titlesArray[i]);
    deletePostsArray.push(postsArray[i]);
    titlesArray.splice(i, 1);
    postsArray.splice(i, 1);
    savePosts(titlesArray, postsArray);
    saveTrashes(deleteTitlesArray, deletePostsArray);
    render();
}


function moveToPosts(i) {
    let titlesArray = getArray('titles');
    let postsArray = getArray('posts');
    let deleteTitlesArray = getArray('delete-titles');
    let deletePostsArray = getArray('delete-posts');
    titlesArray.push(deleteTitlesArray[i]);
    postsArray.push(deletePostsArray[i]);
    deleteTitlesArray.splice(i, 1);
    deletePostsArray.splice(i, 1);
    savePosts(titlesArray, postsArray);
    saveTrashes(deleteTitlesArray, deletePostsArray);
    renderTrashes();
    render();
}


function updatePost(i) {
    let titlesArray = getArray('titles');
    let postsArray = getArray('posts');
    document.getElementById(`input-title-${i}`).readOnly = false;
    document.getElementById(`textarea-${i}`).readOnly = false;
    let title = document.getElementById(`input-title-${i}`).value;
    let post = document.getElementById(`textarea-${i}`).value;
    titlesArray[i] = title;
    postsArray[i] = post;
    savePosts(titlesArray, postsArray);
    render();
}


function deletePostFromTrash(i) {
    let deleteTitlesArray = getArray('delete-titles');
    let deletePostsArray = getArray('delete-posts');
    deleteTitlesArray.splice(i, 1);
    deletePostsArray.splice(i, 1);
    saveTrashes(deleteTitlesArray, deletePostsArray);
    renderTrashes();
}


function deleteAllFromTrash() {
    setArray('delete-titles', []);
    setArray('delete-posts', []);
    renderTrashes();
}


function savePosts(titles, posts) {
    setArray('titles', titles);
    setArray('posts', posts);
}


function saveTrashes(titles, posts) {
    setArray('delete-titles', titles);
    setArray('delete-posts', posts);
}
// end CRUD functions


// HTML code templates
function generatePostHTML(titlesArray, postsArray, i) {
    return /*html*/ `
        <div id="post-${i}" class="post">
            <div class="title-post">
                <input id="input-title-${i}" type="text" placeholder="Titel" value="${titlesArray[i]}">  
            </div>
            <div class="text-area-container">
                <textarea id="textarea-${i}" class="textarea" placeholder="Notiz schreiben">${postsArray[i]}</textarea>       
                <div class="crud-button">
                    <div id="tooltip-${i}" class="tooltip">
                        <button id="button-${i}" onclick="openUpdateInput(${i})"><img src="./img/pen.png" alt=""></button>
                        <span id="tooltiptext-${i}" class="tooltiptext">Bearbeiten</span>
                    </div>
                    <div class="tooltip">
                        <button onclick="deletePost(${i})"><img src="./img/cross.png" alt=""></button>
                        <span class="tooltiptext">Löschen</span>
                    </div>     
                </div>  
            </div>   
        </div>
    `;
}


function generateTrashsHTML(deleteTitlesArray, deletePostsArray, i) {
    return /*html */ `
        <div id="trash-${i}" class="post">
            <div>
                <h3>${deleteTitlesArray[i]}</h3>
                ${deletePostsArray[i]}
            </div>
            <div class="crud-button">
                <div class="tooltip">
                    <button onclick="moveToPosts(${i})"><img src="./img/ok.png" alt=""></button>
                    <span class="tooltiptext">Wiederherstellen</span>
                </div>
                <div class="tooltip">
                    <button onclick="deletePostFromTrash(${i})"><img src="./img/cross.png" alt=""></button>
                    <span class="tooltiptext">Entgültig Löschen</span>
                </div>            
            </div>     
        </div>
    `;
}


function generateInputSectionHTML() {
    return /*html */ `
         <div id="input-big" class="input-big">
            <div class="title-post">
                <input id="input-title" type="text" placeholder="Titel">  
            </div><div class="text-area-container">
                <textarea id="textarea" class="textarea" placeholder="Notiz schreiben"></textarea>
                <div class="crud-button">
                    <div class="tooltip">
                            <button onclick="addPost()"><img src="./img/save.png" alt=""></button>
                            <span class="tooltiptext">Speichern</span>
                        </div>
                    <div class="tooltip">
                        <button onclick="openPostSection()"><img src="./img/close.png" alt=""></button>
                        <span class="tooltiptext">Schließen</span>
                    </div>
                </div>
            </div>         
        </div>   
    `;
}


function generatePostSectionHTML() {
    return /*html */ `
        <div onclick="openInputSection()" class="input-small">
            <textarea class="textarea" placeholder="Notiz schreiben"></textarea>
        </div>
    `;
}


function generateUpdateInputHTML(i) {
    return /*html */ `
        <button id="button-${i}" onclick="updatePost(${i})"><img src="./img/save.png" alt=""></button>
        <span id="tooltiptext-${i}" class="tooltiptext">Speichern</span>   
    `;
}


function generateTrashSectionHTML() {
    return /*html */ `
        <h2>Papierkorb</h2>
        <button onclick="deleteAllFromTrash()" class="trash-button">Papierkorb leeren</button>
    `;
}


function openNavBar() {
    document.getElementById('nav-bar').classList.toggle('hide-nav');
}


function closeNavBar() {
    document.getElementById('nav-bar').classList.toggle('hide-nav');
}


//helper functions
function initArrays() {
    let titles = ['42'];
    let posts = ['Die Antwort auf ALLES!'];
    let deleteTitles = [];
    let deletePosts = [];
    if (getArray('posts') === null) {
        setArray('titles', titles);
        setArray('posts', posts);
    }
    if (getArray('delete-posts') === null) {
        setArray('delete-titles', deleteTitles);
        setArray('delete-posts', deletePosts);
    }
}


function setArray(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
}


function getArray(key) {
    return JSON.parse(localStorage.getItem(key));
}


function isEmtpy(title, post) {
    if (post.value == '' || title.value == '') {
        alert('Macht eine Notiz ohne Titel oder Inhalt Sinn?');
        return false;
    }
    return true;
}
