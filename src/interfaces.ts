type CoreStat = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma'

export interface HeroStat {
	maxHit: number
	currentHit: number
	tempHit: number
	initiative: number
	speed: number

	proficiencyBonus: number

	strength: number
	dexterity: number
	constitution: number
	intelligence: number
	wisdom: number
	charisma: number

	savingThrows: CoreStat[]

	skills: 'acrobatics' | 'animalHandling' | 'arcana' | 'athletics' | 'deception' | 'history' | 'insight' | 'intimidation' | 'investigation' | 'medicine' | 'nature' | 'perception' | 'performance' | 'persuasion' | 'religion' | 'sleightOfHand' | 'stealth' | 'survival'[]

	passiveWisdom: number

	spellcastingAbility: CoreStat
	spellSaveDc: number
	spellAttackBonus: number
}
