import { pipe, identity, flow, untupled } from 'fp-ts/lib/function';
import { Field } from 'fp-ts/lib/Field';
import curry from 'utils/curry';

export interface Real {
	_tag: 'Real';
	real: number;
}

export const cons = (real: number): Real => ({ real, _tag: 'Real' });

const getReal = (r: Real) => r.real;

export const r = cons;

export const fold = <A>(f: (a: number) => A) => (a: Real): A =>
	pipe(a, getReal, f);

export const concat = (f: (a: number, b: number) => number) => ([a, b]: [
	Real,
	Real
]): Real => pipe(f(pipe(a, fold(identity)), pipe(b, fold(identity))), cons);

export const map = (f: (a: number) => number) => (a: Real): Real =>
	pipe(a, getReal, f, cons);

export const chain: (f: (a: number) => Real) => (a: Real) => Real = fold;

export const show: (a: Real) => string = flow(getReal, String);

export const real: Field<Real> = {
	degree: getReal,
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
