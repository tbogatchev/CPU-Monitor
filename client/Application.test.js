const Application = require('./Application').default;

describe('should calculate 2 minute average', () => {
	test('should use whole data array if length is less than 12', () => {
		const testData = [
			{time: 0,load: 1.1},
			{time: 0,load: 1.2},
			{time: 0,load: 1.3},
		]
		expect(Application.calculateTwoMinuteLoadAverage(testData)).toBe(1.2)
	});
	test('should use last 12 data members for average', () => {
		const testData = [
			{time: 0,load: 99999},
			{time: 0,load: 99999},
			{time: 0,load: 99999},
			{time: 0,load: 1.1},
			{time: 0,load: 1.2},
			{time: 0,load: 1.3},
			{time: 0,load: 1.1},
			{time: 0,load: 1.2},
			{time: 0,load: 1.3},
			{time: 0,load: 1.1},
			{time: 0,load: 1.2},
			{time: 0,load: 1.3},
			{time: 0,load: 1.1},
			{time: 0,load: 1.2},
			{time: 0,load: 1.3},
		]
		expect(Application.calculateTwoMinuteLoadAverage(testData)).toBe(1.2)
	});
})

describe('should create alerts', () => {
	test('should not create an alert if load is normal and last alert was not highLoad', () => {
		const alertData = [
			{
				alertType: 'normalLoad',
          		message: 'test',
          		triggeredAt: 10
			}
		]
		const load = 0.9
		expect(Application.createAlert(load, alertData)).toBe(undefined)
	});
	test('should not create an alert if load is high but last alert was already highLoad', () => {
		const alertData = [
			{
				alertType: 'highLoad',
          		message: 'test',
          		triggeredAt: 10
			}
		]
		const load = 1.1
		expect(Application.createAlert(load, alertData)).toBe(undefined)
	});
	test('should create a highLoad alert if load is high and last alert was not highLoad', () => {
		const alertData = [
			{
				alertType: 'normalLoad',
          		message: 'test',
          		triggeredAt: 10
			}
		]
		const load = 1.1
		const alert = Application.createAlert(load, alertData);
		expect(alert.alertType).toBe('highLoad');
		expect(alert.message.startsWith('High load generated an alert - load = 1.1, triggered at ')).toBe(true);
	});
	test('should create a normalLoad alert if load is normal and last alert was highLoad', () => {
		const alertData = [
			{
				alertType: 'highLoad',
          		message: 'test',
          		triggeredAt: 10
			}
		]
		const load = 0.9
		const alert = Application.createAlert(load, alertData);
		expect(alert.alertType).toBe('normalLoad');
		expect(alert.message.startsWith('System load back to normal. Total duration of high load: ')).toBe(true);
	});
})