'use strict'
/* eslint handle-callback-err: ["error", "error"] */
import fs from 'react-native-fs'

const patch = fs.DocumentDirectoryPath

function exists (patch) {
  return fs.exists(patch).then(exists => {
    return exists
  })
}

function createDirectory (patch) {
  return fs.mkdir(patch)
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

function writeFile (patch, content) {
  return fs.writeFile(patch, content, 'utf8')
    .then(sucess => { return true })
    .catch(err => { return true })
}

function readFile (patch) {
  return fs.readFile(patch, 'utf8')
    .then(response => { return response })
}

module.exports = {
  patch,
  createFile,
  readFile
}
