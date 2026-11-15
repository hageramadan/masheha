const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { test } = require('node:test');

// Exercise the extracted scheduling hook with backend responses and React's hook ordering.
function setup(bookingType = 'daily') {
  const slots = [];
  const effects = [];
  const requests = [];
  let cursor = 0;
  let bookingData = { rentalDate: '', rentalTime: '', rentalDays: 1 };
  let periodId = null;
  let availableMonths = [];
  const matches = (before, after) => before && before.length === after.length && after.every((value, index) => Object.is(value, before[index]));
  const React = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
    },
    useCallback(callback, deps) {
      const index = cursor++;
      if (!slots[index] || !matches(slots[index].deps, deps)) slots[index] = { deps, callback };
      return slots[index].callback;
    },
    useEffect(effect, deps) {
      const index = cursor++;
      if (!matches(slots[index], deps)) { effects.push(effect); slots[index] = deps; }
    },
  };
  const hour = (time, is_available = true) => ({ time, label: time, is_available });
  const days = [
    { date: '2099-01-01', is_available: false, available_hours: [hour('09:00')] },
    { date: '2099-01-02', is_available: true, available_hours: [hour('09:00'), hour('10:00', false)] },
    { date: '2099-01-03', is_available: true, available_hours: [hour('14:00')] },
  ];
  const months = [{ month: '2099-01', is_available: true, available_periods: [{ id: 30, days_count: 60 }] }];
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync('src/hooks/useBookingSchedule.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  vm.runInNewContext(source, {
    exports, console,
    require(name) {
      if (name === 'react') return React;
      if (name === 'react-hot-toast') return { __esModule: true, default: { error() {} } };
      if (name.endsWith('/carService')) return { CarService: { async getAvailablePeriods(carId, officeId, type) {
        requests.push({ carId, officeId, type });
        return { available_dates: days, available_months: months };
      } } };
      return require(name);
    },
  });
  const updateField = (field, value) => { bookingData = { ...bookingData, [field]: value }; };
  const render = () => {
    cursor = 0;
    const result = exports.useBookingSchedule({
      carId: '26', rentalCompanyId: 10, bookingType, minimumDays: 2, bookingData, updateField,
      setPeriodId: value => { periodId = value; },
      setAvailableMonthsData: value => { availableMonths = value; },
      monthlyPeriods: months[0].available_periods,
      validateMonthlyPeriod: count => ({ isValid: count >= 1 && count <= 2, message: 'Invalid duration', periodId: 30 }),
    });
    while (effects.length) effects.shift()();
    return result;
  };
  return { render, requests, get data() { return bookingData; }, get periodId() { return periodId; }, get months() { return availableMonths; } };
}

test('daily schedule loads available dates, changes time with the date, and enforces minimum days', async () => {
  const h = setup();
  h.render();
  await new Promise(setImmediate);
  let schedule = h.render();
  assert.deepEqual(h.requests, [{ carId: 26, officeId: 10, type: 'daily' }, { carId: 26, officeId: 10, type: 'monthly' }]);
  assert.equal(h.data.rentalDate, '2099-01-02');
  assert.equal(h.data.rentalTime, '09:00');
  assert.equal(schedule.availableDateList.length, 2);
  assert.equal(schedule.availableTimeList.join(','), '09:00');
  assert.equal(h.data.rentalDays, 2);
  schedule.handleDateSelect(new Date(2099, 0, 3));
  schedule = h.render();
  assert.equal(h.data.rentalDate, '2099-01-03');
  assert.equal(h.data.rentalTime, '14:00');
  schedule.incrementDays();
  assert.equal(h.data.rentalDays, 3);
  schedule = h.render();
  schedule.decrementDays();
  assert.equal(h.data.rentalDays, 2);
  schedule = h.render();
  schedule.decrementDays();
  assert.equal(h.data.rentalDays, 2);
});

test('monthly schedule keeps the selected period and validates the month count', async () => {
  const h = setup('monthly');
  h.render();
  await new Promise(setImmediate);
  let schedule = h.render();
  assert.equal(h.periodId, 30);
  assert.equal(h.months.length, 1);
  assert.equal(schedule.selectedPeriod.id, 30);
  assert.equal(schedule.rentalMonths, 2);
  assert.equal(h.data.rentalDays, 60);
  assert.equal(schedule.monthlyTimeList.join(','), '09:00');
  schedule.incrementMonths();
  assert.equal(h.data.rentalDays, 60);
  schedule.decrementMonths();
  assert.equal(h.data.rentalDays, 30);
  schedule = h.render();
  assert.equal(schedule.rentalMonths, 1);
  schedule.handleMonthlyDateSelect(new Date(2099, 0, 3));
  schedule = h.render();
  assert.equal(h.data.rentalDate, '2099-01-03');
  assert.equal(h.data.rentalTime, '14:00');
  assert.equal(h.periodId, 30);
});
