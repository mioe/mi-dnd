export const useSpellDataResetByMaxLimit = (maxLimit: number) => {
	const tmpData = {} as any
	for (let i = 1; i <= maxLimit; i++) {
		tmpData[i] = true
	}
	return tmpData
}
