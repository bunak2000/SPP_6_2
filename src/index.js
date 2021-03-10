//////const { log } = require('console');

const express = require('express');
const FileSystem = require('fs');
const path = require("path");
const multer = require('multer');
const bodyParser = require('body-parser');

const upload = multer({ dest: 'uploads/' });

const rootDirectoryPath = path.join(__dirname, '../drive');
const uploadFolderPath = path.join(__dirname, '../', '/uploads');

const app = express();

app.set("view engine", "ejs");

app.listen(80);

app.use(bodyParser.urlencoded({ extended: true }));
//console.log(path.join(__dirname, "../public"));
app.use(express.static(path.join(__dirname, "../public")));

let posts;
let fileList = [];
let directoryList = [];
let DirectoryFilesList = [];

let currentDirectory = rootDirectoryPath;

app.get("*", function(req, res) {

    // console.log(req.params['0']);

    if(req.params['0'] == "/SelectFile"){
    // console.log(req._parsedOriginalUrl.query);
        if(req._parsedOriginalUrl.query == "" || req._parsedOriginalUrl.query == "..."){
            if(req._parsedOriginalUrl.query == ""){
                currentDirectory = rootDirectoryPath;
            }else{
                currentDirectory = path.join(currentDirectory,"../");
                currentDirectory = currentDirectory.substr(0, currentDirectory.length - 1);
            }   
            getDirectoryFilesList(currentDirectory);   
            res.send({ fileList, directoryList});
        }else{
            let fullPath = path.join(currentDirectory, "/", req._parsedOriginalUrl.query);
            if (FileSystem.existsSync(fullPath)) {

                if(FileSystem.lstatSync(fullPath).isFile()){
                    // console.log(fullPath);
                    res.download(fullPath);
                }
                else{
                    currentDirectory = fullPath;
                    getDirectoryFilesList(currentDirectory);   
                    res.send({ fileList, directoryList});
                }

            }

        } 
    }
    
});



app.post("*", upload.single("file"), function(req, res) { //need
    const { file } = req;

    // console.log(req.url);
    if (req.url == "/UploadFile") {
        replaceFile(file.originalname, file.filename, currentDirectory);
    } else {
        if (req.url == "/AddFile") {
            // console.log(req.body);
            if (FileSystem.existsSync(path.join(currentDirectory, "/", req.body.name)) == false) {
                FileSystem.mkdirSync(path.join(currentDirectory, "/", req.body.name));
            }
        }
    }

    getDirectoryFilesList(currentDirectory);   
    res.send({ fileList, directoryList});
});

function CalculateResault() {
    posts = "sdsds";
}

function replaceFile(originfilename, fileName, destination) {
    FileSystem.renameSync(path.join(uploadFolderPath, "/", fileName),
        path.join(destination, "/", originfilename));
}

function createDirectory(currentDirectory, folderName) {

}

function getDirectoryFilesList(currentDirectory) {
    directoryList = [];
    fileList = [];

    DirectoryFilesList = FileSystem.readdirSync(currentDirectory);

    let currentFilePath;
    let length = rootDirectoryPath.length;

    if (currentDirectory != rootDirectoryPath){
        directoryList.push({name: "...", path: ""});
        // console.log(currentDirectory);
    }

    DirectoryFilesList.forEach(function(fileName) {
        currentFilePath = path.join(currentDirectory, "/", fileName);
        if (FileSystem.lstatSync(currentFilePath).isDirectory() == true) {

            directoryList.push({ name: fileName, path: currentFilePath.substr(length) });

        } else {
            fileList.push({ name: fileName, path: currentFilePath.substr(length) });
        }
    });
}