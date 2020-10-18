import { pipe, untupled } from 'fp-ts/lib/function';
import { Field } from 'fp-ts/lib/Field';
import curry from 'utils/curry';

export interface Complex {
	_tag: 'Complex';
	real: number;
	complex: number;
}

export const cons = (real: number, complex: number): Complex => ({
	_tag: 'Complex',
	real,
	complex,
});

export const c = cons;

const getReal = (c: Complex) => c.real;
const getComplex = (c: Complex) => c.complex;

export const fold = <A>(f: (real: number, complex: number) => A) => (
	c: Complex
): A => f(getReal(c), getComplex(c));

export const elConcat = (f: (a: number, b: number) => number) => (
	a: Complex,
	b: Complex
): Complex => cons(f(getReal(a), getReal(b)), f(getComplex(a), getComplex(b)));

export const concat = (
	f: (c1R: number, c1C: number, c2R: number, c2C: number) => Complex
) => ([c1, c2]: [Complex, Complex]): Complex =>
	f(getReal(c1), getComplex(c1), getReal(c2), getComplex(c2));

const mapR = (f: (a: number) => number) => (a: Complex): Complex =>
	pipe(a, getReal, f, (newReal) =>
		pipe(a, getComplex, (complexPart) => cons(newReal, complexPart))
	);
const mapC = (f: (a: number) => number) => (a: Complex): Complex =>
	pipe(a, getComplex, f, (newComplex) =>
		pipe(a, getReal, (realPart) => cons(realPart, newComplex))
	);
export const map = (
	realF: (a: number) => number,
	complexF: (a: number) => number
) => (a: Complex): Complex => pipe(a, mapR(realF), mapC(complexF));

export const chain = (f: (real: number, complex: number) => Complex) => (
	c: Complex
): Complex => f(getReal(c), getComplex(c));

export const show = (a: Complex): string => `(${getReal(a)}, ${getComplex(a)})`;

export const complex: Field<Complex> = {
	degree: fold((r, c) => Math.sqrt(r ** 2 + c ** 2)),
	add: elConcat((a, b) => a + b),
	sub: elConcat((a, b) => a - b),
	mul: untupled(concat((a, b, c, d) => cons(a * c - b * d, a * d + c * b))),
	div: untupled(
		concat((a, b, c, d) =>
			((denom) => cons((a * c + b * d) / denom, (b * c - a * d) / denom))(
				c * c + d * d
			)
		)
	),
	mod: () => cons(0, 0),
	zero: cons(0, 0),
	one: cons(1, 0),
};

export const degree = complex.degree;
export const add = curry(complex.add);
export const sub = curry(complex.sub);
export const mul = curry(complex.mul);
export const div = curry(complex.div);
export const mod = curry(complex.mod);
export const zero = complex.zero;
export const one = complex.one;
