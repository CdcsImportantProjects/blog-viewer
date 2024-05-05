toAdd = []
function addPost(post){
    postElement = document.createElement("div")
    postElement.setAttribute("class","post slide-in")
    postTitle = document.createElement("post-title")
    postTitle.innerText = post.title;
    postElement.appendChild(postTitle);
    author = document.createElement("p")
    author.innerHTML = "Author: <strong>cdc</strong>"
    postElement.appendChild(author);
    /*for (word of post.keywords){
        keyWord = document.createElement("kw")
        keyWord.innerText = word;
        postElement.appendChild(keyWord);
    }
    viewButton = document.createElement("button")
    viewButton.innerText = "View"
    viewButton.setAttribute("onclick","viewPost(this);")
    viewButton.setAttribute("post_id",post.id)
    postElement.appendChild(viewButton);*/
    toAdd.push(postElement);
}
async function downloadPost(post){
    downloadRequest = await fetch(`https://raw.githubusercontent.com/CdcsImportantProjects/blog-posts/main/metadata/posts/${post}/data.json`)
    postJSON = await downloadRequest.json()
    addPost(postJSON)
}
function animate(){
    for (el of toAdd){
        document.getElementById("posts").appendChild(el)
        toAdd.splice(toAdd.indexOf(el),1)
        break;
    }
}
setInterval(animate,100);
try{
    redirect = JSON.parse(window.name)
    downloadPost(redirect.post_id)
}
catch{
    err = document.createElement("error")
    err.innerText = "Error: Invalid redirect data, please go back to the homepage."
    document.querySelector("html").appendChild(err)
}