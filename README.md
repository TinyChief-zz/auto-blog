## Deploy blog articles.

Automaticly uploads articles to `mongoDB` storage and uses webhook to tell `netlify` to deploy `preview` and `master` branches.

## Usage

```
git clone https://github.com/TinyChief/auto-blog.git blog
cd blog
npm install
```
Create `.env` and write to it:
```
DB_USER=<user-name-for-db>
DB_PASSWORD=<password-for-db>
DB_URL=<e.g. ds123456.mlab.com:12345/cats>
```
Create `.md` file with content to save and run:
```
node index.js
```
