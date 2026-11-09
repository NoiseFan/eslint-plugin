import { describe, expect, it } from 'vitest'
import { getPublishTag } from '../scripts/release'

describe('npm release channels', () => {
  it.each([
    ['1.0.0', 'latest'],
    ['1.0.0+build.1', 'latest'],
    ['1.1.0-alpha.1', 'alpha'],
    ['1.1.0-beta.2', 'beta'],
    ['1.1.0-rc.1+build.1', 'rc'],
    ['1.1.0-0', 'next'],
  ])('publishes %s to %s', (version, tag) => {
    expect(getPublishTag(version)).toBe(tag)
  })
})
