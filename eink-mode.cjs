const fs = require("fs")
const path = require('path')

let data = fs.readFileSync(path.join(__dirname,"src","mode.json"),{encoding:"utf-8"})

let jsonData = {...JSON.parse(data)}
if (jsonData.eink === "false"){
  console.log("change to true")
  jsonData.eink = "true"
  console.log("Change mode to Eink")
} else {
  jsonData.eink = "false"
  console.log("Change mode to Mobile")
}

fs.writeFileSync(path.join(__dirname,"src","mode.json"),JSON.stringify(jsonData))

// console.log(JSON.stringify(jsonData))