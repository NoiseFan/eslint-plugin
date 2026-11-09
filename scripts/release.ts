import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

export function getPublishTag(version: string): string {
  const prerelease = version.split('+')[0].split('-').slice(1).join('-')
  if (!prerelease)
    return 'latest'

  const tag = prerelease.split('.')[0]
  return /^[a-z][a-z\d-]*$/i.test(tag) ? tag : 'next'
}

export function release(args: string[]): void {
  if (!args.includes('--publish') && !args.includes('--dry-run')) {
    execFileSync('pnpm', ['exec', 'bumpp', '-r', ...args], { stdio: 'inherit' })
    return
  }

  const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version: string }

  if (process.env.GITHUB_REF_TYPE === 'tag' && process.env.GITHUB_REF_NAME !== `v${version}`)
    throw new Error(`The release tag must match package.json version v${version}.`)

  execFileSync('npm', [
    'publish',
    '--access',
    'public',
    '--tag',
    getPublishTag(version),
    ...args.filter(arg => arg !== '--publish'),
  ], { stdio: 'inherit' })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  release(process.argv.slice(2))
