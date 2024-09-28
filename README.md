# Setup webR with bun

The idea is to show how to use webR with a more complex example (more then the hello world with a build in HTTP server) using R dependencies containing Fortran code (so the worst case possible :D). 
The endpoint minpack is based on [Nonlinear Least-Squares Data Fitting - Example D.2](https://math.gmu.edu/~igriva/book/Appendix%20D.pdf) .

## Prerequisites

You will need to either [install bun](https://bun.sh/docs/installation) or use a docker image mounting the src folder into the image. I will use docker since it is easier for me to work with. 

#### Docker setup

Get the image that you like the most. Example

```
docker pull oven/bun:1.1.29-debian
```

Run the image mounting the src folder into the container

```
docker container run --rm -it -p 3000:3000 -v ./src:/home/bun/app oven/bun:1.1.29-debian bash
```

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
bun add elysia@1.1.16 @elysiajs/swagger@1.1.1 webr@0.4.2 
```

add dev dependencies for linitng and formating

```
bun add --dev --exact @biomejs/biome@1.9.2
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

Make sure to have a folder called libraries under ./src/R otherwise the code will not work.

Add scripts to the package.json file for easier calling of repeated steps

```
"scripts": {
  "bFormat": "bunx biome format --write .",
  "bLint": "bunx biome lint .",
  "rDeps": "bun run ./R/setup-dependencies.ts",
  "runREST": "bun run ./index.ts"
}
```

## REST API description

I will build a REST api using

- [ElysiaJS](https://elysiajs.com/) - backend/routing etc.
- @elysiajs/swagger - plugin to auto-generate openapi page
- [WebR](https://docs.r-wasm.org/webr/latest/) - model fitting and random number generation

Running

```
bun runREST
```

will make the REST API available under localhost:3000. 

You can test the endpoints with the default values using the openapi endpoint localhost:3000/swagger.
