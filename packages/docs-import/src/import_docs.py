"""
Import Rollbar's AI-ready documentation into docs/api/ at the repo root.

Rollbar publishes a llms.txt manifest (https://llmstxt.org/) at
https://docs.rollbar.com/llms.txt and serves every page as raw markdown when
the URL is suffixed with `.md`. This script:

  1. Fetches llms.txt to discover all .md URLs
  2. Fetches each .md page concurrently
  3. Writes them to docs/api/<path>.md mirroring the URL path
  4. Saves the original llms.txt as docs/api/llms.txt for the index

Usage (from repo root):
  bun run docs:import
  uv run --project packages/docs-import python packages/docs-import/src/import_docs.py
  uv run --project packages/docs-import python packages/docs-import/src/import_docs.py --concurrency 16
"""

from __future__ import annotations

import argparse
import asyncio
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

import httpx

MANIFEST_URL = "https://docs.rollbar.com/llms.txt"
REPO_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_OUTPUT_DIR = REPO_ROOT / "docs" / "api"
USER_AGENT = "rollbar-toolkit-docs-import/0.1 (+https://github.com/spenserhale/rollbar-ai-toolkit)"

# Match any docs.rollbar.com markdown URL inside the manifest's link syntax.
MD_URL_RE = re.compile(r"https://docs\.rollbar\.com/[^\s)]+\.md")


def url_to_output_path(url: str, output_dir: Path) -> Path:
    """Map an llms.txt URL to a local file path under output_dir."""
    rel = urlparse(url).path.lstrip("/")
    if not rel.endswith(".md"):
        rel += ".md"
    return output_dir / rel


async def fetch_with_retry(
    client: httpx.AsyncClient, url: str, max_retries: int = 6
) -> httpx.Response:
    last_exc: Exception | None = None
    for attempt in range(max_retries):
        try:
            res = await client.get(url)
            if res.status_code == 429:
                retry_after = float(res.headers.get("Retry-After", 2 ** (attempt + 1)))
                await asyncio.sleep(min(retry_after, 60))
                continue
            res.raise_for_status()
            return res
        except httpx.HTTPError as exc:
            last_exc = exc
            if attempt == max_retries - 1:
                break
            await asyncio.sleep(2 ** (attempt + 1))
    raise last_exc if last_exc else RuntimeError(f"exhausted retries for {url}")


async def fetch_manifest(client: httpx.AsyncClient) -> str:
    res = await fetch_with_retry(client, MANIFEST_URL)
    return res.text


async def fetch_page(
    client: httpx.AsyncClient,
    url: str,
    output_dir: Path,
    semaphore: asyncio.Semaphore,
    force: bool,
    max_retries: int = 5,
) -> tuple[str, str, str]:
    """Return (url, status, info) where status is 'ok' | 'skip' | 'fail'."""
    out_path = url_to_output_path(url, output_dir)
    if not force and out_path.exists():
        return url, "skip", str(out_path.relative_to(REPO_ROOT))

    async with semaphore:
        try:
            res = await fetch_with_retry(client, url, max_retries=max_retries)
        except httpx.HTTPError as exc:
            return url, "fail", str(exc)

        out_path.parent.mkdir(parents=True, exist_ok=True)
        header = f"<!-- source: {url} -->\n\n"
        out_path.write_text(header + res.text, encoding="utf-8")
        return url, "ok", str(out_path.relative_to(REPO_ROOT))


async def run(output_dir: Path, concurrency: int, force: bool) -> int:
    output_dir.mkdir(parents=True, exist_ok=True)
    timeout = httpx.Timeout(30.0, connect=10.0)
    headers = {"User-Agent": USER_AGENT}

    async with httpx.AsyncClient(
        http2=False, timeout=timeout, headers=headers, follow_redirects=True
    ) as client:
        print(f"Fetching manifest {MANIFEST_URL}")
        manifest = await fetch_manifest(client)
        (output_dir / "llms.txt").write_text(manifest, encoding="utf-8")

        urls = sorted({m.group(0) for m in MD_URL_RE.finditer(manifest)})
        print(f"Found {len(urls)} markdown URLs. Fetching with concurrency={concurrency}")
        if not force:
            print("(re-run with --force to refetch already-downloaded pages)")
        print()

        semaphore = asyncio.Semaphore(concurrency)
        tasks = [fetch_page(client, url, output_dir, semaphore, force) for url in urls]

        ok = skipped = 0
        failed: list[tuple[str, str]] = []
        for coro in asyncio.as_completed(tasks):
            url, status, info = await coro
            if status == "ok":
                ok += 1
                print(f"  OK    {url} → {info}")
            elif status == "skip":
                skipped += 1
            else:
                failed.append((url, info))
                print(f"  FAIL  {url}: {info}")

    total = len(urls)
    print(
        f"\nDone. {ok} fetched, {skipped} skipped (already present), {len(failed)} failed "
        f"out of {total} → {output_dir.relative_to(REPO_ROOT)}/"
    )
    if failed:
        print(f"\n{len(failed)} failed:")
        for url, err in failed:
            print(f"  - {url}: {err}")
        return 1
    return 0


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--concurrency", type=int, default=5)
    parser.add_argument(
        "--force",
        action="store_true",
        help="Refetch URLs even if a local file already exists",
    )
    args = parser.parse_args()
    sys.exit(asyncio.run(run(args.output_dir, args.concurrency, args.force)))


if __name__ == "__main__":
    main()
