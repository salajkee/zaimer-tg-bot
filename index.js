const { Telegraf, Markup } = require('telegraf');
const config = require('config');
const mongoose = require('mongoose');
const User = require('./db/User');
const Request = require('./db/Request');
const {
	showMenu,
	mainMenuBtn,
	sendPhoneNumber,
	showMenuUz,
	sendPhoneNumberUz,
	mainMenuBtnUz,
} = require('./helpers/menu');
const {
	amountKeyboard,
	termKeyboard,
	storyKeyboard,
	depositKeyboard,
	lastStepKeyboard,
	langKeyboard,
	typeOfMicroloan,
	amountKeyboardWithoutDeposit,
	totalKeyboard,
	sendKeyboard,
	allowKeyboard,
	typeOfMicroloanUz,
	amountKeyboardUz,
	amountKeyboardWithoutDepositUz,
	storyKeyboardUz,
	depositKeyboardUz,
	lastStepKeyboardUz,
	totalKeyboardUz,
	allowKeyboardUz,
	sendKeyboardUz,
} = require('./helpers/options');

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'), {
	handlerTimeout: Infinity,
});

mongoose
	.connect(config.get('MONGO_URL'), {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(res => console.log('Connected succesfully'))
	.catch(err => console.log(err));

let lang = null;
let chatId = null;
let messageText = null;
let messageId = null;

let queryData = null;
let queryMessage = null;

let data = {
	typeOfMicroloan: null,
	phone: null,
	name: null,
	amount: null,
	term: null,
	story: null,
	deposit: null,
	pinfl: null,
	passportOrIdCard: null,
};

function checkAmount(string) {
	if (!/^\d+$/.test(string)) {
		return false;
	}

	let number = parseInt(string);

	if (number >= 5e6 && number <= 150e6) {
		return true;
	} else {
		return false;
	}
}

function checkAmountWithoutDeposit(string) {
	if (!/^\d+$/.test(string)) {
		return false;
	}

	let number = parseInt(string);

	if (number > 1e6 && number < 24e6) {
		return true;
	} else {
		return false;
	}
}

function checkPhoneNumber(str) {
	// Удалить все символы, кроме цифр
	const digits = str.replace(/\D/g, '');

	// Проверить, содержит ли строка ровно 9 цифр
	return /^\d{9}$/.test(digits);
}

function calculate(sum, term) {
	let monthlyInterestRate = 0.0333333333333333;
	let monthlyPayment =
		(sum * monthlyInterestRate) /
		(1 - Math.pow(1 + monthlyInterestRate, -term));

	return monthlyPayment;
}

// Start

bot.start(async ctx => {
	chatId = ctx.from.id;
	data.phone = null;
	data.name = ctx.from.first_name;

	try {
		const newUser = {
			id: ctx.from.id,
			first_name: null,
			phone: null,
		};

		const check = await User.findOne({ id: ctx.from.id });

		if (check) {
			return ctx.telegram.sendMessage(
				chatId,
				`🇷🇺 Выберите удобный для себя язык\n🇺🇿 O'zingizga qulay tilni tanlang`,
				langKeyboard
			);
		}

		await User.create(newUser)
			.then(res => {
				ctx.telegram.sendMessage(
					ctx.chat.id,
					`🇷🇺 Выберите удобный для себя язык\n🇺🇿 O'zingizga qulay tilni tanlang`,
					langKeyboard
				);
			})
			.catch(err => console.log(err));
	} catch (error) {}
});

// Поделиться контактом

bot.on('contact', async ctx => {
	chatId = ctx.chat.id;
	data.phone = ctx.message.contact.phone_number;

	// Находим пользователя с переданным ID
	let user = await User.findOne({ id: ctx.from.id });

	if (user) {
		user.phone = ctx.message.contact.phone_number;
		await user.save(); // Сохраняем изменения
		if (lang === 'ru') {
			await ctx.telegram.sendMessage(chatId, 'Главное меню', showMenu());
			return;
		}
		if (lang === 'uz') {
			await ctx.telegram.sendMessage(chatId, 'Asosiy menyu', showMenuUz());
			return;
		}
	}
});

bot.on('message', async ctx => {
	chatId = ctx.chat.id;

	// Выбор языка

	if (queryData === 'Русский язык') {
		lang = 'ru';
		let user = await User.findOne({ id: ctx.from.id });

		if (ctx.message.text.length > 2) {
			queryData = null;

			// Если пользователь найден, обновляем его номер телефона
			if (user) {
				data.name = ctx.message.text;
				user.first_name = ctx.message.text;
				await user.save(); // Сохраняем изменения

				const sendMessage = await ctx.telegram.sendMessage(
					chatId,
					'Напишите или отправьте ваш телефонный номер.\nПример: 991234567',
					sendPhoneNumber()
				);

				messageText = sendMessage.text;
				return;
			}
		}
	}

	if (queryData === `O'zbek tili`) {
		lang = 'uz';
		let user = await User.findOne({ id: ctx.from.id });

		if (ctx.message.text.length > 2) {
			queryData = null;

			// Если пользователь найден, обновляем его номер телефона
			if (user) {
				data.name = ctx.message.text;
				user.first_name = ctx.message.text;
				await user.save(); // Сохраняем изменения

				const sendMessage = await ctx.telegram.sendMessage(
					chatId,
					'Telefon raqamingizni yozing yoki yuboring.\nMasalan: 991234567',
					sendPhoneNumberUz()
				);

				messageText = sendMessage.text;
				return;
			}
		}
	}

	// Напишите номер телефона вручную

	if (
		data.phone === null &&
		messageText ===
			'Напишите или отправьте ваш телефонный номер.\nПример: 991234567'
	) {
		if (checkPhoneNumber(ctx.message.text)) {
			data.phone = ctx.message.text;
			// Находим пользователя с переданным ID
			let user = await User.findOne({ id: ctx.from.id });
			// Если пользователь найден, обновляем его номер телефона
			if (user) {
				user.phone = ctx.message.text;
				await user.save(); // Сохраняем изменения
				await ctx.telegram.sendMessage(chatId, 'Главное меню', showMenu());
				console.log(queryData);
			}
		} else {
			await ctx.telegram.sendMessage(
				chatId,
				'🤷‍♂️ Неверный номер телефона. Попробуйте еще раз.'
			);
		}
	}

	if (
		data.phone === null &&
		messageText ===
			'Telefon raqamingizni yozing yoki yuboring.\nMasalan: 991234567'
	) {
		if (checkPhoneNumber(ctx.message.text)) {
			data.phone = ctx.message.text;
			// Находим пользователя с переданным ID
			let user = await User.findOne({ id: ctx.from.id });
			// Если пользователь найден, обновляем его номер телефона
			if (user) {
				user.phone = ctx.message.text;
				await user.save(); // Сохраняем изменения
				await ctx.telegram.sendMessage(chatId, 'Asosiy menyu', showMenuUz());
			}
		} else {
			await ctx.telegram.sendMessage(
				chatId,
				'🤷‍♂️ Telefon raqami noto‘g‘ri. Yana bir bor urinib ko`ring.'
			);
		}
	}

	// Оформить заявку

	if (ctx.message.text === '📝 Оформить заявку') {
		chatId = ctx.chat.id;
		queryMessage = ctx.message.message_id;

		await ctx.telegram.sendMessage(
			ctx.chat.id,
			'Вы можете оформить микрозайм в любое время.\nПродолжайте оформлять заявку.',
			mainMenuBtn()
		);

		const sendMessage = await bot.telegram.sendMessage(
			ctx.chat.id,
			`Выберите тип микрозайма`,
			typeOfMicroloan
		);

		messageId = sendMessage.message_id;
	}

	if (ctx.message.text === '📝 Ariza yuborish') {
		chatId = ctx.chat.id;
		queryMessage = ctx.message.message_id;

		await ctx.telegram.sendMessage(
			ctx.chat.id,
			'Istalgan vaqtda mikrokredit olish uchun ariza topshirishingiz mumkin.\nArizani toʻldirishda davom eting.',
			mainMenuBtnUz()
		);

		const sendMessage = await bot.telegram.sendMessage(
			ctx.chat.id,
			`Mikrokredit turini tanlang`,
			typeOfMicroloanUz
		);

		messageId = sendMessage.message_id;
	}

	// Об организации

	if (ctx.message.text === '🏦 Об организации') {
		chatId = ctx.chat.id;
		queryMessage = ctx.message.message_id;

		await ctx.telegram.sendMessage(
			ctx.chat.id,
			`Zaimer.uz не является микрокредитной или кредитной организацией, не выдает займы и не привлекает денежных средств. Информация, размещенная на сайте, носит исключительно ознакомительный характер. Все условия и решения, касающиеся получения займов илм кредитов, принимаются непосредственно компаниями, предоставляющими данные услуги и представленные на данном сайте.`,
			mainMenuBtn()
		);
	}

	if (ctx.message.text === '🏦 Tashkilot haqida') {
		chatId = ctx.chat.id;
		queryMessage = ctx.message.message_id;

		await ctx.telegram.sendMessage(
			ctx.chat.id,
			`Zaimer.uz mikrokredit yoki kredit tashkiloti emas, u kredit bermaydi yoki mablag' jalb qilmaydi. Saytda joylashtirilgan ma'lumotlar faqat ma'lumot uchun mo'ljallangan. Kreditlar va kreditlarni olish bo'yicha barcha shartlar va qarorlar to'g'ridan-to'g'ri ushbu xizmatlarni ko'rsatuvchi kompaniyalar tomonidan qabul qilinadi va ushbu veb-saytda taqdim etiladi.`,
			mainMenuBtnUz()
		);
	}

	// Указать другую сумму

	if (
		queryData === 'Указать другую сумму' &&
		data.typeOfMicroloan === 'Микрозайм с залогом до 150 000 000 сум'
	) {
		if (checkAmount(ctx.message.text)) {
			console.log(
				'Строка содержит только цифры и находится в диапазоне от 5 млн до 150 млн'
			);
			data.amount = ctx.message.text;

			await ctx.telegram.deleteMessage(chatId, messageId);
			await ctx.telegram.sendMessage(
				chatId,
				'Выберите срок микрозайма (в месяцах)',
				termKeyboard
			);
		} else {
			console.log('Строка не соответствует условиям');
		}
	}

	if (
		queryData === 'Указать другую сумму' &&
		data.typeOfMicroloan === 'Микрозайм без залога до 25 000 000 сум'
	) {
		if (checkAmountWithoutDeposit(ctx.message.text)) {
			console.log(
				'Строка содержит только цифры и находится в диапазоне от 1 млн до 25 млн'
			);
			data.amount = ctx.message.text;

			await ctx.telegram.deleteMessage(chatId, messageId);
			await ctx.telegram.sendMessage(
				chatId,
				'Выберите срок микрозайма (в месяцах)',
				termKeyboard
			);
		} else {
			console.log('Строка не соответствует условиям');
		}
	}

	if (
		queryData === 'Boshqa miqdorni belgilash' &&
		data.typeOfMicroloan === `150 000 000 so'mgacha garov bilan mikrokredit`
	) {
		if (checkAmount(ctx.message.text)) {
			console.log(
				'Строка содержит только цифры и находится в диапазоне от 5 млн до 150 млн'
			);
			data.amount = ctx.message.text;

			await ctx.telegram.deleteMessage(chatId, messageId);
			await ctx.telegram.sendMessage(
				chatId,
				'Kredit muddatini tanlang (oylarda)',
				termKeyboard
			);
		} else {
			console.log('Строка не соответствует условиям');
		}
	}

	if (
		queryData === 'Boshqa miqdorni belgilash' &&
		data.typeOfMicroloan === `25 000 000 so'mgacha garovsiz mikrokredit`
	) {
		if (checkAmountWithoutDeposit(ctx.message.text)) {
			console.log(
				'Строка содержит только цифры и находится в диапазоне от 1 млн до 25 млн'
			);
			data.amount = ctx.message.text;

			await ctx.telegram.deleteMessage(chatId, messageId);
			await ctx.telegram.sendMessage(
				chatId,
				'Kredit muddatini tanlang (oylarda)',
				termKeyboard
			);
		} else {
			console.log('Строка не соответствует условиям');
		}
	}

	// Кнопка назад в Главное меню

	if (ctx.message.text === '🏠 В главное меню') {
		ctx.telegram.sendMessage(ctx.chat.id, 'Главное меню', showMenu());
	}

	if (ctx.message.text === '🏠 Asosiy menyu') {
		ctx.telegram.sendMessage(ctx.chat.id, 'Asosiy menyu', showMenuUz());
	}

	// Действия после нажатия на кнопку Дальше (Проверка ПИНФЛ)

	if (
		data.typeOfMicroloan === 'Микрозайм без залога до 25 000 000 сум' &&
		queryData === 'Дальше'
	) {
		if (/^\d+$/.test(ctx.message.text)) {
			if (ctx.message.text.length !== 14) {
				ctx.telegram.sendMessage(ctx.chat.id, 'Введите 14 цифр ПИНФЛ');
			} else if (ctx.message.text.length === 14) {
				await ctx.telegram.sendMessage(ctx.chat.id, 'Проверяем ваши данные...');

				fetch(`https://api.goodsign.biz/v1/profile/${ctx.message.text}`)
					.then(response => {
						if (!response.ok) {
							throw new Error('Network response was not ok');
						}
						return response.json();
					})
					.then(async res => {
						if (res.name != '' && res.inn !== null) {
							await ctx.telegram.sendMessage(ctx.chat.id, 'Данные проверены!');
							data.pinfl = res.personalNum;
							queryData = null;
							const sendMessage = await ctx.telegram.sendMessage(
								ctx.chat.id,
								'Введите паспортные данные или ID карты'
							);
							messageText = sendMessage.text;
						} else {
							ctx.telegram.sendMessage(
								ctx.chat.id,
								'Ошибка: проверьте правильность введенных данных'
							);
						}
					})
					.catch(error => {
						console.log('Ошибка: проверьте правильность введенных данных');
					});
			}
		}
	}

	if (
		data.typeOfMicroloan === `25 000 000 so'mgacha garovsiz mikrokredit` &&
		queryData === 'Keyingisi'
	) {
		if (/^\d+$/.test(ctx.message.text)) {
			if (ctx.message.text.length !== 14) {
				ctx.telegram.sendMessage(
					ctx.chat.id,
					'JSHSHIR 14 ta raqamini kiriting'
				);
			} else if (ctx.message.text.length === 14) {
				await ctx.telegram.sendMessage(
					ctx.chat.id,
					`Ma'lumotlaringizni tekshirmoqdamiz...`
				);

				fetch(`https://api.goodsign.biz/v1/profile/${ctx.message.text}`)
					.then(response => {
						if (!response.ok) {
							throw new Error('Network response was not ok');
						}
						return response.json();
					})
					.then(async res => {
						if (res.name != '' && res.inn !== null) {
							await ctx.telegram.sendMessage(
								ctx.chat.id,
								`Ma'lumotlar tekshirildi!`
							);
							data.pinfl = res.personalNum;
							queryData = null;
							const sendMessage = await ctx.telegram.sendMessage(
								ctx.chat.id,
								`Pasport ma'lumotlarini yoki ID kartangizni kiriting`
							);
							messageText = sendMessage.text;
						} else {
							ctx.telegram.sendMessage(
								ctx.chat.id,
								'Xato: kiritilgan maʼlumotlar toʻgʻri yoki yoʻqligini tekshiring'
							);
						}
					})
					.catch(error => {
						console.log('Ошибка: проверьте правильность введенных данных');
					});
			}
		}
	}

	// Действия после проверки ПИНФЛ

	if (
		data.typeOfMicroloan === 'Микрозайм без залога до 25 000 000 сум' &&
		messageText === 'Введите паспортные данные или ID карты'
	) {
		if (ctx.message.text !== '🏠 В главное меню') {
			data.passportOrIdCard = ctx.message.text;

			const sendMessage = await ctx.telegram.sendMessage(
				ctx.chat.id,
				`Нажимая кнопку "Разрешить", вы даете согласие на просмотр кредитной истории.\nУслуга бесплатна!`,
				allowKeyboard
			);

			messageId = sendMessage.message_id;
		} else {
			messageText = null;
		}
	}

	if (
		data.typeOfMicroloan === `25 000 000 so'mgacha garovsiz mikrokredit` &&
		messageText === `Pasport ma'lumotlarini yoki ID kartangizni kiriting`
	) {
		if (ctx.message.text !== '🏠 Asosiy menyu') {
			data.passportOrIdCard = ctx.message.text;

			const sendMessage = await ctx.telegram.sendMessage(
				ctx.chat.id,
				`"Ruxsat berish" tugmasini bosish orqali siz kredit tarixingizni ko‘rishga rozilik bildirasiz.\nXizmat bepul!`,
				allowKeyboardUz
			);

			messageId = sendMessage.message_id;
		} else {
			messageText = null;
		}
	}
});

bot.action('Русский язык', ctx => {
	queryData = ctx.callbackQuery.data;
	queryMessage = ctx.callbackQuery.message;

	ctx.telegram.editMessageText(
		queryMessage.chat.id,
		queryMessage.message_id,
		null,
		'Как вас зовут?'
	);
});

bot.action(`O'zbek tili`, ctx => {
	queryData = ctx.callbackQuery.data;
	queryMessage = ctx.callbackQuery.message;

	ctx.telegram.editMessageText(
		queryMessage.chat.id,
		queryMessage.message_id,
		null,
		'Ismingiz nima?'
	);
});

bot.action('Микрозайм с залогом до 150 000 000 сум', ctx => {
	queryData = ctx.callbackQuery.data;
	queryMessage = ctx.callbackQuery.message;
	data.typeOfMicroloan = ctx.callbackQuery.data;

	ctx.telegram.editMessageText(
		queryMessage.chat.id,
		queryMessage.message_id,
		null,
		'Выберите сумму микрозайма',
		amountKeyboard
	);
});

bot.action(`150 000 000 so'mgacha garov bilan mikrokredit`, ctx => {
	queryData = ctx.callbackQuery.data;
	queryMessage = ctx.callbackQuery.message;
	data.typeOfMicroloan = ctx.callbackQuery.data;

	ctx.telegram.editMessageText(
		queryMessage.chat.id,
		queryMessage.message_id,
		null,
		'Kredit miqdorini tanlang',
		amountKeyboardUz
	);
});

bot.action('Микрозайм без залога до 25 000 000 сум', ctx => {
	queryData = ctx.callbackQuery.data;
	queryMessage = ctx.callbackQuery.message;
	data.typeOfMicroloan = ctx.callbackQuery.data;

	ctx.telegram.editMessageText(
		queryMessage.chat.id,
		queryMessage.message_id,
		null,
		'Выберите сумму микрозайма',
		amountKeyboardWithoutDeposit
	);
});

bot.action(`25 000 000 so'mgacha garovsiz mikrokredit`, ctx => {
	queryData = ctx.callbackQuery.data;
	queryMessage = ctx.callbackQuery.message;
	data.typeOfMicroloan = ctx.callbackQuery.data;

	ctx.telegram.editMessageText(
		queryMessage.chat.id,
		queryMessage.message_id,
		null,
		'Kredit miqdorini tanlang',
		amountKeyboardWithoutDepositUz
	);
});

bot.action(
	[
		'1000000',
		'2000000',
		'3000000',
		'4000000',
		'10000000',
		'15000000',
		'20000000',
		'25000000',
	],
	ctx => {
		queryData = ctx.callbackQuery.data;
		queryMessage = ctx.callbackQuery.message;
		data.amount = ctx.callbackQuery.data;

		if (lang === 'ru') {
			ctx.telegram.editMessageText(
				queryMessage.chat.id,
				queryMessage.message_id,
				null,
				'Выберите срок микрозайма (в месяцах)',
				termKeyboard
			);

			return;
		}

		if (lang === 'uz') {
			ctx.telegram.editMessageText(
				queryMessage.chat.id,
				queryMessage.message_id,
				null,
				'Kredit muddatini tanlang (oylarda)',
				termKeyboard
			);

			return;
		}
	}
);

bot.action(
	[
		'20000000',
		'30000000',
		'40000000',
		'50000000',
		'60000000',
		'70000000',
		'80000000',
		'90000000',
		'100000000',
		'150000000',
	],
	ctx => {
		queryData = ctx.callbackQuery.data;
		queryMessage = ctx.callbackQuery.message;
		data.amount = ctx.callbackQuery.data;

		if (lang === 'ru') {
			ctx.telegram.editMessageText(
				queryMessage.chat.id,
				queryMessage.message_id,
				null,
				'Выберите срок микрозайма (в месяцах)',
				termKeyboard
			);

			return;
		}

		if (lang === 'uz') {
			ctx.telegram.editMessageText(
				queryMessage.chat.id,
				queryMessage.message_id,
				null,
				'Kredit muddatini tanlang (oylarda)',
				termKeyboard
			);

			return;
		}
	}
);

// Указать другую сумму

bot.action('Указать другую сумму', async ctx => {
	if (data.typeOfMicroloan === 'Микрозайм с залогом до 150 000 000 сум') {
		queryData = ctx.callbackQuery.data;
		queryMessage = ctx.callbackQuery.message;
		data.story = ctx.callbackQuery.data;

		ctx.telegram.editMessageText(
			queryMessage.chat.id,
			queryMessage.message_id,
			null,
			'Напишите сумму цифрами\nот 5 000 000 сум до 150 000 000 сум'
		);

		return;
	}

	if (data.typeOfMicroloan === 'Микрозайм без залога до 25 000 000 сум') {
		queryData = ctx.callbackQuery.data;
		queryMessage = ctx.callbackQuery.message;
		data.story = ctx.callbackQuery.data;

		ctx.telegram.editMessageText(
			queryMessage.chat.id,
			queryMessage.message_id,
			null,
			'Напишите сумму цифрами\nот 1 000 000 сум до 25 000 000 сум'
		);

		return;
	}
});

bot.action('Boshqa miqdorni belgilash', async ctx => {
	if (
		data.typeOfMicroloan === `150 000 000 so'mgacha garov bilan mikrokredit`
	) {
		queryData = ctx.callbackQuery.data;
		queryMessage = ctx.callbackQuery.message;
		data.story = ctx.callbackQuery.data;

		ctx.telegram.editMessageText(
			queryMessage.chat.id,
			queryMessage.message_id,
			null,
			`Miqdorni raqamlar bilan yozing\n5 000 000 so'mdan 150 000 000 so'mgacha`
		);

		return;
	}

	if (data.typeOfMicroloan === `25 000 000 so'mgacha garovsiz mikrokredit`) {
		queryData = ctx.callbackQuery.data;
		queryMessage = ctx.callbackQuery.message;
		data.story = ctx.callbackQuery.data;

		ctx.telegram.editMessageText(
			queryMessage.chat.id,
			queryMessage.message_id,
			null,
			`Miqdorni raqamlar bilan yozing\n5 000 000 so'mdan 25 000 000 so'mgacha`
		);

		return;
	}
});

// Выбор срока

bot.action(['6', '12', '18', '24'], async ctx => {
	if (data.typeOfMicroloan === 'Микрозайм с залогом до 150 000 000 сум') {
		queryData = ctx.callbackQuery.data;
		queryMessage = ctx.callbackQuery.message;
		data.term = ctx.callbackQuery.data;

		ctx.telegram.editMessageText(
			queryMessage.chat.id,
			queryMessage.message_id,
			null,
			'Укажите правдивую информацию по кредитной истории до проверки банка',
			storyKeyboard
		);

		return;
	}

	if (data.typeOfMicroloan === 'Микрозайм без залога до 25 000 000 сум') {
		data.term = ctx.callbackQuery.data;
		queryData = ctx.callbackQuery.data;
		queryMessage = ctx.callbackQuery.message;
		data.term = ctx.callbackQuery.data;

		const totalAmount = parseInt(data.amount).toLocaleString('ru-RU', {
			maximumFractionDigits: 0,
		});
		const monthlyPayment = calculate(
			parseInt(data.amount),
			parseInt(data.term)
		);

		ctx.telegram.editMessageText(
			queryMessage.chat.id,
			queryMessage.message_id,
			null,
			`Cумма микрозайма: ${totalAmount} сум\nСрок: ${
				data.term
			} мес.\nЕжемесячный платеж составит ${monthlyPayment.toLocaleString(
				'ru-RU',
				{
					maximumFractionDigits: 0,
				}
			)} сумов`,
			totalKeyboard
		);
	}

	if (
		data.typeOfMicroloan === `150 000 000 so'mgacha garov bilan mikrokredit`
	) {
		queryData = ctx.callbackQuery.data;
		queryMessage = ctx.callbackQuery.message;
		data.term = ctx.callbackQuery.data;

		ctx.telegram.editMessageText(
			queryMessage.chat.id,
			queryMessage.message_id,
			null,
			`Bank tekshirishidan oldin kredit tarixi bo'yicha haqiqiy ma'lumotlaringizni taqdim eting.`,
			storyKeyboardUz
		);

		return;
	}

	if (data.typeOfMicroloan === `25 000 000 so'mgacha garovsiz mikrokredit`) {
		data.term = ctx.callbackQuery.data;
		queryData = ctx.callbackQuery.data;
		queryMessage = ctx.callbackQuery.message;
		data.term = ctx.callbackQuery.data;

		const totalAmount = parseInt(data.amount).toLocaleString('ru-RU', {
			maximumFractionDigits: 0,
		});
		const monthlyPayment = calculate(
			parseInt(data.amount),
			parseInt(data.term)
		);

		ctx.telegram.editMessageText(
			queryMessage.chat.id,
			queryMessage.message_id,
			null,
			`Mikrokredit miqdori: ${totalAmount} so'm\nMuddat: ${
				data.term
			} oy\nOylik to'lov ${monthlyPayment.toLocaleString('ru-RU', {
				maximumFractionDigits: 0,
			})} so'm`,
			totalKeyboardUz
		);
	}
});

// Выбор историй кредита

bot.action(
	[
		'Никогда не брал кредитов',
		'Кредиты закрыты, просрочек не было',
		'Кредиты есть, просрочек нет',
		'Кредиты закрыты, просрочки были',
		'Просрочки были, сейчас нет',
		'Просрочки сейчас есть',
	],
	ctx => {
		if (data.typeOfMicroloan === 'Микрозайм с залогом до 150 000 000 сум') {
			queryData = ctx.callbackQuery.data;
			queryMessage = ctx.callbackQuery.message;
			data.story = ctx.callbackQuery.data;

			ctx.telegram.editMessageText(
				queryMessage.chat.id,
				queryMessage.message_id,
				null,
				'Укажите залог и увеличьте шанс и сумму выдачи дене',
				depositKeyboard
			);
		}
	}
);

bot.action(
	[
		'Hech qachon kredit olmaganman',
		`Kreditlar yopildi, kechikishlar yo'q edi`,
		`Kreditlar bor, kechikishlar yo'q`,
		`Kreditlar yopildi, kechikishlar bor edi`,
		`Kechikishlar bo'lgan, ammo hozir yo'q`,
		`Hozirda kechikishlar bor`,
	],
	ctx => {
		if (
			data.typeOfMicroloan === `150 000 000 so'mgacha garov bilan mikrokredit`
		) {
			queryData = ctx.callbackQuery.data;
			queryMessage = ctx.callbackQuery.message;
			data.story = ctx.callbackQuery.data;

			ctx.telegram.editMessageText(
				queryMessage.chat.id,
				queryMessage.message_id,
				null,
				'Garovni belgilang va pul olish imkoniyati va miqdorini oshiring.',
				depositKeyboardUz
			);
		}
	}
);

// Выбор залога

bot.action(
	['Автомобиль', 'Квартира / Дом', 'Земельный участок', 'Золото'],
	ctx => {
		queryData = ctx.callbackQuery.data;
		queryMessage = ctx.callbackQuery.message;
		data.deposit = ctx.callbackQuery.data;

		const totalAmount = parseInt(data.amount).toLocaleString('ru-RU', {
			maximumFractionDigits: 0,
		});
		const monthlyPayment = calculate(
			parseInt(data.amount),
			parseInt(data.term)
		);

		ctx.telegram.editMessageText(
			queryMessage.chat.id,
			queryMessage.message_id,
			null,
			`Сумма кредита: ${totalAmount} сум\nСрок: ${
				data.term
			} месяц\nКредитная история: ${data.story}\nЗалог: ${
				data.deposit
			},\nЕжемесячный платеж ${monthlyPayment.toLocaleString('ru-RU', {
				maximumFractionDigits: 0,
			})} сум`,
			lastStepKeyboard
		);
	}
);

bot.action(['Avtomobil', 'Kvartira / Uy', 'Dala hovli', 'Oltin'], ctx => {
	queryData = ctx.callbackQuery.data;
	queryMessage = ctx.callbackQuery.message;
	data.deposit = ctx.callbackQuery.data;

	const totalAmount = parseInt(data.amount).toLocaleString('ru-RU', {
		maximumFractionDigits: 0,
	});
	const monthlyPayment = calculate(parseInt(data.amount), parseInt(data.term));

	ctx.telegram.editMessageText(
		queryMessage.chat.id,
		queryMessage.message_id,
		null,
		`Mikrokredit miqdori: ${totalAmount} so'm\nMuddat: ${
			data.term
		} oy\nKredit tarixi: ${data.story}\nGarov: ${
			data.deposit
		},\nOylik to'lov ${monthlyPayment.toLocaleString('ru-RU', {
			maximumFractionDigits: 0,
		})} so'm`,
		lastStepKeyboardUz
	);
});

// Посчитать другую сумму

bot.action('Посчитать другую сумму', ctx => {
	if (data.typeOfMicroloan === 'Микрозайм с залогом до 150 000 000 сум') {
		ctx.telegram.editMessageText(
			queryMessage.chat.id,
			queryMessage.message_id,
			null,
			'Выберите сумму микрозайма',
			amountKeyboard
		);
	}

	if (data.typeOfMicroloan === 'Микрозайм без залога до 25 000 000 сум') {
		ctx.telegram.editMessageText(
			queryMessage.chat.id,
			queryMessage.message_id,
			null,
			'Выберите сумму микрозайма',
			amountKeyboardWithoutDeposit
		);
	}
});

bot.action('Boshqa miqdorni hisoblash', ctx => {
	if (
		data.typeOfMicroloan === `150 000 000 so'mgacha garov bilan mikrokredit`
	) {
		ctx.telegram.editMessageText(
			queryMessage.chat.id,
			queryMessage.message_id,
			null,
			'Kredit miqdorini tanlang',
			amountKeyboard
		);
	}

	if (data.typeOfMicroloan === `25 000 000 so'mgacha garovsiz mikrokredit`) {
		ctx.telegram.editMessageText(
			queryMessage.chat.id,
			queryMessage.message_id,
			null,
			'Kredit miqdorini tanlang',
			amountKeyboardWithoutDeposit
		);
	}
});

// Кнопка дальше

bot.action('Дальше', async ctx => {
	queryData = ctx.callbackQuery.data;
	queryMessage = ctx.callbackQuery.message;

	const editMessage = await ctx.telegram.editMessageText(
		queryMessage.chat.id,
		queryMessage.message_id,
		null,
		'Укажите ваш ПИНФЛ (Персональный идентификационный номер физического лица).'
	);
	messageText = editMessage.text;
});

bot.action('Keyingisi', async ctx => {
	queryData = ctx.callbackQuery.data;
	queryMessage = ctx.callbackQuery.message;

	const editMessage = await ctx.telegram.editMessageText(
		queryMessage.chat.id,
		queryMessage.message_id,
		null,
		'JSHSHIR (Jismoniy shaxsning shaxsiy identifikatsiya raqami) ni kiriting.'
	);
	messageText = editMessage.text;
});

// Кнопка разрешить

bot.action('Разрешить', async ctx => {
	await ctx.telegram.deleteMessage(ctx.chat.id, messageId);

	const sendMessage = await ctx.telegram.sendMessage(
		ctx.chat.id,
		'Отправьте заявку на кредит прямо сейчас и мы свяжемся с вами',
		sendKeyboard
	);

	messageId = sendMessage.message_id;
});

bot.action('Ruxsat berish', async ctx => {
	await ctx.telegram.deleteMessage(ctx.chat.id, messageId);

	const sendMessage = await ctx.telegram.sendMessage(
		ctx.chat.id,
		'Kredit olish uchun arizangizni hoziroq topshiring va biz siz bilan bog‘lanamiz',
		sendKeyboardUz
	);

	messageId = sendMessage.message_id;
});

// Отправка заявки

bot.action('Отправить заявку', async ctx => {
	const user = await User.findOne({ id: ctx.from.id });

	if (user) {
		data.name = user.first_name;
		data.phone = user.phone;
	}

	if (data.typeOfMicroloan === 'Микрозайм с залогом до 150 000 000 сум') {
		let bitrixData = {
			fields: {
				TITLE: 'TelegramBot',
				NAME: data.name,
				PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
				OPPORTUNITY: data.amount,
				COMMENTS: `Тип микрозайма: ${data.typeOfMicroloan},
						   Срок кредита: ${data.term},
						   Кредитная история: ${data.story},
						   ${data.deposit ? `Залог: ${data.deposit}` : 'Залог:'}`,
				// Дополнительные поля формы, если нужно
			},
		};

		fetch(
			'https://summagroup.bitrix24.ru/rest/88/wj5kdqhivkz90rxv/crm.lead.add.json',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(bitrixData),
			}
		)
			.then(response => {
				return response.json();
			})
			.catch(error => {
				console.error('Bitrix24 Error:', error);
			});

		Request.create(data)
			.then(res => {
				ctx.telegram.editMessageText(
					queryMessage.chat.id,
					queryMessage.message_id,
					null,
					'Ваша заявка отправлена ✅'
				);

				ctx.telegram.sendMessage(
					ctx.chat.id,
					'В ближайшее время с вами свяжется специалист'
				);

				ctx.telegram.sendMessage(
					ctx.callbackQuery.from.id,
					'Главное меню',
					showMenu()
				);
			})
			.catch(err => {
				console.error('Ошибка при создании заявки:', err);
			});
	}
	if (data.typeOfMicroloan === 'Микрозайм без залога до 25 000 000 сум') {
		let bitrixData = {
			fields: {
				TITLE: 'TelegramBot',
				NAME: data.name,
				PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
				OPPORTUNITY: data.amount,
				COMMENTS: `Тип микрозайма: ${data.typeOfMicroloan},
						   Срок кредита: ${data.term} мес.,
						   ПИНФЛ: ${data.pinfl},
						   Номер паспорта или ID карты: ${data.passportOrIdCard}`,
				// Дополнительные поля формы, если нужно
			},
		};

		fetch(
			'https://summagroup.bitrix24.ru/rest/88/wj5kdqhivkz90rxv/crm.lead.add.json',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(bitrixData),
			}
		)
			.then(response => {
				return response.json();
			})
			.catch(error => {
				console.error('Bitrix24 Error:', error);
			});

		Request.create(data)
			.then(async res => {
				await ctx.telegram.deleteMessage(chatId, messageId);
				await ctx.telegram.sendMessage(chatId, 'Ваша заявка отправлена ✅');
				await ctx.telegram.sendMessage(
					chatId,
					'В ближайшее время с вами свяжется специалист'
				);
				await ctx.telegram.sendMessage(
					ctx.callbackQuery.from.id,
					'Главное меню',
					showMenu()
				);
			})
			.catch(err => {
				console.error('Ошибка при создании заявки:', err);
			});

		messageText = null;
	}
});

bot.action('Ariza yuborish', async ctx => {
	const user = await User.findOne({ id: ctx.from.id });

	if (user) {
		data.name = user.first_name;
		data.phone = user.phone;
	}

	if (
		data.typeOfMicroloan === `150 000 000 so'mgacha garov bilan mikrokredit`
	) {
		let bitrixData = {
			fields: {
				TITLE: 'TelegramBot',
				NAME: data.name,
				PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
				OPPORTUNITY: data.amount,
				COMMENTS: `Kredit turi: ${data.typeOfMicroloan},
						   Muddat: ${data.term},
						   Kredit tarixi: ${data.story},
						   ${data.deposit ? `Garov: ${data.deposit}` : 'Garov:'}`,
				// Дополнительные поля формы, если нужно
			},
		};

		fetch(
			'https://summagroup.bitrix24.ru/rest/88/wj5kdqhivkz90rxv/crm.lead.add.json',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(bitrixData),
			}
		)
			.then(response => {
				return response.json();
			})
			.catch(error => {
				console.error('Bitrix24 Error:', error);
			});

		Request.create(data)
			.then(res => {
				ctx.telegram.editMessageText(
					queryMessage.chat.id,
					queryMessage.message_id,
					null,
					'Sizning arizangiz yuborildi ✅'
				);

				ctx.telegram.sendMessage(
					ctx.chat.id,
					`Tez orada mutaxassis siz bilan bog'lanadi`
				);

				ctx.telegram.sendMessage(
					ctx.callbackQuery.from.id,
					'Asosiy menyu',
					showMenuUz()
				);
			})
			.catch(err => {
				console.error('Ошибка при создании заявки:', err);
			});
	}
	if (data.typeOfMicroloan === `25 000 000 so'mgacha garovsiz mikrokredit`) {
		let bitrixData = {
			fields: {
				TITLE: 'TelegramBot',
				NAME: data.name,
				PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
				OPPORTUNITY: data.amount,
				COMMENTS: `Kredit turi: ${data.typeOfMicroloan},
						   Muddat: ${data.term} oy,
						   JSHSHIR: ${data.pinfl},
						   Pasport raqami yoki ID karta: ${data.passportOrIdCard}`,
				// Дополнительные поля формы, если нужно
			},
		};

		fetch(
			'https://summagroup.bitrix24.ru/rest/88/wj5kdqhivkz90rxv/crm.lead.add.json',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(bitrixData),
			}
		)
			.then(response => {
				return response.json();
			})
			.catch(error => {
				console.error('Bitrix24 Error:', error);
			});

		Request.create(data)
			.then(async res => {
				await ctx.telegram.deleteMessage(chatId, messageId);
				await ctx.telegram.sendMessage(
					chatId,
					'Sizning arizangiz yuborildi ✅'
				);
				await ctx.telegram.sendMessage(
					chatId,
					`Tez orada mutaxassis siz bilan bog'lanadi`
				);
				await ctx.telegram.sendMessage(
					ctx.callbackQuery.from.id,
					'Asosiy menyu',
					showMenuUz()
				);
			})
			.catch(err => {
				console.error('Ошибка при создании заявки:', err);
			});

		messageText = null;
	}
});

bot.launch();
