import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { pipe, tupled } from 'fp-ts/lib/function';
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

export const v = cons;
