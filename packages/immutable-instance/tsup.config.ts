import { BuildOptions, Plugin } from "esbuild";
import fs, { readFileSync } from "fs";
import path from "path";
import { defineConfig } from "tsup";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));
const version = pkg.version;

/**
 * Environment variables to be injected at build time
 */
const buildEnvironment = {
  CLI_VERSION: version,
  BUILD_TIMESTAMP: new Date().toISOString(),
};

const currentYear = new Date().getFullYear();
const footerText = `
// 🚩 immutable-instance v${version}
// Use immutable class instances in React
// Copyright © ${currentYear} | Made with ❤️
`;

/**
 * Creates a build-time plugin to copy static files (like README.md) to the output directory
 * @param files Array of file paths to copy from project root to the output directory
 * @param outDir Destination folder (usually tsup's dist folder)
 * @returns An esbuild plugin that copies the specified files after build
 */
export function createCopyFilesPlugin(files: string[], outDir: string): Plugin {
  return {
    name: "copy-files-plugin",
    setup(build) {
      build.onEnd(() => {
        files.forEach((file) => {
          const src = path.resolve(process.cwd(), file);
          const dest = path.resolve(outDir, path.basename(file));
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`✅ Copied ${file} to ${outDir}`);
          } else {
            console.warn(`⚠️ File not found: ${file}`);
          }
        });
      });
    },
  };
}

/**
 * Creates a build time logging plugin
 * @returns An esbuild plugin that logs build time
 */
function createBuildTimePlugin(): Plugin {
  return {
    name: "log-build-time",
    setup(build) {
      const startTime = Date.now();
      build.onStart(() => {
        console.info(
          "\n🚀 [eslint-plugin-feature-flags:core] Build started..."
        );
      });
      build.onEnd(() => {
        const endTime = Date.now();
        console.info(`⏱️ Build completed in ${endTime - startTime}ms`);
      });
    },
  };
}

/**
 * Custom callback to run after successful build
 */
async function onBuildSuccess(): Promise<void> {
  console.info("✅ Build completed successfully!");
  console.info("📦 Logger bundle is ready for distribution.");
}

/**
 * Configure esbuild options
 * @param options The esbuild options object
 */
function configureEsbuild(options: BuildOptions): void {
  options.sourcesContent = true; // Keep source content in source maps
}

export default defineConfig({
  // Entry points
  entry: ["src/index.ts"],
  // Output format
  format: ["esm"],
  target: "es2022",

  // Bundle configuration
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  shims: true,
  external: ["react"],

  // Optimization options
  minify: true,
  skipNodeModulesBundle: false,
  metafile: true,
  treeshake: true,

  // Footer
  footer: { js: footerText },

  env: buildEnvironment,
  platform: "node",

  // Custom functions
  onSuccess: onBuildSuccess,
  esbuildOptions: configureEsbuild,
  outExtension: ({ format }) => ({ js: `.${format}.js` }),

  // Plugins
  esbuildPlugins: [
    createBuildTimePlugin(),
    createCopyFilesPlugin(["README.md", "LICENSE"], "dist"),
  ],
});
