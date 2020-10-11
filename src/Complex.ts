import { pipe, untupled } from 'fp-ts/lib/function';
import { Field } from 'fp-ts/lib/Field';
import curry from 'utils/curry';

class Complex {
	private readonly _real: number;
	private readonly _complex: number;
	static readonly _tag: unique symbol;
	constructor(real: number, complex: number) {
		this._real = real;
		this._complex = complex;
	}
	static real(a: Complex) {
		return a._real;
	}
	static complex(a: Complex) {
		return a._complex;
	}
}

export const cons = (r: number, c: number) => new Complex(r, c);

export const fold = <A>(f: (real: number, complex: number) => A) => (
	c: Complex
): A => f(Complex.real(c), Complex.complex(c));

export const elConcat = (f: (a: number, b: number) => number) => (
	a: Complex,
	b: Complex
): Complex =>
	cons(
		f(Complex.real(a), Complex.real(b)),
		f(Complex.complex(a), Complex.complex(b))
	);

export const concat = (
	f: (c1R: number, c1C: number, c2R: number, c2C: number) => Complex
) => ([c1, c2]: [Complex, Complex]): Complex =>
	f(
		Complex.real(c1),
		Complex.complex(c1),
		Complex.real(c2),
		Complex.complex(c2)
	);

const mapR = (f: (a: number) => number) => (a: Complex): Complex =>
	pipe(a, Complex.real, f, (newReal) =>
		pipe(a, Complex.complex, (complexPart) => cons(newReal, complexPart))
	);
const mapC = (f: (a: number) => number) => (a: Complex): Complex =>
	pipe(a, Complex.complex, f, (newComplex) =>
		pipe(a, Complex.real, (realPart) => cons(realPart, newComplex))
	);
export const map = (
	realF: (a: number) => number,
	complexF: (a: number) => number
) => (a: Complex): Complex => pipe(a, mapR(realF), mapC(complexF));

export const chain = (f: (real: number, complex: number) => Complex) => (
	c: Complex
): Complex => f(Complex.real(c), Complex.complex(c));

export const show = (a: Complex): string =>
	`(${Complex.real(a)}, ${Complex.complex(a)})`;

export const complex: Field<Complex> = {
	degree: fold((r, c) => Math.sqrt(Math.pow(r, 2) + Math.pow(c, 2))),
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
