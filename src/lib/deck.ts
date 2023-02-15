export class Card {
	readonly suit: string;
	readonly face: string;
	readonly back: string;
	readonly id: number;
	facedown = true;

	constructor(suit: string, face: string, back: string, id: number) {
		this.suit = suit;
		this.face = face;
		this.back = back;
		this.id = id;
	}

	get src() {
		return `/cards/front/${this.suit}_${this.face}.svg`;
	}

	get backSrc() {
		return `/cards/back/${this.back}.svg`;
	}
}

export class Deck {
	cards: Card[] = [];
	readonly suits: string[] = ['clubs', 'diamonds', 'hearts', 'spades'];
	readonly faces: string[] = [
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'10',
		'jack',
		'queen',
		'king',
		'ace'
	];
	readonly backs: string[] = [
		'abstract_clouds',
		'abstract_scene',
		'abstract',
		'astronaut',
		'blue',
		'blue2',
		'cars',
		'castle',
		'fish',
		'frog',
		'red',
		'red2'
	];
	back: string = this.backs[0];
	readonly colors: { [key: string]: string } = {
		clubs: 'black',
		diamonds: 'red',
		hearts: 'red',
		spades: 'black'
	};

	constructor() {
		this.randomBack();
		this.build();
	}

	build() {
		this.cards = [];
		let id = 1;
		for (const suit of this.suits) {
			for (const face of this.faces) {
				const card = new Card(suit, face, this.back, id);
				this.cards.push(card);
				id++;
			}
		}
	}

	randomBack() {
		this.back = this.backs[Math.floor(Math.random() * this.backs.length)];
	}

	setBack(idx: number) {
		const back = this.backs[idx];
		if (back) this.back = back;
	}

	shuffle() {
		if (!this.cards || !this.cards.length) return;
		let tmp: Card, rnd: number;
		for (let i = this.cards.length - 1; i > 0; i--) {
			tmp = this.cards[i];
			rnd = Math.floor(Math.random() * i);
			this.cards[i] = this.cards[rnd];
			this.cards[rnd] = tmp;
		}
	}

	draw() {
		return this.cards.pop();
	}

	color(card: Card) {
		return this.colors[card.suit];
	}
}
