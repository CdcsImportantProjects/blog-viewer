toAdd = []
let downloadingFor = 0;
let downloadStarted = false;
let downloadDone = false;
random_messages = [
    "Waiittt!",
    "The JSON is sleeping...",
    "Cmon man... get some patience :/",
    "What's an API, I've only ever heard of GitHub!",
    "CdcsImportantProjects/blog-posts",
    "cdc-sys.github.io",
    "You hacked the mainframe!",
    "Hacking the Pentagon....",
    "THE POSTS RAN AWAY!!! GO CATCH THEM!!!!!",
    "this loading message is awesome",
    "<img id=\"loading_icon\" src=\"assets/loading-small.gif\"></img> <p>Loading the message.. Please wait!</p>",
    "<p>get soggied:</p><iframe src=\"https://soggy.cat\"></iframe>"
]
function addPost(post){
    postElement = document.createElement("div")
    postElement.setAttribute("class","post slide-in")
    postTitle = document.createElement("post-title")
    postTitle.innerText = post.title;
    postElement.appendChild(postTitle);
    author = document.createElement("p")
    author.innerHTML = "Author: <strong>cdc</strong>"
    postElement.appendChild(author);
    for (word of post.keywords){
        keyWord = document.createElement("kw")
        keyWord.innerText = word;
        postElement.appendChild(keyWord);
    }
    viewButton = document.createElement("button")
    viewButton.innerText = "View"
    viewButton.setAttribute("onclick","viewPost(this);")
    viewButton.setAttribute("post_id",post.id)
    postElement.appendChild(viewButton);
    toAdd.push(postElement);
}
function badInternet(){
    if (downloadStarted&&!downloadDone){
        if (downloadingFor == 10){
            document.getElementById("bad_internet").hidden = false;
            document.getElementById("random_message").setAttribute("class","slide-out-anim")
        }
        downloadingFor++
    }
}
async function downloadHP(){
    downloadStarted = true;
    try{
        downloadRequest = await fetch("https://raw.githubusercontent.com/CdcsImportantProjects/blog-posts/main/homepage.json")
    }
    catch{
        document.getElementById("loading_icon").hidden = true;
        document.getElementById("loading_text").hidden = true;
        document.getElementById("random_message").hidden = true;
        document.getElementById("bad_internet").innerHTML = "<strong>Oops!</strong><p>Hm, that didn't work! Try reconnecting to the network.</p>"
        document.getElementById("bad_internet").hidden = false;
        return;
    }
    if (downloadRequest.status != 200){
        document.getElementById("loading_icon").hidden = true;
        document.getElementById("loading_text").hidden = true;
        document.getElementById("random_message").hidden = true;
        document.getElementById("bad_internet").innerHTML = "<strong>Oops!</strong><p>The repository used to host this site might have been taken down....</p><p>However it might also be:</p><p>- The fact that you're on an outdated version.</p>"
        document.getElementById("bad_internet").hidden = false;
        return;
    }
    hpJSON = await downloadRequest.json()
    document.getElementById("random_line").innerText = hpJSON.random_line;
    for (post of hpJSON.posts){
        addPost(post);
    }
    document.getElementById("loading").setAttribute("class","slide-out")
    document.getElementById("posts").hidden = false;
    downloadDone = true;
}
async function downloadIndex(){
    downloadRequest = await fetch("https://raw.githubusercontent.com/CdcsImportantProjects/blog-posts/main/metadata/search_index/index.json")
    indexJSON = await downloadRequest.json()
    for (post of indexJSON){
        addPost(post);
    }
}
function viewPost(e){
    window.name = JSON.stringify({referrer:"cdc_blog_redirect",post_id:e.getAttribute("post_id")})
    window.location.href = `./view`
}
function animate(){
    for (el of toAdd){
        document.getElementById("posts").appendChild(el)
        toAdd.splice(toAdd.indexOf(el),1)
        break;
    }
}
function openCdcGH(){
    window.location.href = "https://github.com/cdc-sys"
}

document.addEventListener("DOMContentLoaded", function() {
    downloadHP();
    setInterval(animate,25);
    setInterval(badInternet,1000);
    document.getElementById("random_message").innerHTML = "<strong>" + random_messages[Math.floor(Math.random()*random_messages.length)] + "</strong>"
});
