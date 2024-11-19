# llmstxt

*generate `llms.txt`*–using your `sitemap.xml`.

&nbsp;

### Quickstart [![npm version](https://img.shields.io/npm/v/llmstxt.svg)](https://www.npmjs.com/package/llmstxt)

```sh
$ npm install llmstxt -g
```
```sh
$ llmstxt gen https://dotenvx.com/sitemap.xml
```

* <details><summary>expand example</summary><br>

  ```
  $ llmstxt gen https://dotenvx.com/sitemap.xml
  - [dotenvx run -f](https://dotenvx.com/docs/advanced/run-f.html): Compose multiple .env files for environment variables loading, as you need.
  - [dotenvx run --log-level](https://dotenvx.com/docs/advanced/run-log-level.html): Set `--log-level` to whatever you wish.
  - [dotenvx run --env HELLO=String](https://dotenvx.com/docs/advanced/run-overload.html): Override existing env variables. These can be variables already on your machine or variables loaded as files consecutively. The last variable seen will 'win'.
  - [dotenvx run --quiet](https://dotenvx.com/docs/advanced/run-quiet.html): Use `--quiet` to suppress all output (except errors).
  - [dotenvx run - Shell Expansion](https://dotenvx.com/docs/advanced/run-shell-expansion.html): Prevent your shell from expanding inline `$VARIABLES` before dotenvx has a chance to inject them. Use a subshell.
  ...
  ```

</details>

## Basics

> Basic usage
>

* <details><summary>`gen https://yoursite.com/sitemap.xml`</summary><br>

  Outputs to stdout.

  ```sh
  $ llmstxt gen https://dotenvx.com/sitemap.xml
  - [dotenvx run -f](https://dotenvx.com/docs/advanced/run-f.html): Compose multiple .env files for environment variables loading, as you need.
  - [dotenvx run --log-level](https://dotenvx.com/docs/advanced/run-log-level.html): Set `--log-level` to whatever you wish.
  - [dotenvx run --quiet](https://dotenvx.com/docs/advanced/run-quiet.html): Use `--quiet` to suppress all output (except errors).
  ...
  ```

  </details>
* <details><summary>`gen https://yoursite.com/sitemap.xml > llms.txt`</summary><br>

  Write to file.

  ```sh
  $ llmstxt gen https://dotenvx.com/sitemap.xml > llms.txt
  ```

  </details>

## Advanced

> Advanced options
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
* <details><summary>`gen --replace-title s/pattern/replacement/` - Replace string(s) from title</summary><br>

  Use `--replace-title` to remove redundant text from your page titles. For example, dotenvx's titles all end with `| dotenvx`. I want to replace those with empty string.

  ```sh
  $ llmstxt gen https://dotenvx.com/sitemap.xml --replace-title 's/\| dotenvx//'
  ```

  </details>

&nbsp;

## FAQ

#### Can you give me a real world example?

I'm using it to generate [dotenvx.com/llms.txt](https://dotenvx.com/llms.txt) with the following command:

```sh
llmstxt gen https://dotenvx.com/sitemap.xml -ep "**/privacy**" -ep "**/terms**" -ep "**/blog/**" -ep "**/stats/**" -ep "**/support/**" -rt 's/\| dotenvx//' > llms.txt
```
