import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { Group } from 'fp-ts/lib/Group';
import { pipe, tupled, untupled } from 'fp-ts/lib/function';
import * as C from 'Complex';
import * as R from 'Real';

export type RealVector = readonly R.Real[];
export type ComplexVector = readonly C.Complex[];

const isANumber = (a: unknown): a is number => !Number.isNaN(Number(a));

export function cons(...values: number[]): RealVector;
export function cons(...values: [number, number][]): ComplexVector;
export function cons(
	...values: number[] | [number, number][]
): RealVector | ComplexVector {
	return pipe(
		RA.head<number | [number, number]>(values),
		O.fold(
			() => [],
			(head) =>
				isANumber(head)
					? pipe(values, A.map(R.cons))
					: pipe(values, A.map(tupled(C.cons)))
		),
		RA.fromArray
	);
}

export const realVector = (dimensions: number): Group<RealVector> => ({
	empty: RA.cons(R.zero)(
		Array.from({ length: dimensions - 1 }).fill(R.zero) as Array<R.Real>
	),
	concat: untupled(RA.map(tupled(R.real.add))),
	inverse: RA.map((r) => R.real.sub(R.zero, r)),
});

export const complexVector = (dimensions: number): Group<ComplexVector> => ({
	empty: RA.cons(C.zero)(
		Array.from({ length: dimensions - 1 }).fill(C.zero) as Array<C.Complex>
	),
	concat: untupled(RA.map(tupled(C.complex.add))),
	inverse: RA.map((r) => C.complex.sub(C.zero, r)),
});

export const v = cons;
