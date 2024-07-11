import { excuteRootDomain } from './util/excute-root-domain';

describe('excuteRootDomain', () => {
  it('should return the root domain for a URL with a subdomain', () => {
    const url = 'https://one-for-all.twosday.live';
    const result = excuteRootDomain(url);
    expect(result).toBe('twosday.live');
  });

  it('should return the root domain for a URL without a subdomain', () => {
    const url = 'https://twosday.live';
    const result = excuteRootDomain(url);
    expect(result).toBe('twosday.live');
  });

  it('should return the root domain for a URL with multiple subdomains', () => {
    const url = 'https://sub.twosday.co.kr';
    const result = excuteRootDomain(url);
    expect(result).toBe('twosday.co.kr');
  });

  it('should return the hostname for a localhost URL', () => {
    const url = 'http://localhost:3000';
    const result = excuteRootDomain(url);
    expect(result).toBe('localhost');
  });
});
