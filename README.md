# Vercel and Prisma Client bug reproduction

## Prisma Client isn't generated on deploying to Vercel

The essence of the problem seems to be that Vercel ships a cached version of node_modules with the functions and in some situations the cached node_modules doesn't contain the generated Prisma Client (from the `postinstall` script in Prisma Client or the [`build`](./package.json#L7) script of the actual project). There are certain circumstances that cause this cache to get busted, like updating the `package-lock.json`.

This is a problem when making changes to the Prisma schema. For example, when you add a new field, migrate the database, and update one of your functions to use the new field. When the changes are committed and pushed, Vercel triggers a build that loads the node_modules folder from cache.

Original issue: https://github.com/prisma/prisma/issues/5175

## Reproduction details

In this repo, the following [commit](https://github.com/2color/vercel-prisma-reproduction/commit/4f2194cc1b566dcfba3abe94dc0090fa33432bbd) adds a new field to the Prisma schema and uses it in the `api/feed.js` serverless function. 

Prisma will generate the Prisma Client code to `node_modules` when `prisma generate` is called.

Here's the Vercel build log for the commit: 
```
14:39:11.323  	Cloning github.com/2color/vercel-prisma-reproduction (Branch: main, Commit: 4f2194c)
14:39:12.008  	Cloning completed in 685ms
14:39:12.010  	Analyzing source code...
14:39:12.857  	Installing build runtime...
14:39:13.373  	Build runtime installed: 515.780ms
14:39:14.149  	Looking up build cache...
14:39:14.259  	Build cache found. Downloading...
14:39:14.323  	Installing build runtime...
14:39:14.938  	Build runtime installed: 614.837ms
14:39:16.002  	Looking up build cache...
14:39:16.057  	Installing build runtime...
14:39:16.092  	Build cache found. Downloading...
14:39:16.305  	Build cache downloaded [50.34 MB]: 2045.29ms
14:39:16.812  	Build runtime installed: 754.802ms
14:39:17.514  	Installing dependencies...
14:39:18.003  	Installing build runtime...
14:39:18.014  	Looking up build cache...
14:39:18.224  	Build cache found. Downloading...
14:39:18.449  	npm WARN vercel-prisma-reproduction@1.0.0 No description
14:39:18.458  	npm WARN vercel-prisma-reproduction@1.0.0 No repository field.
14:39:18.461  	up to date in 0.184s
14:39:18.710  	Build cache downloaded [50.34 MB]: 2616.522ms
14:39:18.922  	Build runtime installed: 917.483ms
14:39:19.922  	Installing dependencies...
14:39:20.218  	Looking up build cache...
14:39:20.325  	Build cache found. Downloading...
14:39:20.568  	Installing build runtime...
14:39:21.249  	npm WARN vercel-prisma-reproduction@1.0.0 No description
14:39:21.256  	npm WARN vercel-prisma-reproduction@1.0.0 No repository field.
14:39:21.257  	up to date in 0.282s
14:39:21.587  	Build cache downloaded [50.34 MB]: 3454.605ms
14:39:21.914  	Build runtime installed: 1346.237ms
14:39:23.236  	Installing dependencies...
14:39:23.508  	Looking up build cache...
14:39:23.646  	Build cache found. Downloading...
14:39:24.098  	Build cache downloaded [50.34 MB]: 3771.634ms
14:39:24.242  	npm WARN vercel-prisma-reproduction@1.0.0 No description
14:39:24.249  	npm WARN vercel-prisma-reproduction@1.0.0 No repository field.
14:39:24.250  	up to date in 0.194s
14:39:25.586  	Installing dependencies...
14:39:26.884  	npm WARN vercel-prisma-reproduction@1.0.0 No description
14:39:26.890  	npm WARN vercel-prisma-reproduction@1.0.0 No repository field.
14:39:26.892  	up to date in 0.264s
14:39:27.203  	Uploading build outputs...
14:39:28.422  	Build cache downloaded [50.34 MB]: 4775.952ms
14:39:29.521  	Installing dependencies...
14:39:29.926  	Uploading build outputs...
14:39:30.287  	npm WARN vercel-prisma-reproduction@1.0.0 No description
14:39:30.293  	npm WARN vercel-prisma-reproduction@1.0.0 No repository field.
14:39:30.294  	up to date in 0.144s
14:39:31.388  	Installing build runtime...
14:39:32.231  	Build runtime installed: 842.091ms
14:39:32.392  	Uploading build outputs...
14:39:32.601  	Done with "api/post/[id].js"
14:39:33.356  	Installing dependencies...
14:39:33.730  	Installing build runtime...
14:39:33.822  	Uploading build outputs...
14:39:34.039  	npm WARN vercel-prisma-reproduction@1.0.0 No description
14:39:34.047  	npm WARN vercel-prisma-reproduction@1.0.0 No repository field.
14:39:34.048  	up to date in 0.153s
14:39:34.377  	Build runtime installed: 645.554ms
14:39:35.269  	Looking up build cache...
14:39:35.292  	Done with "api/post/comment.js"
14:39:35.452  	Build cache found. Downloading...
14:39:36.630  	Uploading build outputs...
14:39:36.656  	Done with "api/post/index.js"
14:39:37.743  	Build cache downloaded [50.35 MB]: 2291.021ms
14:39:38.490  	Installing dependencies...
14:39:39.062  	npm WARN vercel-prisma-reproduction@1.0.0 No description
14:39:39.066  	npm WARN vercel-prisma-reproduction@1.0.0 No repository field.
14:39:39.067  	up to date in 0.083s
14:39:39.082  	Running "npm run build"
14:39:39.279  	> vercel-prisma-reproduction@1.0.0 build /vercel/workpath1
14:39:39.279  	> prisma generate
14:39:39.336  	Uploading build outputs...
14:39:39.573  	Done with "api/post/like.js"
14:39:39.747  	Prisma schema loaded from prisma/schema.prisma
14:39:40.280  	✔ Generated Prisma Client (2.14.0) to ./node_modules/@prisma/client in 74ms
14:39:40.280  	You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client
14:39:40.280  	```
14:39:40.280  	import { PrismaClient } from '@prisma/client'
14:39:40.280  	const prisma = new PrismaClient()
14:39:40.280  	```
14:39:40.280  	warn Prisma 2.12.0 has breaking changes.
14:39:40.280  	You can update your code with
14:39:40.280  	`npx @prisma/codemods update-2.12 ./`
14:39:40.280  	Read more at https://pris.ly/2.12
14:39:41.757  	Done with "api/user.js"
14:39:43.020  	Uploading build outputs...
14:39:49.417  	Build completed. Populating build cache...
14:39:54.448  	Uploading build cache [50.34 MB]...
14:39:55.286  	Build cache uploaded: 837.630ms
14:39:55.506  	Done with "api/feed.js"
14:39:55.975  	Build completed. Populating build cache...
14:40:01.074  	Uploading build cache [50.35 MB]...
14:40:03.207  	Build cache uploaded: 2130.370ms
14:40:03.426  	Done with "package.json"
```

The problem shows up when the `/api/feed` endpoint the following error is logged:

```
2021-01-19T14:03:41.740Z	e39cbfce-4e11-4491-bb72-e43820413e09	ERROR	PrismaClientValidationError: 
Unknown field `newfield` for select statement on model Post.
    at Document.validate (/var/task/node_modules/@prisma/client/runtime/index.js:76024:19)
    at NewPrismaClient._executeRequest (/var/task/node_modules/@prisma/client/runtime/index.js:77790:17)
    at /var/task/node_modules/@prisma/client/runtime/index.js:77726:52
    at AsyncResource.runInAsyncScope (async_hooks.js:189:9)
    at NewPrismaClient._request (/var/task/node_modules/@prisma/client/runtime/index.js:77726:25)
    at Object.then (/var/task/node_modules/@prisma/client/runtime/index.js:77845:39)
    at processTicksAndRejections (internal/process/task_queues.js:97:5) {
  clientVersion: '2.14.0'
}
```

This is due to latest generated Prisma Client not being shipped/deployed in the `/api/feed` function.

