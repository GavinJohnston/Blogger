const uri = '';

displayCategories();
viewPosts();

function updateBlogTitle() {

    var formData = new FormData(document.getElementById("titlesForm"));

    var json = JSON.stringify(Object.fromEntries(formData));

    const formValues = JSON.parse(json);

    const item = {
        Id: 1,
        MainHeader: `${formValues.headerName}`,
        SubHeader: `${formValues.subHeaderName}`,
        Title: `${formValues.titleName}`
    }

    fetch(`${uri}/Info/${item.Id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .catch(error => console.error('Unable to update item.', error));    
}

async function createCategory() {
    const addCat = document.getElementById("addCat");

    const item = {
        name: `${addCat.value}`,
        Binned: false
    }

    fetch(`${uri}/Categories`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => {
            displayCategories();
        })
    .catch(error => console.error('Unable to add item.', error));

    addCat.value = null;
}

async function getCategories() {

    let data = await fetch(`${uri}/Categories`)
        .then(response => response.json())

    
    return data;
}

async function getPosts() {
    let data = await fetch(`${uri}/Posts`)
        .then(response => response.json())
    return data;
}

async function displayCategories() {
    const BinnedList = document.getElementById("catListBinned");
    const catLists = document.getElementsByClassName("catLists");

    const data = await getCategories();

    for (var i = 0; i < catLists.length; i++) {
        while (catLists[i].firstChild) {
            catLists[i].removeChild(catLists[i].firstChild);
        }
    }

    while (BinnedList.firstChild) {
        BinnedList.removeChild(BinnedList.firstChild);
    }

    data.forEach(item => {
        if (item.binned == false) {

            for (var i = 0; i < catLists.length; i++) {

                let node = document.createElement("option");
                node.setAttribute("value", `${item.name}`);
                node.innerHTML = `${item.name}`;

                catLists[i].appendChild(node);
            }

        } else {
            const node = document.createElement("option");
            node.setAttribute("value", `${item.name}`);
            node.innerHTML = `${item.name}`;

            BinnedList.appendChild(node);
        }
    })
}

async function binCategory() {

    let categories = await getCategories();

    let catName = document.getElementById("binCatList").value;

    var categoryId;

    for (let i = 0; i < categories.length; i++) {
        if (categories[i].name == catName) {
            categoryId = categories[i].id;
        }
    }

    fetch(`categories/${categoryId}`, {
        method: 'PATCH',
        body: JSON.stringify(
            [
                {
                    "path": "/Binned",
                    "value": true,
                    "op": "replace"
                }
            ]),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then(() => {
            displayCategories()
        })
        .catch(error => console.error('Unable to update item.', error));
}

async function recoverCategory() {

    let categories = await getCategories();

    let catName = document.getElementById("catListBinned").value;

    var categoryId;

    for (let i = 0; i < categories.length; i++) {
        if (categories[i].name == catName) {
            categoryId = categories[i].id;
        }
    }

    fetch(`categories/${categoryId}`, {
        method: 'PATCH',
        body: JSON.stringify(
            [
                {
                    "path": "/Binned",
                    "value": false,
                    "op": "replace"
                }
            ]),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then(() => {
            displayCategories()
        })
        .catch(error => console.error('Unable to update item.', error));
}

async function deleteCategory(id) {

    let categories = await getCategories();

    let catName = document.getElementById("catListBinned").value;

    var categoryId;

    for (let i = 0; i < categories.length; i++) {
        if (categories[i].name == catName) {
            categoryId = categories[i].id;
        }
    }

    fetch(`${uri}/categories/${categoryId}`, {
        method: 'DELETE'
    })
        .then(() => {
            displayCategories()
        })
        .catch(error => console.error('Unable to delete item.', error));
}

/** CREATE POST **/

async function generatePost() {

    var formData = new FormData(document.getElementById("postContent"));

    var json = JSON.stringify(Object.fromEntries(formData));

    const formValues = JSON.parse(json);

    let categories = await getCategories();

    let catName = formValues.catList;

    var categoryId;

    for (let i = 0; i < categories.length; i++) {
        if (categories[i].name == catName) {
            categoryId = categories[i].id;
        }
    }

    const item = {
        Title: `${formValues.postTitle}`,
        Content: `${formValues.postContent}`,
        CategoryId: categoryId,
    }

    fetch(`${uri}/Post`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => {
            viewPosts();
        })
        .catch(error => console.error('Unable to add item.', error));
}

async function viewPosts() {

    var categories = await getCategories();

    var posts = await getPosts();

    let catName = document.getElementById("catListPosts").value;

    let parent = document.getElementById("postContainer");

    parent.innerHTML = ` `;

    let CategoryId;

    for (let i = 0; i < categories.length; i++) {
        if (categories[i].name == catName) {
            CategoryId = categories[i].id;
        }
    }

    posts.forEach(item => {

        if (item.categoryId == CategoryId) {
            let itemBox = document.createElement("div");
            itemBox.setAttribute("class", "itemBox");
            itemBox.innerHTML =

                `
                <p class="itemBoxTitle">${item.title}</p>

                <div class="itemBoxContainer">
                    <div class="itemBoxView" onclick="viewContentModal(${item.id})">View</div>
                    <div class="itemBoxDelete" onclick="deleteContentModal(${item.id})">Delete</div>
                </div>
                `

            parent.appendChild(itemBox);
        }
    })    

}

async function viewContentModal(postId) {
    var posts = await getPosts();

    let post;

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id == postId) {
            post = posts[i];
        }
    }

    let viewerModalBack = document.getElementById("viewerModalBack");
    let viewerModal = document.getElementById("viewerModal");
    let modleContentTitle = document.getElementById("modalContentTitle");
    let parent = document.getElementById("modalContentArea");

    modleContentTitle.innerHTML = `${post.title}`;
    parent.value += `${post.content}`;

    viewerModalBack.style.display = "block";
    viewerModal.style.display = "block";
}

async function deleteContentModal(postId) {

    fetch(`${uri}/posts/${postId}`, {
        method: 'DELETE'
    })
        .then(() => {
            viewPosts()
        })
        .catch(error => console.error('Unable to delete item.', error));
}

function closeModals() {
    let viewerModalBack = document.getElementById("viewerModalBack");
    let viewerModal = document.getElementById("viewerModal");

    viewerModalBack.style.display = "none";
    viewerModal.style.display = "none";
}