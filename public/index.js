const serverURL = "http://localhost:80/";

const formAddFile = document.getElementById('formAddFile');
formAddFile.onsubmit = async function(event) {
    event.preventDefault();
    // console.log(event.target.NameOfFile.value);
       
    let url = serverURL + "AddFile";
    var formData = new FormData();
    formData.append("name", event.target.NameOfFile.value);
    const response = await fetch(url, {method:"POST", headers:{}, body: formData});   

    let fileList = await response.json();
    drawFileList(fileList);
}

const formUpload = document.getElementById('formUploadFile');
formUpload.onsubmit = async function(event) {
    event.preventDefault();

    // console.log(document.getElementById('fileToUpload').files[0]);

    let url = serverURL + "UploadFile";
    var formData = new FormData(); 
    formData.append("file", document.getElementById('fileToUpload').files[0]);

    const response = await fetch(url, {method:"POST", headers:{}, body: formData});     

    let fileList = await response.json();
    drawFileList(fileList);
    // console.log(event.target.NameOfFile.value);
    
}

// console.log("fs");
window.onload = async function() {

    // let method = "GET";
    // let headers = {};
    // let body;
    // const response = await fetch("sda", { method, headers, body });

    // let data = await response.json();

    selectFile("");

    // console.log(data);
    
    document.getElementById('body').onclick = function(event) {
            let target = event.target.closest(".FilePanel");

            // console.log(target);
            if (target?.tagName == "DIV") {
                // selectFile(target.name);
                // console.dir(target);
                // console.log(target['dataset'].name);

                selectFile(target['dataset'].name);
            }
        }
}

function drawFileList(fileList){

    document.getElementById('fileTable').innerHTML = "";

    let fileListHTML = fileList.directoryList.reduce((acc, e) => {
        acc = acc +
            `<div data-name="${e.name}" class="FilePanel">
                <img src="/images/folder.png" class="FileImage">
                <p class="FileName">
                    ${e.name}
                </p>
            </div>`;
        return acc;
    }, "");

    fileListHTML = fileListHTML + fileList.fileList.reduce((acc, e) => {
        acc = acc +             
        `<div>
        <a href="${serverURL + "SelectFile?" + e.name}" class="FilePanel">
            <img src="/images/file.png" class="FileImage">
            <p class="FileName">
                ${e.name}
            </p>
        </a>  
    </div>`
        return acc;
    }, "");
    // console.log(list);

    // console.log(document.getElementById('body').innerHTML);

    document.getElementById('fileTable').innerHTML = document.getElementById('fileTable').innerHTML + fileListHTML;
}

async function selectFile(name){    

    // console.log(name);

    let url = serverURL +"SelectFile?" + name;
    const response = await fetch(url, {method:"GET", headers:{}});

    let fileList = await response.json();

    // console.log(fileList);

    drawFileList(fileList);
}