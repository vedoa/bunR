# Setup webR with bun

The idea is to show how to use webR with a more complex example (more then the hello world with a build in HTTP server) using R dependencies containing Fortran code (so the worst case possible :D). 
The endpoint minpack is based on [Nonlinear Least-Squares Data Fitting - Example D.2](https://math.gmu.edu/~igriva/book/Appendix%20D.pdf) .

## Prerequisites

You will need to either [install bun](https://bun.sh/docs/installation) or use a docker image mounting the src folder into the image. I will use docker since it is easier for me to work with. 

#### Docker setup

Get the image that you like the most. Example

```
docker pull oven/bun:1.2.17-debian
```

Run the image mounting the src folder into the container

```
docker container run --rm -it -p 3000:3000 -v ./src:/home/bun/app oven/bun:1.2.17-debian bash
```

### VS Code setup

Install the dev containers extension in vs code. Once you open this project vs code will prompt you to open the project in the bun:1.2.17-debian container.

## Recreate setup from scratch

Initialize bun project

```
bun init 
```

leading to the setup

```
package name (app): webrbun
entry point (index.ts): 

Done! A package.json file was saved in the current directory.
 + index.ts
 + .gitignore
 + tsconfig.json (for editor auto-complete)
 + README.md

To get started, run:
  bun run index.ts
```

Add the dependencies

```
bun add elysia @elysiajs/swagger webr
```

add dev dependencies for linting and formatting

```
bun add --dev --exact @biomejs/biome
bunx biome init
```

Check everything is working

```
bun run ./index.ts
```

output

```
Hello via Bun!
```

Add script(s) to the package.json file for easier calling of repeated steps

```
"scripts": {
  "runREST": "bun run ./index.ts"
}
```

## REST API description

I will build a REST api using

- [ElysiaJS](https://elysiajs.com/) - backend/routing etc.
- [@elysiajs/swagger](https://elysiajs.com/plugins/swagger) - plugin to auto-generate openapi page
- [WebR](https://docs.r-wasm.org/webr/latest/) - model fitting and random number generation
- [biomejs](https://biomejs.dev/) - lint and format

Running

```
bun runREST
```

will make the REST API available under localhost:3001. 

You can test the endpoints with the default values using the openapi endpoint localhost:3001/swagger.
