require('dotenv').config()
const slugify = require('voca/slugify')
const fs = require('fs')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
})

// DANGER ZONE!!!
// mongoose.connection.dropCollection('articles')

const Article = mongoose.model('Article', {
  title: String,
  body: String,
  slug: String,
  created: Date
})

function getFileName(files) {
  return files.find(file => {
    return !/-published.md/.test(file) && /.md/.test(file)
  })
}

console.log(process.env.DB_URL)

fs.readdir('./', (err, files) => {
  const fileName = getFileName(files)
  // Do nothing in case there is know unpublished article.
  if (!fileName) {
    console.log('Нет новых файлов.')
    return
  }
  const slug = slugify(fileName.slice(0, -3))

  mongoose
    .connect(
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}`,
      { useNewUrlParser: true }
    )
    .then(res => console.log('Connected to mLab!'))
    .catch(err => console.log(err))

  fs.readFile(fileName, 'utf8', (err, data) => {
    const newArticle = new Article({
      title: fileName.slice(0, -3),
      body: data,
      slug,
      created: new Date()
    })
    // Save new article item into remote DB
    newArticle
      .save()
      .then(() => {
        console.log('Сохранено в базе данных.')

        mongoose.connection.close().then(() => {
          console.log('Соединение разорвано!')
        })
        fs.rename(fileName, `${fileName.slice(0, -3)}-published.md`, err => {
          if (err) throw err
          console.log('Rename completed!')
        })
      })
      .catch(err => {
        console.log(err)
      })
  })
})
