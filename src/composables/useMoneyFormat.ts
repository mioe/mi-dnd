export const useMoneyFormat = (sum: number): string => {
	return Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
	}).format(sum)
}
