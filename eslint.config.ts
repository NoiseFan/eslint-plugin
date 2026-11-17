import antfu from '@antfu/eslint-config'
import noisefan from './src/index'

export default antfu({
  type: 'lib',
  typescript: true,
  ignores: ['tests/fixtures/**'],
}, ...noisefan.configs.all)
