// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.?(t|j)s?(x)'],

  // To set src/ as @/
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // DON'T SET THIS HERE - it's overridden below
  transformIgnorePatterns: [],
}

module.exports = async function () {
  const makeConfig = await createJestConfig(customJestConfig)
  const finalJestConfig = await makeConfig()

  // This replaces the default of '/node_modules/'
  finalJestConfig.transformIgnorePatterns[0] =
    '/node_modules/(?!react-use-measure|@motionone|framesync|popmotion|style-value-types|hey-listen|tslib|framer-motion|@juggle|@minoru/react-dnd-treeview|@babel|redux|@react-dnd|react-dnd|dnd-core|react-dnd-html5-backend|dnd-multi-backend/)'

  return finalJestConfig
}
