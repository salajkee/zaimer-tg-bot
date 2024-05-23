const showMenu = () => {
	return {
		reply_markup: {
			keyboard: [
				['ℹ️ О микрозаймах'],
				['📝 Оформить заявку'],
				['🏦 Об организации'],
			],
			resize_keyboard: true,
		},
	};
};

const showMenuUz = () => {
	return {
		reply_markup: {
			keyboard: [
				['ℹ️ Mikrokreditlar haqida'],
				['📝 Ariza yuborish'],
				['🏦 Tashkilot haqida'],
			],
			resize_keyboard: true,
		},
	};
};

const mainMenuBtn = () => {
	return {
		reply_markup: {
			keyboard: [['🏠 В главное меню']],
			resize_keyboard: true,
		},
	};
};

const mainMenuBtnUz = () => {
	return {
		reply_markup: {
			keyboard: [['🏠 Asosiy menyu']],
			resize_keyboard: true,
		},
	};
};

const sendPhoneNumber = () => {
	return {
		reply_markup: {
			keyboard: [
				[
					{
						text: '📲 Поделиться номером',
						request_contact: true,
					},
				],
			],
			resize_keyboard: true,
		},
	};
};

const sendPhoneNumberUz = () => {
	return {
		reply_markup: {
			keyboard: [
				[
					{
						text: '📲 Telefon raqamni yuborish',
						request_contact: true,
					},
				],
			],
			resize_keyboard: true,
		},
	};
};

module.exports = {
	showMenu,
	mainMenuBtn,
	sendPhoneNumber,
	showMenuUz,
	sendPhoneNumberUz,
	mainMenuBtnUz,
};
