/**
 * nodejs 脚本
 * 
 * 用于将go.json中的代码片段描述更新README.md文件
 * 
 * @summary 更新readme文件
 */

const fs = require('fs');
const path = require('path');
const process = require('process');
const snippetsFilePath = path.resolve(__dirname, './../go.json');
const mdFilePath = path.resolve(__dirname, '../README.md');
process.on('uncaughtException', function (err) {
    console.log('Caught Exception:' + err);
});

/**
 * 更新主方法
 */
function update() {
    let content = getContent(snippetsFilePath);
    let obj = JSON.parse(content);
    let entries = Object.entries(obj);
    let mdContent = "";
    mdContent += getHeader();
    mdContent += getTableHeader();
    mdContent += getTableContent();
    entries.map(v => {
        mdContent += getTrContent(v[1].prefix, v[1].description);
    });
    let writeStream = fs.createWriteStream(mdFilePath, {
        flags: 'w+',
        encoding: "utf8"
    });
    writeStream.write(mdContent, 'utf8');
    writeStream.on('error', function (err) {
        console.log(err);
    });
    writeStream.end();
}

/**
 * 获取文件内容
 * @param {string} filePath -文件地址
 * @returns {string} -返回的内容
 */
function getContent(filePath) {
    let snippetsFilePath = filePath;
    if (!fs.existsSync(snippetsFilePath)) {
        throw new RangeError("no file exists");
    }
    let contentBuffer = fs.readFileSync(snippetsFilePath, {
        encoding: 'utf8'
    });
    let content = contentBuffer.toString();
    return content;
}



/**
 * 获取头部
 */
function getHeader() {
    return "## Usage\r\n";
}

/**
 * 获取table头部
 */
function getTableHeader() {
    return '|prefix|description|\r\n';
}

/**
 * 获取table内容
 */
function getTableContent() {
    return "|---|---|\r\n";
}

/**
 * 获取table tr内容
 * @param {string} prefix -前置
 * @param {string} description -描述
 */
function getTrContent(prefix, description) {
    return `|${prefix}|${description}|\r\n`;
}

update();
