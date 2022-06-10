const uri = '';

(async function getTitles() {
    let data = await fetch(`${uri}/Info/1`)
    .then(response => response.json())

    const Header = await document.getElementById("header_main-header");

    const Sub = await document.getElementById("header_main-sub");

    const Title = await document.getElementsByTagName("title");

    console.log(data);
   
    Header.innerHTML = `${data.mainHeader}`;
    Sub.innerHTML = `${data.subHeader}`;
})()