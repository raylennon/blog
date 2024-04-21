# Personal Site

How it works:
- Hosted locally using nodeJS / express / EJS view templates (dynamic)
- Rendered statically using wget:

```bash
wget --mirror --convert-links --adjust-extension --page-requisites --no-parent http://localhost:4000 