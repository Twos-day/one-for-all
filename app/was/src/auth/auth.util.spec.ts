import { excuteRootDomain } from './util/excute-root-domain';

describe('excuteRootDomain', () => {
  test('default 체크', () => {
    const url = '';
    const result = excuteRootDomain(url);
    expect(result).toBe('localhost');
  });

  test('도메인 체크', () => {
    const url = 'twosday.live';
    const result = excuteRootDomain(url);
    expect(result).toBe('twosday.live');
  });

  test('SLD 체크', () => {
    const url = 'one-for-all.twosday.live';
    const result = excuteRootDomain(url);
    expect(result).toBe('twosday.live');
  });

  test('TLD 체크', () => {
    const url = 'sub.twosday.co.kr';
    const result = excuteRootDomain(url);
    expect(result).toBe('twosday.co.kr');
  });

  test('PORT 체크', () => {
    const url = 'localhost:3000';
    const result = excuteRootDomain(url);
    expect(result).toBe('localhost');
  });

  test('PROTOCOL 체크', () => {
    const url = 'http://localhost:3000';
    const result = excuteRootDomain(url);
    expect(result).toBe('localhost');
  });

  test('Params 체크', () => {
    const url1 = 'http://localhost:3000?t=123.123';
    const result1 = excuteRootDomain(url1);
    expect(result1).toBe('localhost');

    const url2 = 'https://one-for-all.twosday.live?t=123.123';
    const result2 = excuteRootDomain(url2);
    expect(result2).toBe('twosday.live');

    const url3 = 'http://localhost:3000/name.name?t=123.123';
    const result3 = excuteRootDomain(url3);
    expect(result3).toBe('localhost');

    const url4 = 'http://localhost:3000?t=123.123';
    const result4 = excuteRootDomain(url4);
    expect(result4).toBe('localhost');
  });
});
