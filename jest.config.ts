import { pathsToModuleNameMapper, JestConfigWithTsJest } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: '<rootDir>/src'
})

export default {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: ['**/*.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules',
    '/constants',
    '.fixture.ts',
    '.command.ts',
    '.module.ts',
    '.event.ts',
    '.dto.ts',
    '.args.ts',
    '.query.ts',
    '.error.ts',
    'index.ts',
    '.util.ts',
    '.class.ts',
    '.resolver.ts',
    '.controller.ts',
    '.class.ts',
    'test',
    'main.ts',
    '.type.ts',
    '.model.ts'
  ],
  testEnvironment: 'node',
  coverageDirectory: './coverage-unit',
  clearMocks: true,
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  coverageReporters: ['json', 'text', 'lcov'],
  moduleNameMapper
} as JestConfigWithTsJest
