import * as R from 'Real';
import { pipe } from 'fp-ts/lib/function';

const rand = (min: number = 1, max: number = 100) =>
  pipe(Math.random() * max + min, Math.floor);

describe('Real', () => {
  it('abides closure', () => {
    const _a = rand();
    const _b = rand();
    const a = R.cons(_a);
    const b = R.cons(_b);
    expect(R.add(a)(b)).toStrictEqual(R.cons(_a + _b));
    expect(R.mul(a)(b)).toStrictEqual(R.cons(_a * _b));
  });
  it('abides commutativity', () => {
    const a = R.cons(rand());
    const b = R.cons(rand());
    expect(R.add(a)(b)).toStrictEqual(R.add(b)(a));
    expect(R.mul(a)(b)).toStrictEqual(R.mul(b)(a));
  });
  it('abides associativity', () => {
    const a = R.cons(rand());
    const b = R.cons(rand());
    const c = R.cons(rand());
    expect(R.add(R.add(a)(b))(c)).toStrictEqual(R.add(a)(R.add(b)(c)));
    expect(R.mul(R.mul(a)(b))(c)).toStrictEqual(R.mul(a)(R.mul(b)(c)));
  });
  it('posesses identities', () => {
    const a = R.cons(rand());
    expect(R.add(a)(R.zero)).toStrictEqual(a);
    expect(R.mul(a)(R.one)).toStrictEqual(a);
  });
  it('posesses inverses', () => {
    const a = R.cons(rand());
    expect(R.sub(a)(a)).toStrictEqual(R.zero);
    expect(R.div(a)(a)).toStrictEqual(R.one);
  });
  it('abides distributivity', () => {
    const a = R.cons(rand());
    const b = R.cons(rand());
    const c = R.cons(rand());
    expect(R.mul(a)(R.add(b)(c))).toStrictEqual(
      R.add(R.mul(a)(b))(R.mul(a)(c))
    );
  });
});
