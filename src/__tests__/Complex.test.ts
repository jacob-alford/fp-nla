import * as C from 'Complex';
import { pipe } from 'fp-ts/lib/function';

const rand = (min: number = 1, max: number = 100) =>
  pipe(Math.random() * max + min, Math.floor);

describe('Complex', () => {
  it('abides closure', () => {
    const _a = rand();
    const _b = rand();
    const _c = rand();
    const _d = rand();
    const a = C.cons(_a, _b);
    const b = C.cons(_c, _d);
    expect(C.add(a)(b)).toStrictEqual(C.cons(_a + _c, _b + _d));
    expect(C.mul(a)(b)).toStrictEqual(
      C.cons(_a * _c - _b * _d, _a * _d + _c * _b)
    );
  });
  it('abides commutativity', () => {
    const a = C.cons(rand(), rand());
    const b = C.cons(rand(), rand());
    expect(C.add(a)(b)).toStrictEqual(C.add(b)(a));
    expect(C.mul(a)(b)).toStrictEqual(C.mul(b)(a));
  });
  it('abides associativity', () => {
    const a = C.cons(rand(), rand());
    const b = C.cons(rand(), rand());
    const c = C.cons(rand(), rand());
    expect(C.add(C.add(a)(b))(c)).toStrictEqual(C.add(a)(C.add(b)(c)));
    expect(C.mul(C.mul(a)(b))(c)).toStrictEqual(C.mul(a)(C.mul(b)(c)));
  });
  it('posesses identities', () => {
    const a = C.cons(rand(), rand());
    expect(C.add(a)(C.zero)).toStrictEqual(a);
    expect(C.mul(a)(C.one)).toStrictEqual(a);
  });
  it('posesses inverses', () => {
    const a = C.cons(rand(), rand());
    expect(C.sub(a)(a)).toStrictEqual(C.zero);
    expect(C.div(a)(a)).toStrictEqual(C.one);
  });
  it('abides distributivity', () => {
    const a = C.cons(rand(), rand());
    const b = C.cons(rand(), rand());
    const c = C.cons(rand(), rand());
    expect(C.mul(a)(C.add(b)(c))).toStrictEqual(
      C.add(C.mul(a)(b))(C.mul(a)(c))
    );
  });
});
