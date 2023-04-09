const express = require('express')
const ejs = require('ejs');

const fs = require('fs');

const app = express()

const port = process.env.PORT || 4000

app.use(express.static('public'))
app.use('/images', express.static('images'));

const serveIndex = require('serve-index');
app.use('/images', serveIndex('/images'));

const path = require('path');
const homePath = path.join(__dirname, 'views');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

const postsDir = './public/posts';

app.get('/posts/:postId/description', (req, res) => {
  const { postId } = req.params;
  const descriptionFile = path.join(postsDir, postId, 'description.txt');

  fs.readFile(descriptionFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }

    res.send(data);
  });
});

app.get('/', (req, res) => {
  fs.readdir(postsDir,(err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }

    const postDirs = files.filter(file => fs.statSync(path.join(postsDir, file)).isDirectory());

    const posts = postDirs.map(postDir => {
      const postPath = path.join(postsDir, postDir);
      const images = fs.readdirSync(postPath).filter(file => /\.(png|jpe?g|gif)$/i.test(file));

      return {
        id: postDir,
        images,
        description: fs.readFileSync(path.join(postPath, 'description.txt'), 'utf8'),
      };
    });

    res.render('index.ejs', { posts: posts, ejs: ejs });
  });
});
app.get('/art', (req, res) => {
  // get list of all image files in public/images folder
  const fs = require('fs');
  const dirPath = path.join(__dirname, 'public', 'images');
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.log('Error getting images: ', err);
    } else {
      // filter out non-image files
      const imageFiles = files.filter(file => {
        const extname = path.extname(file).toLowerCase();
        return extname === '.jpg' || extname === '.jpeg' || extname === '.png' || extname === '.gif';
      });
      res.render('art', { images: imageFiles });
    }
  });
});
app.listen(port, () => console.log(`Server live on port ${port}!`))
