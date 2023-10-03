describe("test new grammar", () => {
  function sum(a, b) {
    return a + b;
  }
  test("first test", () => {
    expect(sum(1, 2)).toBe(3);
  });
  test("second test", () => {
    expect(sum(2, 2)).toBe(4);
  });
});
