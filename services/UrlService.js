import { GoogleSearch } from "google-search-results-nodejs";

let search;

function searchGoogle(query) {
    if (!search) {
        search = new GoogleSearch(process.env.SERP_API_KEY);
    }
    return new Promise((resolve, reject) => {
        search.json(
            {
                q: query,
                engine: "google",
            },
            (data) => {
                resolve(data);
            }
        );
    });
}

async function getFirstResult(query) {
    try {
        const results = await searchGoogle(query);

        if (
            results.organic_results &&
            results.organic_results.length > 0
        ) {
            return results.organic_results[0].link;
        }

        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function searchLinks(title) {
    const [leetcode, gfg, codeforces] = await Promise.all([
        getFirstResult(`${title} site:leetcode.com/problems`),
        getFirstResult(`${title} site:geeksforgeeks.org`),
        getFirstResult(`${title} site:codeforces.com/problemset/problem`),
    ]);

    return {
        leetcode,
        gfg,
        codeforces,
    };
}

export function isValidUrl(url) {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}