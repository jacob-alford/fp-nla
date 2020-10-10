import { pipe } from 'fp-ts/lib/function';
import { Field } from 'fp-ts/lib/Field';

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

const cons = (r: number, c: number) => new Complex(r, c);

const fold = <A>(f: (real: number, complex: number) => A) => (c: Complex): A =>
	f(Complex.real(c), Complex.complex(c));

const elConcat = (f: (a: number, b: number) => number) => (
	a: Complex,
	b: Complex
): Complex =>
	cons(
		f(Complex.real(a), Complex.real(b)),
		f(Complex.complex(a), Complex.complex(b))
	);

export const concat = (
	f: (c1R: number, c1C: number, c2R: number, c2C: number) => Complex
) => (c1: Complex, c2: Complex): Complex =>
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
	mul: concat((r1, c1, r2, c2) => cons(r1 * r2 - c1 * c2, r1 * c2 + r2 * c1)),
	div: concat((a, b, c, d) =>
		((denom) => cons((a * c + b * d) / denom, (a * d + c * b) / denom))(
			c * c - d * d
		)
	),
	mod: elConcat((a, b) => a % b),
	zero: cons(0, 0),
	one: cons(1, 0),
};
