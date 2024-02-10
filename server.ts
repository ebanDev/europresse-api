import { Application, Router, Context } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { login, search, article } from "https://deno.land/x/europresse_lib@v1.1.1/mod.ts";
import { CookieJar, Cookie } from "npm:node-fetch-cookies";

const app = new Application();
const PORT = 8080;
const router = new Router();

function cookieJarToDict(cookieJar: CookieJar): { [key: string]: { [key: string]: string } } {
    const plainObject: { [key: string]: { [key: string]: string } } = {};
    // @ts-ignore - value and key are not defined in the type definition
    cookieJar["cookies"].forEach((value, key) => {
        plainObject[key] = {};
        // @ts-ignore - value and key are not defined in the type definition
        value.forEach((nestedValue, nestedKey) => {
            plainObject[key][nestedKey] = nestedValue;
        });
    });
    return plainObject;
}

function dictToCookieJar(cookieDict: { [key: string]: { [key: string]: string } }) {
    const cookieJar = new CookieJar();

    for (const domain in cookieDict) {
        const cookies = cookieDict[domain];

        for (const cookieName in cookies) {
            const cookieData = cookies[cookieName];
            const cookie = Cookie.fromObject(cookieData);
            cookieJar.addCookie(cookie);
        }
    }

    return cookieJar;
}

const getRequestBody = async (ctx: Context) => await ctx.request.body.json();


router
    .post("/login", async (ctx) => {
        try {
            const { username, password, provider, ent } = await getRequestBody(ctx);
            ctx.response.body = cookieJarToDict(await login(username, password, provider, ent));
        } catch (e) {
            ctx.response.status = 400;
            ctx.response.body = { error: e.message };
        }
    })
    .post("/search", async (ctx) => {
        try {
            const {query, searchIn, dateRange, cookies} = await getRequestBody(ctx);
            ctx.response.body = await search(dictToCookieJar(cookies), query, searchIn, dateRange);
        } catch (e) {
            ctx.response.status = 400;
            ctx.response.body = { error: e.message };
        }
    })
    .post("/article", async (ctx) => {
        try {
            const { id, cookies } = await getRequestBody(ctx);
            ctx.response.body = await article(dictToCookieJar(cookies), id, "html");
        } catch (e) {
            ctx.response.status = 400;
            ctx.response.body = { error: e.message };
        }
    });

app.use(oakCors())
app.use(router.routes());
await app.listen({ port: PORT });
