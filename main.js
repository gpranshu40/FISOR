#!/usr/bin/env node
let inputArr = process.argv.slice(2);
let fs = require("fs");
let path = require("path");

// node main.js tree "directoryPath"
// node main.js organize "directoryPath"
// node main.js help
let types = {
    media: ["mp4", "mkv"],
    archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
    documents: ["docx", "doc", "pdf", "odt", "ods", "odg", "txt", "odf", "ps"],
    spreadsheets: ["xlsx", "xls"],
    app: ["exe", "dmg", "pkg", "deb"],
    images: ["png", "img", "jpeg", "jpg"],
    program_files: ["cpp", "py", "ipynb", "c", "js", "r", "json", "html", "css", "kt", "md"]
};

let command = inputArr[0];
switch (command) {
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("Input A Valid Command 😒");
}

function treeFn(dirPath) {
    console.log("Tree Command Implemented");
    if (dirPath == undefined) {
        treeHelper(process.cwd(), "");
        return;
    }
    else {
        let does_exist = fs.existsSync(dirPath);
        if (does_exist) {
            treeHelper(dirPath, "");
        }
        else {
            console.log("Enter the correct Path 😒");
            return;
        }
    }
}

function treeHelper(dirPath, indent) {
    let isFile = fs.lstatSync(dirPath).isFile();
    if (isFile) {
        let fileName = path.basename(dirPath);
        console.log(indent + "|---->" + fileName);
    }
    else {
        let dirName = path.basename(dirPath);
        console.log(indent + "L___" + dirName);
        let childrens = fs.readdirSync(dirPath);

        for (let i = 0; i < childrens.length; i++) {
            let childPath = path.join(dirPath, childrens[i]);
            treeHelper(childPath, indent + "\t");
        }
    }
}

function organizeFn(dirPath) {
    console.log("Organize Command Implemented");
    let destnPath;
    if (dirPath == undefined) {
        destnPath = process.cwd();
        return;
    }
    else {
        let does_exist = fs.existsSync(dirPath);
        if (does_exist) {
            destnPath = path.join(dirPath, "organized_files");
            if (fs.existsSync(destnPath) == false)
                fs.mkdirSync(destnPath);
        }
        else {
            console.log("Enter the correct Path 😒");
            return;
        }
    }
    organizeHelper(dirPath, destnPath);
}

function organizeHelper(src, destn) {
    let childnames = fs.readdirSync(src);

    for (let i = 0; i < childnames.length; i++) {
        let childAddr = path.join(src, childnames[i]);
        let isFile = fs.lstatSync(childAddr).isFile();
        if (isFile) {
            let category = getCategory(childnames[i]);
            console.log(childnames[i], "Belongs to -->", category);

            sendFiles(childAddr, destn, category);
        }

    }
}

function sendFiles(srcPath, dest, category) {
    let categorypath = path.join(dest, category);

    if (fs.existsSync(categorypath) == false)
        fs.mkdirSync(categorypath);

    let fileName = path.basename(srcPath);
    let destnFilePath = path.join(categorypath, fileName);
    fs.copyFileSync(srcPath, destnFilePath);
    fs.unlinkSync(srcPath);
    console.log(fileName, "copied to ", category);
}

function getCategory(name) {
    let ext = path.extname(name);
    ext = ext.slice(1);

    for (let type in types) {
        let ctype = types[type];
        for (let i = 0; i < ctype.length; i++) {
            if (ext == ctype[i])
                return type;
        }
    }
    return "others";
}

function helpFn() {
    console.log(`
    List Of All Commands :
    1. node main.js tree "directoryPath"
    2. node main.js organize "directoryPath"
    3. node main.js help  
    `);
}