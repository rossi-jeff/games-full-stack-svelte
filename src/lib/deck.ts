export class Card {
	suit: string;
	face: string;
	back: string;

	constructor(suit: string, face: string, back: string) {
		this.suit = suit;
		this.face = face;
		this.back = back;
	}
}

export class Deck {
	cards: Card[] = [];
	suits: string[] = ['clubs', 'diamonds', 'hearts', 'spades'];
	faces: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
	backs: string[] = [
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
	back: string;

	constructor() {
		this.back = this.backs[Math.floor(Math.random() * this.backs.length)];
		for (const suit of this.suits) {
			for (const face of this.faces) {
				const card = new Card(suit, face, this.back);
				this.cards.push(card);
			}
		}
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
}
