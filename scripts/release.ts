export function getPublishTag(version: string): string {
  const prerelease = version.split('+')[0].split('-').slice(1).join('-')
  if (!prerelease)
    return 'latest'

  const tag = prerelease.split('.')[0]
  return /^[a-z][a-z\d-]*$/i.test(tag) ? tag : 'next'
}
