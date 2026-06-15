const test = require('node:test');
const assert = require('node:assert/strict');
const game = require('./game.js');

test('calculates wages with penalty rates', () => {
  const pay = game.calcWage(30, 30, 5, 1.5, 4, 1.75, 2, 2.5);
  assert.equal(pay, 1485);
});

test('calculates non-wage earnings components', () => {
  assert.equal(game.calcCommission(4200, 0.07), 294);
  assert.equal(game.calcPieceWork(36, 12), 432);
  assert.equal(game.calcRoyalty(580, 0.45), 261);
});

test('converts weekly earnings using 52-week year', () => {
  const amounts = game.convertFromWeekly(980);
  assert.equal(amounts.fortnightly, 1960);
  assert.equal(amounts.monthly, 4246.67);
  assert.equal(amounts.yearly, 50960);
});

test('computes leave loading', () => {
  assert.equal(game.calcLeaveLoading(1540, 0.175), 269.5);
});

test('looks up PAYG weekly tax', () => {
  assert.equal(game.lookupPaygWeeklyTax(680), 76.9);
});

test('computes taxable income and annual tax', () => {
  assert.equal(game.calcTaxableIncome(78000, 4600), 73400);
  assert.equal(game.calcAnnualTax(73400), 12808);
});

test('computes net earnings after deductions and tax', () => {
  const net = game.calcNetEarnings(78000, 4600);
  assert.deepEqual(net, { taxable: 73400, tax: 12808, net: 60592 });
});

test('computes simple interest and spending costs', () => {
  assert.deepEqual(game.simpleInterest(2500, 0.06, 4), { interest: 600, total: 3100 });
  assert.deepEqual(game.costOnTerms(1200, 200, 115, 10), { total: 1350, extra: 150 });
  assert.equal(game.bnplCost(900, 6, 4, 0), 924);
  assert.equal(game.shortTermLoanCost(900, 25, 18, 3), 979);
});
