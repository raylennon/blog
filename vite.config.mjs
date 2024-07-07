import { defineConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";

import { resolve } from 'path'

import fs from 'fs'
import fsPromises from 'fs'
import path from 'path'

const postsDir = './src/posts';
var posts_info = [];

const files = fsPromises.readdirSync(postsDir);

var postDirs = files.filter(file => {
  const postDirPath = path.join(postsDir, file);
  const isDirectory = fs.statSync(postDirPath).isDirectory();
  const hasCategoriesFile = fs.existsSync(path.join(postDirPath, 'categories.txt'));
  const categoriesContent = hasCategoriesFile ? fs.readFileSync(path.join(postDirPath, 'categories.txt'), 'utf8') : '';
  return !hasCategoriesFile || !categoriesContent.includes('notmain');
});
postDirs.sort().reverse();
posts_info = postDirs.map(postDir => {
  const postPath = path.join(postsDir, postDir);
  const images = fs.readdirSync(postPath).filter(file => /\.(png|jpe?g|gif)$/i.test(file));

  return {
    id: postDir,
    images,
    description: fs.readFileSync(path.join(postPath, 'description.txt'), 'utf8'),
    categories: fs.readFileSync(path.join(postPath, 'categories.txt'), 'utf8').split(" "),
    datebox: fs.readFileSync(path.join(postPath, 'datebox.txt'), 'utf8')
  };
}
);

const art_2D_files = fsPromises.readdirSync("./src/art_2D");
const art_2d_filtered = art_2D_files.filter(file => {
  const extname = path.extname(file).toLowerCase();
  return extname === '.jpg' || extname === '.jpeg' || extname === '.png' || extname === '.gif';
});
art_2d_filtered.sort((a, b) => {
  return a.toLowerCase().localeCompare(b.toLowerCase());
});

// app.locals.moment = moment;

export default {
  root: 'src',
  resolve: {
    alias: {
      '~bootstrap': 'node_modules/bootstrap',
    }
  },
  server: {
    port: 8080,
    hot: true
  },
  plugins: [
    ViteEjsPlugin({
      posts: posts_info,
      art_files: art_2d_filtered
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, './src/index.html'),
        art: resolve(__dirname, './src/art/index.html'),
        projects: resolve(__dirname, './src/projects/index.html'),
        community: resolve(__dirname, './src/community/index.html'),
      },
    },
    outDir: '../docs',
    emptyOutDir: true, // also necessary
  },
}
