export const convertMonthNameToNumber = (monthName: string): string => {
	const monthIndex = new Date(`${monthName} 1, 2000`).getMonth() + 1;

	return monthIndex.toString().padStart(2, '0');
};

export const getCurrentDate = (): string => new Date().toISOString().slice(0, 10);

export const getFutureDate = (yearsAhead: number = 5): string => {
	const date = new Date();

	date.setFullYear(date.getFullYear() + yearsAhead);

	return date.toISOString().slice(0, 10);
};

export const getPastDate = (yearsBack: number): string => {
	const date = new Date();

	date.setFullYear(date.getFullYear() - yearsBack);

	return date.toISOString().slice(0, 10);
};
