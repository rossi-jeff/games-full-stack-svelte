export enum TenGrandCategory {
	Ones = 'Ones',
	Fives = 'Fives',
	ThreePairs = 'ThreePairs',
	Straight = 'Straight',
	FullHouse = 'FullHouse',
	DoubleThreeKind = 'DoubleThreeKind',
	ThreeKind = 'ThreeKind',
	FourKind = 'FourKind',
	FiveKind = 'FiveKind',
	SixKind = 'SixKind',
	CrapOut = 'CrapOut'
}

export const TenGrandDiceRequired: { [key: string]: number } = {
	Ones: 1,
	Fives: 1,
	ThreePairs: 6,
	Straight: 6,
	FullHouse: 5,
	DoubleThreeKind: 6,
	ThreeKind: 3,
	FourKind: 4,
	FiveKind: 5,
	SixKind: 6,
	CrapOut: 0
};
