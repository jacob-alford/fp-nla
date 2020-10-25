import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as A from 'fp-ts/lib/Array';
import { Group } from 'fp-ts/lib/Group';
import { Ord } from 'fp-ts/lib/Ord';
import {
  pipe,
  tupled,
  untupled,
  tuple,
  flow,
  identity
} from 'fp-ts/lib/function';
import * as R from 'Real';
import * as C from 'Complex';

export type ComplexVector = readonly C.Complex[];

const cons = (...values: [number, number][]): ComplexVector =>
  pipe(values, A.map(tupled(C.cons)), RA.fromArray);

export const v = cons;

export const reduce = <A>(
  init: A,
  f: (acc: A, next: [number, number]) => A
) => (rv: ComplexVector): A =>
  pipe(rv, RA.map(C.fold(tuple)), RA.reduce(init, f));

export const norm: (rv: ComplexVector) => number = flow(
  RA.reduce<C.Complex, R.Real>(R.zero, (total, next) =>
    R.add(total)(pipe(C.degree(next), R.cons))
  ),
  R.fold(identity),
  Math.sqrt
);
export const complexVector = (
  dimensions: number
): Group<ComplexVector> & Ord<ComplexVector> => ({
  empty: RA.cons(C.zero)(
    Array.from({ length: dimensions - 1 }).fill(C.zero) as Array<C.Complex>
  ),
  concat: untupled(RA.map(tupled(C.complex.add))),
  inverse: RA.map(r => C.complex.sub(C.zero, r)),
  ...RA.getEq(C.complex),
  compare: (a, b) =>
    ((na, nb) => (na > nb ? 1 : na < nb ? -1 : 0))(norm(a), norm(b))
});

export const map = (rm: (r: number) => number, cm: (c: number) => number) => (
  rv: ComplexVector
): ComplexVector => pipe(rv, RA.map(C.bimap(rm, cm)));
