# 🔌 Europresse API

A typescript API for the [europresse-lib](https://github.com/ebanDev/europresse-lib) library.

Made with Deno and Oak. This project is meant to be deployed on Deno Deploy.

## Usage

```bash
deno run --allow-net --allow-read --allow-env server.ts
```

```HTTP
POST /login
{
  "username": "username",
  "password": "password",
  "provider": "provider",
  "ent": "ent"
}


POST /search
{
  "query": "query",
  "searchIn: "fullText or title",
  "dateRange": "allTime or lastWeek or lastMonth or lastYear",
  "cookies": "cookies"
}

POST /article
{
  "id": "id",
  "cookies": "cookies"
}
```
