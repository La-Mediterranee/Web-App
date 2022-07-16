// vite.config.ts
import * as path from "node:path";
import "node:fs/promises";
import "node:fs";
import browserslist from "browserslist";
import { platform } from "node:os";
import { readFileSync } from "node:fs";
import { sveltekit } from "@sveltejs/kit/vite";
function browserslistToEsbuild(browserslistConfig) {
  if (!browserslistConfig) {
    const path2 = process.cwd();
    browserslistConfig = browserslist.loadConfig({ path: path2 });
  }
  const SUPPORTED_ESBUILD_TARGETS = ["es", "chrome", "edge", "firefox", "ios", "node", "safari"];
  const replaces = {
    ios_saf: "ios",
    android: "chrome"
  };
  const SEPERATOR = " ";
  return browserslist(browserslistConfig).map((b) => b.split(SEPERATOR)).map((b) => {
    b[0] = replaces[b[0]] ? replaces[b[0]] : b[0];
    return b;
  }).map((b) => {
    if (b[1].includes("-")) {
      b[1] = b[1].slice(0, b[1].indexOf("-"));
    }
    return b;
  }).map((b) => {
    if (b[1].endsWith(".0")) {
      b[1] = b[1].slice(0, -2);
    }
    return b;
  }).filter((b) => SUPPORTED_ESBUILD_TARGETS.includes(b[0])).reduce((acc, b) => {
    const existingIndex = acc.findIndex((br) => br[0] === b[0]);
    if (existingIndex !== -1) {
      acc[existingIndex][1] = b[1];
    } else {
      acc.push(b);
    }
    return acc;
  }, []).map((b) => b.join(""));
}
var pkg = JSON.parse(readFileSync("./package.json", {
  encoding: "utf-8"
}));
function createViteConfig() {
  const browserslist2 = browserslistToEsbuild("last 5 major versions and >= 0.1% and supports es6-module and supports es6-module-dynamic-import");
  return {
    plugins: [sveltekit()],
    build: {
      target: browserslist2,
      minify: "terser",
      terserOptions: {
        ecma: 2015,
        module: true,
        compress: {
          keep_fargs: false
        },
        format: {
          comments: false
        }
      },
      rollupOptions: {
        plugins: []
      }
    },
    optimizeDeps: {},
    ssr: {},
    esbuild: {
      legalComments: "none"
    },
    server: {
      https: {
        cert: readFileSync(platform() === "linux" ? "./config/app-cert.windows.pem" : "./config/example.com+5.pem"),
        key: readFileSync(platform() === "linux" ? "./config/app-key.windows.pem" : "./config/example.com+5-key.pem")
      },
      host: true
    },
    css: {
      preprocessorOptions: {
        scss: {}
      }
    },
    resolve: {
      alias: {
        types: path.resolve("./src/lib/types"),
        $pages: path.resolve("./src/pages/"),
        $loaders: path.resolve("./src/routes/_loaders"),
        $i18n: path.resolve("./src/i18n"),
        $utils: path.resolve("./src/lib/utils"),
        $components: path.resolve("./src/lib/components"),
        $firebase: path.resolve("./src/lib/utils/firebase.ts"),
        $stores: path.resolve("./src/lib/stores")
      }
    }
  };
}
var vite_config_default = createViteConfig();
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCAqIGFzIHBhdGggZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ25vZGU6ZnMvcHJvbWlzZXMnO1xuaW1wb3J0ICogYXMgZnNTeW5jIGZyb20gJ25vZGU6ZnMnO1xuaW1wb3J0IGJyb3dzZXJzbGlzdCBmcm9tICdicm93c2Vyc2xpc3QnO1xuXG5pbXBvcnQgeyBwbGF0Zm9ybSB9IGZyb20gJ25vZGU6b3MnO1xuaW1wb3J0IHsgZnN0YXQsIHJlYWRGaWxlU3luYyB9IGZyb20gJ25vZGU6ZnMnO1xuaW1wb3J0IHsgc3ZlbHRla2l0IH0gZnJvbSAnQHN2ZWx0ZWpzL2tpdC92aXRlJztcbi8vIGltcG9ydCB7IHR5cGVzYWZlSTE4blBsdWdpbiB9IGZyb20gJ3R5cGVzYWZlLWkxOG4vcm9sbHVwL3JvbGx1cC1wbHVnaW4tdHlwZXNhZmUtaTE4bic7XG5cbmltcG9ydCB0eXBlIHsgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nIHwgcmVhZG9ubHkgc3RyaW5nW119IGJyb3dzZXJzbGlzdENvbmZpZ1xuICovXG5mdW5jdGlvbiBicm93c2Vyc2xpc3RUb0VzYnVpbGQoYnJvd3NlcnNsaXN0Q29uZmlnOiBzdHJpbmcgfCByZWFkb25seSBzdHJpbmdbXSk6IHN0cmluZ1tdIHtcblx0aWYgKCFicm93c2Vyc2xpc3RDb25maWcpIHtcblx0XHQvLyB0aGUgcGF0aCBmcm9tIHdoZXJlIHRoZSBzY3JpcHQgaXMgcnVuXG5cdFx0Y29uc3QgcGF0aCA9IHByb2Nlc3MuY3dkKCk7XG5cblx0XHQvLyByZWFkIGNvbmZpZyBpZiBub25lIGlzIHBhc3NlZFxuXHRcdGJyb3dzZXJzbGlzdENvbmZpZyA9IGJyb3dzZXJzbGlzdC5sb2FkQ29uZmlnKHsgcGF0aCB9KSE7XG5cdH1cblxuXHRjb25zdCBTVVBQT1JURURfRVNCVUlMRF9UQVJHRVRTID0gWydlcycsICdjaHJvbWUnLCAnZWRnZScsICdmaXJlZm94JywgJ2lvcycsICdub2RlJywgJ3NhZmFyaSddO1xuXG5cdGNvbnN0IHJlcGxhY2VzID0ge1xuXHRcdGlvc19zYWY6ICdpb3MnLFxuXHRcdGFuZHJvaWQ6ICdjaHJvbWUnLFxuXHR9O1xuXG5cdGNvbnN0IFNFUEVSQVRPUiA9ICcgJztcblxuXHRyZXR1cm4gKFxuXHRcdGJyb3dzZXJzbGlzdChicm93c2Vyc2xpc3RDb25maWcpXG5cdFx0XHQvLyB0cmFuc2Zvcm0gaW50byBbJ2Nocm9tZScsICc4OCddXG5cdFx0XHQubWFwKGIgPT4gYi5zcGxpdChTRVBFUkFUT1IpKVxuXHRcdFx0Ly8gcmVwbGFjZSB0aGUgc2ltaWxhciBicm93c2VyXG5cdFx0XHQubWFwKGIgPT4ge1xuXHRcdFx0XHRiWzBdID0gcmVwbGFjZXNbYlswXV0gPyByZXBsYWNlc1tiWzBdXSA6IGJbMF07XG5cdFx0XHRcdHJldHVybiBiO1xuXHRcdFx0fSlcblx0XHRcdC8vIDExLjAtMTIuMCAtLT4gMTEuMFxuXHRcdFx0Lm1hcChiID0+IHtcblx0XHRcdFx0aWYgKGJbMV0uaW5jbHVkZXMoJy0nKSkge1xuXHRcdFx0XHRcdGJbMV0gPSBiWzFdLnNsaWNlKDAsIGJbMV0uaW5kZXhPZignLScpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBiO1xuXHRcdFx0fSlcblx0XHRcdC8vIDExLjAgLS0+IDExXG5cdFx0XHQubWFwKGIgPT4ge1xuXHRcdFx0XHRpZiAoYlsxXS5lbmRzV2l0aCgnLjAnKSkge1xuXHRcdFx0XHRcdGJbMV0gPSBiWzFdLnNsaWNlKDAsIC0yKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBiO1xuXHRcdFx0fSlcblx0XHRcdC8vIG9ubHkgZ2V0IHRoZSBvbmVzIHN1cHBvcnRlZCBieSBlc2J1aWxkXG5cdFx0XHQuZmlsdGVyKGIgPT4gU1VQUE9SVEVEX0VTQlVJTERfVEFSR0VUUy5pbmNsdWRlcyhiWzBdKSlcblx0XHRcdC8vIG9ubHkgZ2V0IHRoZSBvbGRlc3QgdmVyc2lvblxuXHRcdFx0LnJlZHVjZSgoYWNjLCBiKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGV4aXN0aW5nSW5kZXggPSBhY2MuZmluZEluZGV4KGJyID0+IGJyWzBdID09PSBiWzBdKTtcblxuXHRcdFx0XHRpZiAoZXhpc3RpbmdJbmRleCAhPT0gLTEpIHtcblx0XHRcdFx0XHRhY2NbZXhpc3RpbmdJbmRleF1bMV0gPSBiWzFdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGFjYy5wdXNoKGIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGFjYztcblx0XHRcdH0sIFtdIGFzIHN0cmluZ1tdW10pXG5cdFx0XHQvLyByZW1vdmUgc2VwYXJhdG9yXG5cdFx0XHQubWFwKGIgPT4gYi5qb2luKCcnKSlcblx0KTtcbn1cblxuY29uc3QgcGtnID0gSlNPTi5wYXJzZShcblx0cmVhZEZpbGVTeW5jKCcuL3BhY2thZ2UuanNvbicsIHtcblx0XHRlbmNvZGluZzogJ3V0Zi04Jyxcblx0fSksXG4pO1xuXG5mdW5jdGlvbiBjcmVhdGVWaXRlQ29uZmlnKCk6IFVzZXJDb25maWcge1xuXHQvLyBjb25zdCBleHRlcm5hbCA9XG5cdC8vIFx0ZGV2XG5cdC8vIFx0XHQ/IFsnd2hhdHdnLXVybCcsICdub2RlLWZldGNoJ11cblx0Ly8gXHRcdDogWydmaXJlYmFzZS9tZXNzYWdpbmcnXTtcblxuXHRjb25zdCBicm93c2Vyc2xpc3QgPSBicm93c2Vyc2xpc3RUb0VzYnVpbGQoXG5cdFx0J2xhc3QgNSBtYWpvciB2ZXJzaW9ucyBhbmQgPj0gMC4xJSBhbmQgc3VwcG9ydHMgZXM2LW1vZHVsZSBhbmQgc3VwcG9ydHMgZXM2LW1vZHVsZS1keW5hbWljLWltcG9ydCcsXG5cdCk7XG5cdHJldHVybiB7XG5cdFx0cGx1Z2luczogW3N2ZWx0ZWtpdCgpXSxcblx0XHRidWlsZDoge1xuXHRcdFx0dGFyZ2V0OiBicm93c2Vyc2xpc3QsXG5cdFx0XHRtaW5pZnk6ICd0ZXJzZXInLFxuXHRcdFx0dGVyc2VyT3B0aW9uczoge1xuXHRcdFx0XHRlY21hOiAyMDE1LFxuXHRcdFx0XHRtb2R1bGU6IHRydWUsXG5cdFx0XHRcdGNvbXByZXNzOiB7XG5cdFx0XHRcdFx0a2VlcF9mYXJnczogZmFsc2UsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm1hdDoge1xuXHRcdFx0XHRcdGNvbW1lbnRzOiBmYWxzZSxcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0XHQvLyBzb3VyY2VtYXA6IHRydWUsXG5cdFx0XHRyb2xsdXBPcHRpb25zOiB7XG5cdFx0XHRcdHBsdWdpbnM6IFtcblx0XHRcdFx0XHQvLyB2aXN1YWxpemVyKHtcblx0XHRcdFx0XHQvLyBcdHRlbXBsYXRlOiAndHJlZW1hcCcsXG5cdFx0XHRcdFx0Ly8gXHRzb3VyY2VtYXA6IHRydWUsXG5cdFx0XHRcdFx0Ly8gXHRnemlwU2l6ZTogdHJ1ZSxcblx0XHRcdFx0XHQvLyB9KSxcblx0XHRcdFx0XHQvLyB0eXBlc2FmZUkxOG5QbHVnaW4oKSxcblx0XHRcdFx0XSxcblx0XHRcdH0sXG5cdFx0fSxcblx0XHRvcHRpbWl6ZURlcHM6IHtcblx0XHRcdC8vIGV4Y2x1ZGU6IE9iamVjdC5rZXlzKHBrZy5kZXBlbmRlbmNpZXMpLFxuXHRcdH0sXG5cdFx0c3NyOiB7XG5cdFx0XHQvLyBleHRlcm5hbDogZXh0ZXJuYWwsXG5cdFx0fSxcblx0XHRlc2J1aWxkOiB7XG5cdFx0XHRsZWdhbENvbW1lbnRzOiAnbm9uZScsXG5cdFx0fSxcblx0XHRzZXJ2ZXI6IHtcblx0XHRcdGh0dHBzOiB7XG5cdFx0XHRcdGNlcnQ6IHJlYWRGaWxlU3luYyhcblx0XHRcdFx0XHRwbGF0Zm9ybSgpID09PSAnbGludXgnXG5cdFx0XHRcdFx0XHQ/ICcuL2NvbmZpZy9hcHAtY2VydC53aW5kb3dzLnBlbSdcblx0XHRcdFx0XHRcdDogJy4vY29uZmlnL2V4YW1wbGUuY29tKzUucGVtJyxcblx0XHRcdFx0KSxcblx0XHRcdFx0a2V5OiByZWFkRmlsZVN5bmMoXG5cdFx0XHRcdFx0cGxhdGZvcm0oKSA9PT0gJ2xpbnV4J1xuXHRcdFx0XHRcdFx0PyAnLi9jb25maWcvYXBwLWtleS53aW5kb3dzLnBlbSdcblx0XHRcdFx0XHRcdDogJy4vY29uZmlnL2V4YW1wbGUuY29tKzUta2V5LnBlbScsXG5cdFx0XHRcdCksXG5cdFx0XHR9LFxuXHRcdFx0aG9zdDogdHJ1ZSxcblx0XHRcdC8vIHByb3h5OiB7XG5cdFx0XHQvLyBcdCcvYXBpJzoge1xuXHRcdFx0Ly8gXHRcdHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTAwMCcsXG5cdFx0XHQvLyBcdFx0Y2hhbmdlT3JpZ2luOiB0cnVlLFxuXHRcdFx0Ly8gXHR9LFxuXHRcdFx0Ly8gfSxcblx0XHR9LFxuXHRcdGNzczoge1xuXHRcdFx0cHJlcHJvY2Vzc29yT3B0aW9uczoge1xuXHRcdFx0XHRzY3NzOiB7XG5cdFx0XHRcdFx0Ly8gYWRkaXRpb25hbERhdGE6IGAkaW5qZWN0ZWRDb2xvcjogb3JhbmdlO2Bcblx0XHRcdFx0XHQvLyBwcmVwZW5kRGF0YTpcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0fSxcblx0XHRyZXNvbHZlOiB7XG5cdFx0XHRhbGlhczoge1xuXHRcdFx0XHR0eXBlczogcGF0aC5yZXNvbHZlKCcuL3NyYy9saWIvdHlwZXMnKSxcblx0XHRcdFx0JHBhZ2VzOiBwYXRoLnJlc29sdmUoJy4vc3JjL3BhZ2VzLycpLFxuXHRcdFx0XHQkbG9hZGVyczogcGF0aC5yZXNvbHZlKCcuL3NyYy9yb3V0ZXMvX2xvYWRlcnMnKSxcblx0XHRcdFx0JGkxOG46IHBhdGgucmVzb2x2ZSgnLi9zcmMvaTE4bicpLFxuXHRcdFx0XHQkdXRpbHM6IHBhdGgucmVzb2x2ZSgnLi9zcmMvbGliL3V0aWxzJyksXG5cdFx0XHRcdCRjb21wb25lbnRzOiBwYXRoLnJlc29sdmUoJy4vc3JjL2xpYi9jb21wb25lbnRzJyksXG5cdFx0XHRcdCRmaXJlYmFzZTogcGF0aC5yZXNvbHZlKCcuL3NyYy9saWIvdXRpbHMvZmlyZWJhc2UudHMnKSxcblx0XHRcdFx0JHN0b3JlczogcGF0aC5yZXNvbHZlKCcuL3NyYy9saWIvc3RvcmVzJyksXG5cdFx0XHR9LFxuXHRcdH0sXG5cdH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVZpdGVDb25maWcoKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQVFBLCtCQUErQixvQkFBMEQ7QUFDeEYsTUFBSSxDQUFDLG9CQUFvQjtBQUV4QixVQUFNLFFBQU8sUUFBUSxJQUFJO0FBR3pCLHlCQUFxQixhQUFhLFdBQVcsRUFBRSxZQUFLLENBQUM7QUFBQSxFQUN0RDtBQUVBLFFBQU0sNEJBQTRCLENBQUMsTUFBTSxVQUFVLFFBQVEsV0FBVyxPQUFPLFFBQVEsUUFBUTtBQUU3RixRQUFNLFdBQVc7QUFBQSxJQUNoQixTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUEsRUFDVjtBQUVBLFFBQU0sWUFBWTtBQUVsQixTQUNDLGFBQWEsa0JBQWtCLEVBRTdCLElBQUksT0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDLEVBRTNCLElBQUksT0FBSztBQUNULE1BQUUsS0FBSyxTQUFTLEVBQUUsTUFBTSxTQUFTLEVBQUUsTUFBTSxFQUFFO0FBQzNDLFdBQU87QUFBQSxFQUNSLENBQUMsRUFFQSxJQUFJLE9BQUs7QUFDVCxRQUFJLEVBQUUsR0FBRyxTQUFTLEdBQUcsR0FBRztBQUN2QixRQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sR0FBRyxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUM7QUFBQSxJQUN2QztBQUVBLFdBQU87QUFBQSxFQUNSLENBQUMsRUFFQSxJQUFJLE9BQUs7QUFDVCxRQUFJLEVBQUUsR0FBRyxTQUFTLElBQUksR0FBRztBQUN4QixRQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sR0FBRyxFQUFFO0FBQUEsSUFDeEI7QUFFQSxXQUFPO0FBQUEsRUFDUixDQUFDLEVBRUEsT0FBTyxPQUFLLDBCQUEwQixTQUFTLEVBQUUsRUFBRSxDQUFDLEVBRXBELE9BQU8sQ0FBQyxLQUFLLE1BQU07QUFDbkIsVUFBTSxnQkFBZ0IsSUFBSSxVQUFVLFFBQU0sR0FBRyxPQUFPLEVBQUUsRUFBRTtBQUV4RCxRQUFJLGtCQUFrQixJQUFJO0FBQ3pCLFVBQUksZUFBZSxLQUFLLEVBQUU7QUFBQSxJQUMzQixPQUFPO0FBQ04sVUFBSSxLQUFLLENBQUM7QUFBQSxJQUNYO0FBRUEsV0FBTztBQUFBLEVBQ1IsR0FBRyxDQUFDLENBQWUsRUFFbEIsSUFBSSxPQUFLLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFFdkI7QUFFQSxJQUFNLE1BQU0sS0FBSyxNQUNoQixhQUFhLGtCQUFrQjtBQUFBLEVBQzlCLFVBQVU7QUFDWCxDQUFDLENBQ0Y7QUFFQSw0QkFBd0M7QUFNdkMsUUFBTSxnQkFBZSxzQkFDcEIsa0dBQ0Q7QUFDQSxTQUFPO0FBQUEsSUFDTixTQUFTLENBQUMsVUFBVSxDQUFDO0FBQUEsSUFDckIsT0FBTztBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsUUFBUTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2QsTUFBTTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsVUFBVTtBQUFBLFVBQ1QsWUFBWTtBQUFBLFFBQ2I7QUFBQSxRQUNBLFFBQVE7QUFBQSxVQUNQLFVBQVU7QUFBQSxRQUNYO0FBQUEsTUFDRDtBQUFBLE1BRUEsZUFBZTtBQUFBLFFBQ2QsU0FBUyxDQU9UO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQSxJQUNBLGNBQWMsQ0FFZDtBQUFBLElBQ0EsS0FBSyxDQUVMO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUixlQUFlO0FBQUEsSUFDaEI7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNOLE1BQU0sYUFDTCxTQUFTLE1BQU0sVUFDWixrQ0FDQSw0QkFDSjtBQUFBLFFBQ0EsS0FBSyxhQUNKLFNBQVMsTUFBTSxVQUNaLGlDQUNBLGdDQUNKO0FBQUEsTUFDRDtBQUFBLE1BQ0EsTUFBTTtBQUFBLElBT1A7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNKLHFCQUFxQjtBQUFBLFFBQ3BCLE1BQU0sQ0FHTjtBQUFBLE1BQ0Q7QUFBQSxJQUNEO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUixPQUFPO0FBQUEsUUFDTixPQUFPLEFBQUssYUFBUSxpQkFBaUI7QUFBQSxRQUNyQyxRQUFRLEFBQUssYUFBUSxjQUFjO0FBQUEsUUFDbkMsVUFBVSxBQUFLLGFBQVEsdUJBQXVCO0FBQUEsUUFDOUMsT0FBTyxBQUFLLGFBQVEsWUFBWTtBQUFBLFFBQ2hDLFFBQVEsQUFBSyxhQUFRLGlCQUFpQjtBQUFBLFFBQ3RDLGFBQWEsQUFBSyxhQUFRLHNCQUFzQjtBQUFBLFFBQ2hELFdBQVcsQUFBSyxhQUFRLDZCQUE2QjtBQUFBLFFBQ3JELFNBQVMsQUFBSyxhQUFRLGtCQUFrQjtBQUFBLE1BQ3pDO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFDRDtBQUVBLElBQU8sc0JBQVEsaUJBQWlCOyIsCiAgIm5hbWVzIjogW10KfQo=
