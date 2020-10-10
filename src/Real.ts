import { pipe, identity, flow } from 'fp-ts/lib/function';
import { Field } from 'fp-ts/lib/Field';

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

export const concat = (f: (a: number, b: number) => number) => (
	a: Real,
	b: Real
): Real => pipe(f(pipe(a, fold(identity)), pipe(b, fold(identity))), cons);

export const map = (f: (a: number) => number) => (a: Real): Real =>
	pipe(a, Real.real, f, cons);

export const chain: (f: (a: number) => Real) => (a: Real) => Real = fold;

export const show: (a: Real) => string = flow(Real.real, String);

export const real: Field<Real> = {
	degree: Real.real,
	add: concat((a, b) => a + b),
	sub: concat((a, b) => a - b),
	mul: concat((a, b) => a * b),
	div: concat((a, b) => a / b),
	mod: concat((a, b) => a % b),
	zero: cons(0),
	one: cons(1),
};
