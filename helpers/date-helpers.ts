export const convertMonthNameToNumber = (monthName: string): string => {
	const monthIndex = new Date(`${monthName} 1, 2000`).getMonth() + 1;
	return monthIndex.toString().padStart(2, '0');
};
