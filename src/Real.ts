import { pipe, identity, flow, untupled } from 'fp-ts/lib/function';
import { Field } from 'fp-ts/lib/Field';
import curry from 'utils/curry';

class Real {
	private readonly _real: number;
	static readonly _tag: unique symbol;
	constructor(value: number) {
		this._real = value;
	}
	static real(a: Real): number {
		return a._real;
	}
}

export const cons = (r: number) => new Real(r);

export const fold = <A>(f: (a: number) => A) => (a: Real): A =>
	pipe(a, Real.real, f);

export const concat = (f: (a: number, b: number) => number) => ([a, b]: [
	Real,
	Real
]): Real => pipe(f(pipe(a, fold(identity)), pipe(b, fold(identity))), cons);

export const map = (f: (a: number) => number) => (a: Real): Real =>
	pipe(a, Real.real, f, cons);

export const chain: (f: (a: number) => Real) => (a: Real) => Real = fold;

export const show: (a: Real) => string = flow(Real.real, String);

export const real: Field<Real> = {
	degree: Real.real,
	add: untupled(concat((a, b) => a + b)),
	sub: untupled(concat((a, b) => a - b)),
	mul: untupled(concat((a, b) => a * b)),
	div: untupled(concat((a, b) => a / b)),
	mod: () => cons(0),
	zero: cons(0),
	one: cons(1),
};

export const degree = real.degree;
export const add = curry(real.add);
export const sub = curry(real.sub);
export const mul = curry(real.mul);
export const div = curry(real.div);
export const mod = curry(real.mod);
export const zero = real.zero;
export const one = real.one;
