import { roundPrevalence } from "./roundPrevalences";

it("roundPrevalences", () => {
  expect(roundPrevalence(3.03)).toEqual(3);
  expect(roundPrevalence(5.55)).toEqual(5.6);
  expect(roundPrevalence(17.79)).toEqual(17.8);
  expect(roundPrevalence(undefined)).toEqual(0);
});
