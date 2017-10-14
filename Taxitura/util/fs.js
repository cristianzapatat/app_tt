'use strict'
/* eslint handle-callback-err: ["error", "error"] */
import fs from 'react-native-fs'

const patch = fs.DocumentDirectoryPath

function exists (route) {
  return fs.exists(route).then(exists => {
    return exists
  })
}

function createDirectory (route) {
  return fs.mkdir(route)
    .then((sucess) => { return true })
    .catch((err) => { return false })
}

function createFile (directory, file, content) {
  return exists(`${patch}${directory}${file}`).then(exists => {
    if (!exists) {
      return createDirectory(`${patch}${directory}`).then(status => {
        if (status) {
          return writeFile(`${patch}${directory}${file}`, content)
            .then(status => { return status })
        } else {
          return false
        }
      })
    } else {
      return writeFile(`${patch}${directory}${file}`, content)
        .then(status => { return status })
    }
  })
}

function writeFile (file, content) {
  content = JSON.stringify(content)
  return fs.writeFile(file, content, 'utf8')
    .then(sucess => { return true })
    .catch(err => { return true })
}

function readFile (file) {
  return exists(`${patch}${file}`).then(exists => {
    if (exists) {
      return fs.readFile(`${patch}${file}`, 'utf8')
          .then(response => { return JSON.parse(response) })
    } else {
      return null
    }
  })
}

module.exports = {
  patch,
  createFile,
  readFile
}
