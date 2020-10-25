import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as A from 'fp-ts/lib/Array';
import * as E from 'fp-ts/lib/Either';
import { Group } from 'fp-ts/lib/Group';
import { Ord } from 'fp-ts/lib/Ord';
import { pipe, tupled, untupled, flow, identity } from 'fp-ts/lib/function';
import * as R from 'Real';

export type RealVector = readonly R.Real[];

const cons = (...values: number[]): RealVector =>
  pipe(values, A.map(R.cons), RA.fromArray);

export const v = cons;

export const reduce = <A>(init: A, f: (acc: A, next: number) => A) => (
  rv: RealVector
): A => pipe(rv, RA.map(R.fold(identity)), RA.reduce(init, f));

export const norm: (rv: RealVector) => R.Real = flow(
  reduce(R.zero, (total, next) => R.add(total)(R.cons(next ** 2))),
  R.map(Math.sqrt)
);

export const realVector = (
  dimensions: number
): Group<RealVector> & Ord<RealVector> => ({
  empty: RA.cons(R.zero)(
    Array.from({ length: dimensions - 1 }).fill(R.zero) as Array<R.Real>
  ),
  concat: untupled(RA.map(tupled(R.real.add))),
  inverse: RA.map(r => R.real.sub(R.zero, r)),
  ...RA.getEq(R.real),
  compare: (a, b) =>
    ((na, nb) => (na > nb ? 1 : na < nb ? -1 : 0))(norm(a), norm(b))
});

export const map: (
  f: (a: number) => number
) => (rv: RealVector) => RealVector = flow(R.map, RA.map);

export const total: (rv: RealVector) => R.Real = reduce(R.zero, (acc, next) =>
  R.add(acc)(R.cons(next))
);

export const elMul = (
  a: RealVector,
  b: RealVector
): E.Either<Error, RealVector> =>
  pipe(
    undefined,
    E.fromPredicate(
      () => a.length === b.length,
      () =>
        new Error(
          `Vector 'a' of length ${a.length} does not match Vector 'b' of length ${b.length}`
        )
    ),
    E.map(() =>
      pipe(
        a,
        RA.mapWithIndex((i, ai) => R.mul(ai)(b[i]))
      )
    )
  );

export const dot = (a: RealVector, b: RealVector): E.Either<Error, R.Real> =>
  pipe(elMul(a, b), E.map(total));
