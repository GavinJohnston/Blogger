const uri = '';

showItem("All");

(async function getTitles() {

    let data = await fetch(`${uri}/Info`)
        .then(response => response.json())


    if (data.length < 1) {
        document.getElementById("header_main-header").innerHTML = `Add Main Header`;
        document.getElementById("header_main-sub").innerHTML = `Add Sub Header`;
    } else {
        document.getElementById("header_main-header").innerHTML = `${data[0].mainHeader}`;
        document.getElementById("header_main-sub").innerHTML = `${data[0].subHeader}`;

        let mainHeader = document.getElementById("header_main");
    }
})();

(async function getCategories() {

    let data = await fetch(`${uri}/Categories`)
        .then(response => response.json())

    let parent = document.getElementById("menu_categories");

    data.forEach(item => {
        let catItem = document.createElement("div");
        catItem.setAttribute("class", "menu_item");
        catItem.setAttribute("onclick", `showItem(${item.id})`);
        
        catItem.innerHTML = `${item.name}`;

        parent.appendChild(catItem);
    })

})();

async function showItem(itemId) {

    let categories = await fetch(`${uri}/Categories`)
        .then(response => response.json())

    let allPosts = await fetch(`${uri}/Posts`)
        .then(response => response.json())

    let parent = document.getElementById("blog_dash");
    parent.style.flexDirection = "row";
    parent.innerHTML = ``;

    let CategoryName

    if (itemId !== "All") {

        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id == itemId) {
                CategoryName = categories[i].name;
            }
        }

        allPosts.forEach(item => {

            if (item.categoryId == itemId) {

                let postItem = document.createElement("div");
                postItem.setAttribute("class", "postItems");
                postItem.setAttribute("onclick", `postView(${item.id})`);
                postItem.innerHTML =
                    `
                <div class="postImg"></div>
                <div class="postPreview">
                <div class="prevHeader">
                   <div class="postCat">${CategoryName}</div>
                </div>
                <div class="prevContent">
                    <div class="titleAreaName">${item.title}</div>
                    <div class="descriptionBox">Bacon ipsum dolor amet landjaeger picanha ham hock tenderloin pastrami spare ribs boudin.</div>
                </div>
                <div class="postDate">${item.date.split('T')[0].split('-').reverse().join('/')}</div>
                </div>
                `

                parent.appendChild(postItem);
            }
        })

    } else if (itemId == "All") {
        allPosts.forEach(item => {

            for (let i = 0; i < categories.length; i++) {
                if (categories[i].id == item.categoryId) {
                    CategoryName = categories[i].name;
                }
            }

            let postItem = document.createElement("div");
            postItem.setAttribute("class", "postItems");
            postItem.setAttribute("onclick", `postView(${item.id})`);
            postItem.innerHTML =
                `
                <div class="postImg"></div>
                <div class="postPreview">
                <div class="prevHeader">
                   <div class="postCat">${CategoryName}</div>
                </div>
                <div class="prevContent">
                    <div class="titleAreaName">${item.title}</div>
                    <div class="descriptionBox">Bacon ipsum dolor amet landjaeger picanha ham hock tenderloin pastrami spare ribs boudin.</div>
                </div>
                <div class="postDate">${item.date.split('T')[0].split('-').reverse().join('/')}</div>
                </div>
                `

            parent.appendChild(postItem);
        })
    }
}

async function postView(postId) {
    let data = await fetch(`${uri}/Posts/${postId}`)
        .then(response => response.json())
        .catch(error => console.error('Unable to get items.', error));

    let parent = document.getElementById("blog_dash");
    parent.style.flexDirection = "column";
    

    parent.innerHTML = 
    `<h2 id="postTitle">${data.title}</h2>
    <pre id="postContent"><p>${data.content}</p></pre>
    <p id="postDate">Last Update: ${data.date.split('T')[0].split('-').reverse().join('/')}</p>
`
}