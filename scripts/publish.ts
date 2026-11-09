// @env node
import { execFileSync } from 'node:child_process'
import process from 'node:process'
import { version } from '../package.json'
import { getPublishTag } from './release'

if (process.env.GITHUB_REF_TYPE === 'tag' && process.env.GITHUB_REF_NAME !== `v${version}`)
  throw new Error(`The release tag must match package.json version v${version}.`)

execFileSync('npm', [
  'publish',
  '--access',
  'public',
  '--tag',
  getPublishTag(version),
  ...process.argv.slice(2),
], { stdio: 'inherit' })
