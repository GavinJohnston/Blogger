const uri = '';

displayCategories();
viewPosts();

(async function checkTitles() {

    let data = await fetch(`${uri}/Info`)
        .then(response => response.json())
    if (data.length < 1) {

        const item = {
            MainHeader: `Add Main Header`,
            SubHeader: `Add Sub Header`,
            Title: `Add Page Title`
        }

        fetch(`${uri}/Info`, {
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
    }
})()

async function updateBlogTitle() {

    let data = await fetch(`${uri}/Info`)
        .then(response => response.json())

    var formData = new FormData(document.getElementById("titlesForm"));

    var json = JSON.stringify(Object.fromEntries(formData));

    const formValues = JSON.parse(json);

    const item = {
        id: `${data[0].id}`,
        mainHeader: `${formValues.headerName}`,
        subHeader: `${formValues.subHeaderName}`,
        color: `${formValues.colorPickerMain}`
    }

    fetch(`${uri}/Info/${data[0].id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .catch(error => console.error('Unable to update item.', error));

    document.getElementById("headerName").value = "";
    document.getElementById("subHeaderName").value = "";
}

async function createCategory() {
    const addCat = document.getElementById("addCat");
    const colorPickerCat = document.getElementById("colorPickerCat");

    console.log(colorPickerCat);

    const item = {
        name: `${addCat.value}`,
        color: `${colorPickerCat.value}`,
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
    const catListPost = document.getElementById("catListPosts");

    const data = await getCategories();

    for (var i = 0; i < catLists.length; i++) {
        while (catLists[i].firstChild) {
            catLists[i].removeChild(catLists[i].firstChild);
        }
    }

    while (catListPost.lastChild.value !== "All") {
        catListPost.removeChild(catListPost.lastChild);
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

            

                let node = document.createElement("option");
                node.setAttribute("value", `${item.name}`);
                node.innerHTML = `${item.name}`;

                catListPost.appendChild(node);
            

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
            viewPosts()
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
            viewPosts()
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
            viewPosts()
        })
        .catch(error => console.error('Unable to delete item.', error));
}

/** CREATE POST **/

async function generatePost() {

    let photo = document.getElementById("file").files[0];

    fetch('Image/' + encodeURIComponent(photo.name), { method: 'PUT', body: photo });
    alert('your file has been uploaded');
    location.reload();

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

    document.getElementById("postTitle").value = '';
    document.getElementById("createPost").value = '';
}

async function viewPosts() {

    var categories = await getCategories();

    var posts = await getPosts();

    let catName = document.getElementById("catListPosts").value;

    let parent = document.getElementById("postContainer");

    parent.innerHTML = ` `;

    let CategoryId;
    let CatColor;
    

    if (catName !== "All") {

        for (let i = 0; i < categories.length; i++) {
            if (categories[i].name == catName) {
                CategoryId = categories[i].id;
                CatColor = categories[i].color;
                
            }
        }

        posts.forEach(item => {

            if (item.categoryId == CategoryId) {
                let itemBox = document.createElement("div");
                itemBox.setAttribute("class", "itemBox");
                itemBox.setAttribute("style", `background-color:${CatColor}`);
                itemBox.innerHTML =

                    `
                <p class="itemBoxTitle">${item.title}</p>

                <div class="itemBoxContainer">
                    <div class="itemBoxView itemBoxBtn" onclick="viewContentModal(${item.id})">View</div>
                    <div class="itemBoxDelete itemBoxBtn" onclick="deleteContentModal(${item.id})">Delete</div>
                </div>
                `

                parent.appendChild(itemBox);
            }
        })

    } else if (catName == "All") {

        posts.forEach(item => {

            for (let i = 0; i < categories.length; i++) {
                if (categories[i].id == item.categoryId && categories[i].binned == false) {
                    CatColor = categories[i].color;

                    let itemBox = document.createElement("div");
                    itemBox.setAttribute("class", "itemBox");
                    itemBox.setAttribute("style", `background-color:${CatColor}`);
                    itemBox.innerHTML =

                        `
                <p class="itemBoxTitle">${item.title}</p>

                <div class="itemBoxContainer">
                    <div class="itemBoxView itemBoxBtn" onclick="viewContentModal(${item.id})">View</div>
                    <div class="itemBoxDelete itemBoxBtn" onclick="deleteContentModal(${item.id})">Delete</div>
                </div>
                `

                    parent.appendChild(itemBox);
                }
            }
        })
    }
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

    let modalContentSave = document.getElementById("modalContentSave");
    modalContentSave.setAttribute("onclick", `savePost(${post.id})`);

    modleContentTitle.innerHTML = `${post.title}`;
    parent.value = `${post.content}`;

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

function editPost() {
    let modalContentArea = document.getElementById("modalContentArea");
    modalContentArea.style.border = "2px solid black";
    modalContentArea.style.cursor = "text";

    let editMode = document.getElementById("editMode");
    editMode.style.display = "inline-block";
}

async function savePost(postId) {

    let posts = await getPosts();

    let post;

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id == postId) {
            post = posts[i]
        }
    }

    let modalContentArea = document.getElementById("modalContentArea");
    modalContentArea.style.border = "";
    modalContentArea.style.cursor = "";

    let editMode = document.getElementById("editMode");
    editMode.style.display = "none";

    let content = document.getElementById("modalContentArea").value;

    let newDate = new Date().toLocaleDateString('en-US');

    const item = {
        Id: postId,
        Title: post.title,
        Content: content,
        date: newDate,
        categoryId: post.categoryId
    }

    fetch(`${uri}/posts/${postId}`, {
        method: 'PUT',
        headers: {
            
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => console.log(response))
        .catch(error => console.error('Unable to update item.', error)); 
}

