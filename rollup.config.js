import replace from 'rollup-plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const libName = "speet"
const libNamespace = "speet"
const noDeclarationFiles = { compilerOptions: { declaration: false } }

export default [
  // commonJS
  {
    input: './src/index.ts',
    output: {
      file: `lib/${libName}.js`,
      format: 'cjs',
    },
    plugins: [
      typescript({ useTsconfigDeclarationDir: true }),
    ],
  },

  // esm
  {
    input: './src/index.ts',
    output: {
      file: `lib/${libName}.esm.js`,
      format: 'esm',
    },
    plugins: [
      typescript({ tsconfigOverride: noDeclarationFiles }),
    ],
  },

  // UMD Dev
  {
    input: 'src/index.ts',
    output: {
      file: `dist/${libName}.js`,
      format: 'umd',
      name: `${libNamespace}`,
    },
    plugins: [
      typescript({ tsconfigOverride: noDeclarationFiles }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development')
      }),
    ]
  },

  // UMD Prod
  {
    input: 'src/index.ts',
    output: {
      file: `dist/${libName}.min.js`,
      format: 'umd',
      name: `${libNamespace}`,
    },
    plugins: [
      typescript({ tsconfigOverride: noDeclarationFiles }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  }
]