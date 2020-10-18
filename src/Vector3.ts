import { Group } from 'fp-ts/lib/Group';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as V from 'Vector';
import * as R from 'Real';

export type Vector3 = readonly [R.Real, R.Real, R.Real];

export const fromVec = (vector: V.RealVector): O.Option<Vector3> =>
	pipe(
		vector,
		O.fromPredicate((v) => v.length >= 3),
		O.map(([x1, x2, x3]) => [x1, x2, x3])
	);

export const toVec = (vector: Vector3): V.RealVector => vector;

export const cross = (
	[a1, a2, a3]: Vector3,
	[b1, b2, b3]: Vector3
): Vector3 => [
	R.sub(R.mul(a2)(b3))(R.mul(a3)(b2)),
	R.mul(R.cons(-1))(R.sub(R.mul(a1)(b3))(R.mul(a3)(b1))),
	R.sub(R.mul(a1)(b2))(R.mul(a2)(b1)),
];

export const norm = ([x1, x2, x3]: Vector3): R.Real =>
	pipe(
		R.add(R.add(R.map((v) => v ** 2)(x1))(R.map((v) => v ** 2)(x2)))(
			R.map((v) => v ** 2)(x2)
		),
		R.map(Math.sqrt)
	);

export const vector3: Group<Vector3> = {
	empty: [R.zero, R.zero, R.zero],
	concat: ([x1, x2, x3], [y1, y2, y3]) => [
		R.real.add(x1, y1),
		R.real.add(x2, y2),
		R.real.add(x3, y3),
	],
	inverse: ([x1, x2, x3]) => [
		R.real.sub(R.zero, x1),
		R.real.sub(R.zero, x2),
		R.real.sub(R.zero, x3),
	],
};
