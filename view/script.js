toAdd = []
function markdownParser(md) {
    // Replace headers
    md = md.replaceAll(/^###### (.*$)/gim, '<h6>$1</h6>');
    md = md.replaceAll(/^##### (.*$)/gim, '<h5>$1</h5>');
    md = md.replaceAll(/^#### (.*$)/gim, '<h4>$1</h4>');
    md = md.replaceAll(/^### (.*$)/gim, '<h3>$1</h3>');
    md = md.replaceAll(/^## (.*$)/gim, '<h2 aria-label="$1">$1</h2>');
    md = md.replaceAll(/^# (.*$)/gim, '<h1>$1</h1>');

    // Replace bold
    md = md.replaceAll(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    md = md.replaceAll(/__(.*?)__/gim, '<strong>$1</strong>');

    // Replace italics
    md = md.replaceAll(/\*(.*?)\*/gim, '<em>$1</em>');
    md = md.replaceAll(/_(.*?)_/gim, '<em>$1</em>');

    // Replace strikethrough
    md = md.replaceAll(/~~(.*?)~~/gim, '<del>$1</del>');

    // Replace links
    md = md.replaceAll(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

    // Replace unordered lists
    md = md.replaceAll(/^\s*[-+*] (.*$)/gim, '<li>$1</li>');
    md = md.replaceAll(/<\/li>\s*<li>/gim, '</li>\n<li>');
    md = md.replaceAll(/<li>(.*?)<\/li>/gim, '<ul>\n<li>$1</li>\n</ul>');
    md = md.replaceAll(/<\/ul>\n<ul>/gim, '');

    // Replace ordered lists
    md = md.replaceAll(/^\s*\d+\.(.*$)/gim, '<li>$1</li>');
    md = md.replaceAll(/<\/li>\s*<li>/gim, '</li>\n<li>');
    md = md.replaceAll(/<li>(.*?)<\/li>/gim, '<ol>\n<li>$1</li>\n</ol>');
    md = md.replaceAll(/<\/ol>\n<ol>/gim, '');

    // Replace blockquotes
    md = md.replaceAll(/^\>(.*$)/gim, '<blockquote>$1</blockquote>');
    md = md.replaceAll(/<\/blockquote>\s*<blockquote>/gim, '</blockquote>\n<blockquote>');

    // Replace inline code
    md = md.replaceAll(/`(.*?)`/gim, '<code>$1</code>');

    // Replace code blocks
    md = md.replaceAll(/```([^`]+)```/gim, '<pre><code>$1</code></pre>');

    // Replace line breaks
    md = md.replaceAll(/\n/gim, '<br />');

    return md.trim();
}
function addPost(post){
    postElement = document.createElement("div")
    postElement.setAttribute("class","post slide-in")
    postTitle = document.createElement("post-title")
    postTitle.innerText = post.title;
    postElement.appendChild(postTitle);
    author = document.createElement("p")
    author.innerHTML = "Author: <strong>cdc</strong>"
    postElement.appendChild(author);
    chapters = document.createElement("p")
    chapters.innerHTML = "Chapters: "
    for (chapter of post.chapters){
        keyWord = document.createElement("kw")
        keyWord.innerText = chapter;
        keyWord.setAttribute("aria-text",chapter);
        keyWord.setAttribute("onclick","scrollChapterIntoView(this);")
        chapters.appendChild(keyWord);
    }
    postElement.appendChild(chapters);
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
async function downloadPostContent(){
    document.getElementById("download").style = "display:none;";
    document.getElementById("load").hidden = false;
    downloadRequest = await fetch(postJSON.file_url)
    document.getElementById("load").hidden = true;
    md = await downloadRequest.text()
    element = document.createElement("div")
    element.innerHTML = markdownParser(md);
    element.id = "post-content"
    element.setAttribute("class","slide-in")
    document.body.appendChild(element);
}
function scrollChapterIntoView(e){
    label = e.getAttribute("aria-text")
    element = document.querySelector(`[aria-label="${label}"]`)
    element.setAttribute("class","flash")
    element.scrollIntoView({behavior:"smooth"});
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