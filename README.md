# Personal Site

How it works:
- During development, hosted locally using nodeJS / express / EJS view templates (serves posts dynamically from ./posts)
- Saved as a static page using wget (and then hosted on Github Pages):

```bash
wget --mirror --convert-links --adjust-extension --page-requisites --no-parent http://localhost:4000 
