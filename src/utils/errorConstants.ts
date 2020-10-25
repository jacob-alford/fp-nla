export const VEC_SHAPE_MISMATCH = (l1: number, l2: number) =>
  new Error(
    `Vector 'a' of length ${l1} does not match Vector 'b' of length ${l2}`
  );

export const MAT_SHAPE_MISMATCH = (
  [ax, ay]: [number, number],
  [bx, by]: [number, number]
) =>
  new Error(
    `Matrix 'a' of shape [${ax},${ay}] does not match in inner dimensions Matrix 'b' of shape [${bx},${by}]`
  );
