const { Markup } = require('telegraf');

const amountKeyboard = Markup.inlineKeyboard([
	[
		Markup.button.callback('20 000 000 сум', '20000000'),
		Markup.button.callback('30 000 000 сум', '30000000'),
	],
	[
		Markup.button.callback('40 000 000 сум', '40000000'),
		Markup.button.callback('50 000 000 сум', '50000000'),
	],
	[
		Markup.button.callback('60 000 000 сум', '60000000'),
		Markup.button.callback('70 000 000 сум', '70000000'),
	],
	[
		Markup.button.callback('80 000 000 сум', '80000000'),
		Markup.button.callback('90 000 000 сум', '90000000'),
	],
	[
		Markup.button.callback('100 000 000 сум', '100000000'),
		Markup.button.callback('150 000 000 сум', '150000000'),
	],
	[Markup.button.callback('Указать другую сумму', 'Указать другую сумму')],
]);

const amountKeyboardUz = Markup.inlineKeyboard([
	[
		Markup.button.callback(`20 000 000 so'm`, '20000000'),
		Markup.button.callback(`30 000 000 so'm`, '30000000'),
	],
	[
		Markup.button.callback(`40 000 000 so'm`, '40000000'),
		Markup.button.callback(`50 000 000 so'm`, '50000000'),
	],
	[
		Markup.button.callback(`60 000 000 so'm`, '60000000'),
		Markup.button.callback(`70 000 000 so'm`, '70000000'),
	],
	[
		Markup.button.callback(`80 000 000 so'm`, '80000000'),
		Markup.button.callback(`90 000 000 so'm`, '90000000'),
	],
	[
		Markup.button.callback(`100 000 000 so'm`, '100000000'),
		Markup.button.callback(`150 000 000 so'm`, '150000000'),
	],
	[
		Markup.button.callback(
			'Boshqa miqdorni belgilash',
			'Boshqa miqdorni belgilash'
		),
	],
]);

const termKeyboard = Markup.inlineKeyboard([
	[Markup.button.callback('6', '6'), Markup.button.callback('12', '12')],
	[Markup.button.callback('18', '18'), Markup.button.callback('24', '24')],
]);

const storyKeyboard = Markup.inlineKeyboard([
	[
		Markup.button.callback(
			'Никогда не брал кредитов',
			'Никогда не брал кредитов'
		),
	],
	[
		Markup.button.callback(
			'Кредиты закрыты, просрочек не было',
			'Кредиты закрыты, просрочек не было'
		),
	],
	[
		Markup.button.callback(
			'Кредиты есть, просрочек нет',
			'Кредиты есть, просрочек нет'
		),
	],
	[
		Markup.button.callback(
			'Кредиты закрыты, просрочки были',
			'Кредиты закрыты, просрочки были'
		),
	],
	[
		Markup.button.callback(
			'Просрочки были, сейчас нет',
			'Просрочки были, сейчас нет'
		),
	],
	[Markup.button.callback('Просрочки сейчас есть', 'Просрочки сейчас есть')],
]);

const storyKeyboardUz = Markup.inlineKeyboard([
	[
		Markup.button.callback(
			'Hech qachon kredit olmaganman',
			'Hech qachon kredit olmaganman'
		),
	],
	[
		Markup.button.callback(
			`Kreditlar yopildi, kechikishlar yo'q edi`,
			`Kreditlar yopildi, kechikishlar yo'q edi`
		),
	],
	[
		Markup.button.callback(
			`Kreditlar bor, kechikishlar yo'q`,
			`Kreditlar bor, kechikishlar yo'q`
		),
	],
	[
		Markup.button.callback(
			`Kreditlar yopildi, kechikishlar bor edi`,
			`Kreditlar yopildi, kechikishlar bor edi`
		),
	],
	[
		Markup.button.callback(
			`Kechikishlar bo'lgan, ammo hozir yo'q`,
			`Kechikishlar bo'lgan, ammo hozir yo'q`
		),
	],
	[
		Markup.button.callback(
			`Hozirda kechikishlar bor`,
			`Hozirda kechikishlar bor`
		),
	],
]);

const depositKeyboard = Markup.inlineKeyboard([
	[Markup.button.callback('Автомобиль', 'Автомобиль')],
	[Markup.button.callback('Квартира / Дом', 'Квартира / Дом')],
	[Markup.button.callback('Земельный участок', 'Земельный участок')],
	[Markup.button.callback('Золото', 'Золото')],
]);

const depositKeyboardUz = Markup.inlineKeyboard([
	[Markup.button.callback('Avtomobil', 'Avtomobil')],
	[Markup.button.callback('Kvartira / Uy', 'Kvartira / Uy')],
	[Markup.button.callback('Dala hovli', 'Dala hovli')],
	[Markup.button.callback('Oltin', 'Oltin')],
]);

const lastStepKeyboard = Markup.inlineKeyboard([
	[
		Markup.button.callback(
			'🧮 Посчитать другую сумму',
			'Посчитать другую сумму'
		),
	],
	[Markup.button.callback('Отправить заявку ➡️', 'Отправить заявку')],
]);

const lastStepKeyboardUz = Markup.inlineKeyboard([
	[
		Markup.button.callback(
			'🧮 Boshqa miqdorni hisoblash',
			'Boshqa miqdorni hisoblash'
		),
	],
	[Markup.button.callback('Ariza yuborish ➡️', 'Ariza yuborish')],
]);

const totalKeyboard = Markup.inlineKeyboard([
	[
		Markup.button.callback(
			'🧮 Посчитать другую сумму',
			'Посчитать другую сумму'
		),
	],
	[Markup.button.callback('Дальше ➡️', 'Дальше')],
]);

const totalKeyboardUz = Markup.inlineKeyboard([
	[
		Markup.button.callback(
			'🧮 Boshqa miqdorni hisoblash',
			'Boshqa miqdorni hisoblash'
		),
	],
	[Markup.button.callback('Keyingisi ➡️', 'Keyingisi')],
]);

const sendKeyboard = Markup.inlineKeyboard([
	[Markup.button.callback('Отправить заявку ➡️', 'Отправить заявку')],
]);

const sendKeyboardUz = Markup.inlineKeyboard([
	[Markup.button.callback('Ariza yuborish ➡️', 'Ariza yuborish')],
]);

const allowKeyboard = Markup.inlineKeyboard([
	[Markup.button.callback('Разрешить ✅', 'Разрешить')],
]);

const allowKeyboardUz = Markup.inlineKeyboard([
	[Markup.button.callback('Ruxsat berish ✅', 'Ruxsat berish')],
]);

const langKeyboard = Markup.inlineKeyboard([
	[Markup.button.callback('🇷🇺 Русский язык', 'Русский язык')],
	[Markup.button.callback(`🇺🇿 O'zbek tili`, `O'zbek tili`)],
]);

const typeOfMicroloan = Markup.inlineKeyboard([
	[
		Markup.button.callback(
			'💎 Микрозайм с залогом до 150 000 000 сум',
			'Микрозайм с залогом до 150 000 000 сум'
		),
	],
	[
		Markup.button.callback(
			'💰 Микрозайм без залога до 25 000 000 сум',
			'Микрозайм без залога до 25 000 000 сум'
		),
	],
]);

const typeOfMicroloanUz = Markup.inlineKeyboard([
	[
		Markup.button.callback(
			`💎 150 000 000 so'mgacha garov bilan mikrokredit`,
			`150 000 000 so'mgacha garov bilan mikrokredit`
		),
	],
	[
		Markup.button.callback(
			`💰 25 000 000 so'mgacha garovsiz mikrokredit`,
			`25 000 000 so'mgacha garovsiz mikrokredit`
		),
	],
]);

const amountKeyboardWithoutDeposit = Markup.inlineKeyboard([
	[
		Markup.button.callback('1 000 000 сум', '1000000'),
		Markup.button.callback('2 000 000 сум', '2000000'),
	],
	[
		Markup.button.callback('3 000 000 сум', '3000000'),
		Markup.button.callback('4 000 000 сум', '4000000'),
	],
	[
		Markup.button.callback('10 000 000 сум', '10000000'),
		Markup.button.callback('15 000 000 сум', '15000000'),
	],
	[
		Markup.button.callback('20 000 000 сум', '20000000'),
		Markup.button.callback('25 000 000 сум', '25000000'),
	],
	[Markup.button.callback('Указать другую сумму', 'Указать другую сумму')],
]);

const amountKeyboardWithoutDepositUz = Markup.inlineKeyboard([
	[
		Markup.button.callback(`1 000 000 so'm`, '1000000'),
		Markup.button.callback(`2 000 000 so'm`, '2000000'),
	],
	[
		Markup.button.callback(`3 000 000 so'm`, '3000000'),
		Markup.button.callback(`4 000 000 so'm`, '4000000'),
	],
	[
		Markup.button.callback(`10 000 000 so'm`, '10000000'),
		Markup.button.callback(`15 000 000 so'm`, '15000000'),
	],
	[
		Markup.button.callback(`20 000 000 so'm`, '20000000'),
		Markup.button.callback(`25 000 000 so'm`, '25000000'),
	],
	[
		Markup.button.callback(
			'Boshqa miqdorni belgilash',
			'Boshqa miqdorni belgilash'
		),
	],
]);

module.exports = {
	amountKeyboard,
	amountKeyboardUz,
	termKeyboard,
	storyKeyboard,
	storyKeyboardUz,
	depositKeyboard,
	depositKeyboardUz,
	lastStepKeyboard,
	lastStepKeyboardUz,
	langKeyboard,
	typeOfMicroloan,
	typeOfMicroloanUz,
	amountKeyboardWithoutDeposit,
	amountKeyboardWithoutDepositUz,
	totalKeyboard,
	totalKeyboardUz,
	sendKeyboard,
	sendKeyboardUz,
	allowKeyboard,
	allowKeyboardUz,
};
