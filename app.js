const express = require('express')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('/mnt/demo_volumes/db.json')
const db = low(adapter)

const app = express()
const port = 8080

const DEFAULT_KEY="count"

// Initialize the database number to 0

db.defaults({[DEFAULT_KEY]: 0}).write()

app.get('/', (req, res) => {
  const num = db.get(DEFAULT_KEY).value()
  db.set(DEFAULT_KEY, num + 1).write()
  console.log(num)
  res.send(num+"")
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
