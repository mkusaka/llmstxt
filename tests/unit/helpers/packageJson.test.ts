import { describe, it, expect } from 'vitest';
import packageJson from '../../../src/lib/helpers/packageJson';
import { name, version, description } from '../../../package.json';

describe('packageJson helper', () => {
  it('should export the correct name from package.json', () => {
    expect(packageJson.name).toBe(name);
  });

  it('should export the correct version from package.json', () => {
    expect(packageJson.version).toBe(version);
  });

  it('should export the correct description from package.json', () => {
    expect(packageJson.description).toBe(description);
  });

  it('should only export name, version, and description properties', () => {
    const keys = Object.keys(packageJson);
    expect(keys).toHaveLength(3);
    expect(keys).toContain('name');
    expect(keys).toContain('version');
    expect(keys).toContain('description');
  });
});