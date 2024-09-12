This is my personal website's repository! In addition to serving as a central location for my life udpates, art, personal projects, CV, community involvement, and more, the website is also an ongoing project that tests my web development skills. I've learned a lot in the process - the site has come a long way! In short, here's how it works:

## the backend
At the end of the day, the blog is just a few static html files hosted on GitHub. The website is hosted through [GitHub Pages](https://pages.github.com/), which I like because it is free. The real magic has to do with how these html documents are produced. 
* During development, I use a [NodeJS](https://nodejs.org/en)-based runtime environment to create a *dynamic* version of the site. Changes to the site are reflected immediately in my browser thanks to a development environment called [Vite](https://vitejs.dev/). 
* The text contents of each blog post are stored in a nested file structure under /src/posts; the NodeJS server serves them using the *fs* (File system) module.
* Once the text content is retrieved - including the dates, descriptions, and titles of each post, they are iteratively added to the html page using [Embedded Javascript Templates (EJS)](https://ejs.co/). I cannot recommend this approach enough; I personally find EJS templates to be extremely intuitive and elegant. 
* Once I like how the site is looking, I build a static version of it using Vite. I've configured it to output the static files into the /docs directory, which the Github Pages workflow automatically draws from.

## the frontend
Of course, the site needs to look good, too. I keep it simple-
* The ubiquitous [Bootstrap](https://getbootstrap.com/) frontend toolkit is what powers the website. Although it's definitely overkill, I use [Sass](https://sass-lang.com/) to manage global style choices/ themes across the site. 
