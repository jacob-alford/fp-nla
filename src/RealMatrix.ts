import * as RA from 'fp-ts/lib/ReadonlyArray';
import { Group } from 'fp-ts/lib/Group';
import { Ord } from 'fp-ts/lib/Ord';
import { pipe, tupled, untupled, flow, identity } from 'fp-ts/lib/function';
import * as RV from 'RealVector';
import * as R from 'Real';

export type RealMatrix = readonly RV.RealVector[];

export const fromArray = (vecArr: RV.RealVector[]): RealMatrix => vecArr;

export const fNorm: (A: RealMatrix) => R.Real = flow(
	RA.map(
		flow(
			RV.map((v) => v ** 2),
			RV.sum
		)
	),
	RV.sum,
	R.map(Math.sqrt)
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
	inverse: RA.map((r) => RV.realVector(dimensions).inverse(r)),
	...RA.getEq(RV.realVector(dimensions)),
	compare: (a, b) =>
		((na, nb) => (na > nb ? 1 : na < nb ? -1 : 0))(fNorm(a), fNorm(b)),
});
