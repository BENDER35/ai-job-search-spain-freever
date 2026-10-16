import { htmlFetch, parseJobCards, UA } from "../helpers.js"

// A small live-test fetch that respects the repo's rate-limit / retry policy.
// Used by unit tests to verify parsing without hitting the network excessively.

export async function runTestSearch(query: string, location?: string): Promise<IndeedJobCard[]> {
  const url = `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}${
    location ? `&l=${encodeURIComponent(location)}` : ""
  }`
  const html = await htmlFetch(url)
  return parseJobCards(html)
}
