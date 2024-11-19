# llmstxt

*generate [`llms.txt`](https://dotenvx.com/llms.txt)*–using your [`sitemap.xml`](https://dotenvx.com/sitemap.xml).

* generate from `https://yoursite/sitemap.xml`
* exclude/include url paths
* stdout to `llms.txt` file

&nbsp;


### Quickstart [![npm version](https://img.shields.io/npm/v/llmstxt.svg)](https://www.npmjs.com/package/llmstxt)

Install it globally.

```sh
npm install llmstxt -g
```

Use it as a cli to stdout.

```sh
$ llmstxt gen https://dotenvx.com/sitemap.xml

- [dotenvx run -f](https://dotenvx.com/docs/advanced/run-f.html): Compose multiple .env files for environment variables loading, as you need.
- [dotenvx run --log-level](https://dotenvx.com/docs/advanced/run-log-level.html): Set `--log-level` to whatever you wish.
- [dotenvx run --env HELLO=String](https://dotenvx.com/docs/advanced/run-overload.html): Override existing env variables. These can be variables already on your machine or variables loaded as files consecutively. The last variable seen will 'win'.
- [dotenvx run --quiet](https://dotenvx.com/docs/advanced/run-quiet.html): Use `--quiet` to suppress all output (except errors).
- [dotenvx run - Shell Expansion](https://dotenvx.com/docs/advanced/run-shell-expansion.html): Prevent your shell from expanding inline `$VARIABLES` before dotenvx has a chance to inject them. Use a subshell.
```

Pipe it to `llms.txt` file.

```sh
$ llmstxt gen https://dotenvx.com/sitemap.xml > llms.txt
# replace with your sitemap url
```

## Advanced

> Customize generation.
>

* <details><summary>`gen --exclude-path` - Exclude path(s)</summary><br>

  Exclude paths from generation.

  ```sh
  # exclude all blog posts
  $ llmstxt gen https://dotenvx.com/sitemap.xml --exclude-path "**/blog/**"

  # exclude all docs
  $ llmstxt gen https://dotenvx.com/sitemap.xml --exclude-path "**/docs/**"

  # exclude privacy and terms
  $ llmstxt gen https://dotenvx.com/sitemap.xml -ep "**/privacy**" -ep "**/terms**"
  ```

  </details>
* <details><summary>`gen --include-path` - Include path(s)</summary><br>

  Include paths for generation.

  ```sh
  # include all docs only
  $ llmstxt gen https://dotenvx.com/sitemap.xml --include-path "**/docs/**"

  # include all blogs only
  $ llmstxt gen https://dotenvx.com/sitemap.xml -ip "**/blog/**"
  ```

  </details>

&nbsp;
