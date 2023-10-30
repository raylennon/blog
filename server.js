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

app.get('*', (req, res, next) => {
  const subdomain = req.subdomains[0];
  if (subdomain === 'dog') {
    res.send('Welcome to dog! (still in progress, obviously...');
  } else {
    // Redirect all other subdomains to a 404 page
    next();
  }
});

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
  fs.readdir(postsDir, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }

    const postDirs = files.filter(file => {
      const postDirPath = path.join(postsDir, file);
      const isDirectory = fs.statSync(postDirPath).isDirectory();
      const hasCategoriesFile = fs.existsSync(path.join(postDirPath, 'categories.txt'));
      const categoriesContent = hasCategoriesFile ? fs.readFileSync(path.join(postDirPath, 'categories.txt'), 'utf8') : '';

      return !hasCategoriesFile || !categoriesContent.includes('notmain');
    });
    const posts = postDirs.map(postDir => {
      const postPath = path.join(postsDir, postDir);
      const images = fs.readdirSync(postPath).filter(file => /\.(png|jpe?g|gif)$/i.test(file));

      return {
        id: postDir,
        images,
        description: fs.readFileSync(path.join(postPath, 'description.txt'), 'utf8'),
        datebox: fs.readFileSync(path.join(postPath, 'datebox.txt'), 'utf8')
      };
    });

    res.render('index.ejs', { posts: posts, ejs: ejs });
  });
});
app.get('/art', (req, res) => {
  // get list of all image files in public/images folder
  const fs = require('fs');
  const dirPath = path.join(__dirname, 'public', 'images/Art');
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

app.get('/projects', (req, res) => {
  fs.readdir(postsDir, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }

    const postDirs = files.filter(file => {
      const postDirPath = path.join(postsDir, file);
      const isDirectory = fs.statSync(postDirPath).isDirectory();
      const hasCategoriesFile = fs.existsSync(path.join(postDirPath, 'categories.txt'));
      const categoriesContent = hasCategoriesFile ? fs.readFileSync(path.join(postDirPath, 'categories.txt'), 'utf8') : '';

      return isDirectory && hasCategoriesFile && categoriesContent.includes('projects');
    });

    const posts = postDirs.map(postDir => {
      const postPath = path.join(postsDir, postDir);
      const images = fs.readdirSync(postPath).filter(file => /\.(png|jpe?g|gif)$/i.test(file));

      return {
        id: postDir,
        images,
        description: fs.readFileSync(path.join(postPath, 'description.txt'), 'utf8'),
        datebox: fs.readFileSync(path.join(postPath, 'datebox.txt'), 'utf8')
      };
    });

    res.render('projects.ejs', { posts: posts, ejs: ejs });
  });
});

app.get('/community', (req, res) => {
  fs.readdir(postsDir, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }

    const postDirs = files.filter(file => {
      const postDirPath = path.join(postsDir, file);
      const isDirectory = fs.statSync(postDirPath).isDirectory();
      const hasCategoriesFile = fs.existsSync(path.join(postDirPath, 'categories.txt'));
      const categoriesContent = hasCategoriesFile ? fs.readFileSync(path.join(postDirPath, 'categories.txt'), 'utf8') : '';

      return isDirectory && hasCategoriesFile && categoriesContent.includes('community');
    });

    const posts = postDirs.map(postDir => {
      const postPath = path.join(postsDir, postDir);
      const images = fs.readdirSync(postPath).filter(file => /\.(png|jpe?g|gif)$/i.test(file));

      return {
        id: postDir,
        images,
        description: fs.readFileSync(path.join(postPath, 'description.txt'), 'utf8'),
        datebox: fs.readFileSync(path.join(postPath, 'datebox.txt'), 'utf8')
      };
    });

    res.render('community.ejs', { posts, ejs });
  });
});

const pdfRoutes = {
  CV: 'RayLennon_CV_102923.pdf',
  PhototherapyPoster: 'PhototherapyPoster.pdf',
  CDCPaper: 'From Hospitals to Hurricanes - How APL Is Using Computational Fluid Dynamics to Inform the Future of Public Health and Safety.pdf',
  ProgrammedGeometricStiffness: 'Origami Architected Geometric Stiffness.png'
};

for (const route in pdfRoutes) {
  app.get(`/${route}`, (req, res) => {
    const pdfPath = path.join(__dirname, 'public', pdfRoutes[route]);
    const data = fs.readFileSync(pdfPath);

    if (pdfRoutes[route].slice(-3) == 'pdf') {
      res.contentType('application/pdf');
      res.send(data);
    }
    else {
      res.contentType('image/png');
      res.set("Content-Disposition", "inline;");
      res.sendFile(pdfPath)
    }
  });
}

// The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
  res.status(404).send("This page doesn't exist yet - keep looking. Here's a cookie for your trouble: 🍪\n\n-Ray");
});
app.listen(port, () => console.log(`Server live on port ${port}!`))
