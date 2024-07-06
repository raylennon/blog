import { defineConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";
// import { fs } from "fs";
// const path = require('path')

import fs from 'fs'
import fsPromises from 'fs'
import path from 'path'

const postsDir = './src/posts';
var posts_info = [];

const files = fsPromises.readdirSync(postsDir);

const postDirs = files.filter(file => {
  const postDirPath = path.join(postsDir, file);
  const isDirectory = fs.statSync(postDirPath).isDirectory();
  const hasCategoriesFile = fs.existsSync(path.join(postDirPath, 'categories.txt'));
  const categoriesContent = hasCategoriesFile ? fs.readFileSync(path.join(postDirPath, 'categories.txt'), 'utf8') : '';
  return !hasCategoriesFile || !categoriesContent.includes('notmain');
});
posts_info = postDirs.map(postDir => {
  const postPath = path.join(postsDir, postDir);
  const images = fs.readdirSync(postPath).filter(file => /\.(png|jpe?g|gif)$/i.test(file));

  return {
    id: postDir,
    images,
    description: fs.readFileSync(path.join(postPath, 'description.txt'), 'utf8'),
    datebox: fs.readFileSync(path.join(postPath, 'datebox.txt'), 'utf8')
  };
}
);

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
    }),
  ],
}
