#!/usr/bin/env node

//配置package.json 中的bin link到全局 执行customcli 测试
// console.log('customcli running'
// 安装依赖(inquirer ejs)
// 命令行交互： 熟悉基本语法写法

const inquirer = require('./node_modules/inquirer/lib/inquirer');
const path = require('path');
const fs = require('fs');
const ejs = require('./node_modules/ejs/lib/ejs');
const { getFiles } =  require('./readfile.js');

const defaultData = {
  projectName: 'web-view',
  version: '0.0.1'
};

// 询问用户问题
inquirer.prompt([
  {
    type: 'input',
    name: 'projectName',
    message: 'project name: (web-view)'
  },
  {
    type: 'input',
    name: 'version',
    message: 'version: (0.0.1)'
  }
])
  .then((answers) => {
    // 找到模板目录
    const templatePath = path.join(__dirname, 'templates');
    // 找到目标项目根目录
    const destPath = process.cwd();

    const configData = {
      projectName: answers.projectName || defaultData.projectName,
      version: answers.version || defaultData.version,
    };

    // 读取模板目录下文件内容，用模板引擎进行渲染，写入到目标目录
    getFiles(templatePath).then((res) => {
        res
        .map((r) => r.replace(templatePath, '.'))
        .filter((r) => !r.includes('DS_Store'))
        .forEach((file) => {
          const lastPath = file.substring(0, file.lastIndexOf("/"));
          ejs.renderFile(path.join(templatePath, file), configData, (err, result) => {
            if (err) throw err;
            if (lastPath) {
              fs.mkdir(lastPath, {recursive: true}, (err) => {
                if (err) throw err;
                fs.writeFileSync(path.join(destPath, file), result)
              });
            } else {
              fs.writeFileSync(path.join(destPath, file), result)
            }

          })
        });
    })
    // .forEach((file) => {

    // });
    // fs.readdir(templatePath, (err, files) => {
    //   if (err) throw err;
    //   console.log('files', files);
    //   files.forEach((file) => {
    //     ejs.renderFile(path.join(templatePath, file), configData, (err, result) => {
    //       console.log('path.join(templatePath, file)', path.join(templatePath, file));
    //       if (err) throw err;
    //       fs.writeFileSync(path.join(destPath, file), result)
    //     })
    //   });
    // });
  });