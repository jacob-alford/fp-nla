import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as E from 'fp-ts/lib/Either';
import { Group } from 'fp-ts/lib/Group';
import { Ord } from 'fp-ts/lib/Ord';
import { pipe, tupled, untupled, flow, identity } from 'fp-ts/lib/function';
import * as EC from 'utils/errorConstants';
import * as RV from 'RealVector';
import * as R from 'Real';

const sequenceE = RA.sequence(E.either);

export type RealMatrix = readonly RV.RealVector[];

export const fromArray = (vecArr: RV.RealVector[]): RealMatrix => vecArr;

export const rows = (A: RealMatrix) => A.length;
export const cols = (A: RealMatrix) => (A[0] && A[0].length) || 0;
export const shape = (A: RealMatrix): [number, number] => [rows(A), cols(A)];

export const normF: (A: RealMatrix) => R.Real = flow(
  RA.map(
    flow(
      RV.map(v => v ** 2),
      RV.total
    )
  ),
  RV.total,
  R.map(Math.sqrt)
);

export const matmul = (
  a: RealMatrix,
  b: RealMatrix
): E.Either<Error, RealMatrix> =>
  pipe(
    a,
    E.fromPredicate(
      a => rows(a) > 0 && rows(b) > 0,
      () => new Error(`Provided matricies are empty`)
    ),
    E.chain(
      E.fromPredicate(
        a => cols(a) === rows(b),
        () => EC.MAT_SHAPE_MISMATCH(shape(a), shape(b))
      )
    ),
    E.chain(
      flow(
        RA.mapWithIndex((_, ai) =>
          pipe(
            ai,
            RA.mapWithIndex(j => RV.dot(ai, b[j])),
            sequenceE
          )
        ),
        sequenceE
      )
    )
  );

export const realMatrix = (
  dimensions: number
): Group<RealMatrix> & Ord<RealMatrix> => ({
  empty: RA.cons(RV.realVector(dimensions).empty)(
    Array.from({ length: dimensions - 1 }).fill(
      RV.realVector(dimensions).empty
    ) as Array<RV.RealVector>
  ),
  concat: untupled(RA.map(tupled(RV.realVector(dimensions).concat))),
  inverse: RA.map(r => RV.realVector(dimensions).inverse(r)),
  ...RA.getEq(RV.realVector(dimensions)),
  compare: (a, b) =>
    ((na, nb) => (na > nb ? 1 : na < nb ? -1 : 0))(normF(a), normF(b))
});
