/* Selectors */

const passwordResult = document.querySelector('.password-generator__output')
const copyButton = document.querySelector('.password-generator__copy-button')
const copyNotification = document.querySelector(
	'.password-generator__copy-notification'
)
const passwordConfig = document.querySelector('.password-generator__config')
const passwordLengthSlider = document.querySelector(
	'.password-generator__length-slider'
)
const passwordLengthCount = document.querySelector(
	'.password-generator__length-output'
)
const uppercaseCheckbox = document.querySelector('#uppercase')
const lowercaseCheckbox = document.querySelector('#lowercase')
const numbersCheckbox = document.querySelector('#numbers')
const symbolsCheckbox = document.querySelector('#symbols')
const passwordStrengthText = document.querySelector(
	'.password-generator__strength-text'
)
const passwordStrengthBars = document.querySelectorAll(
	'.password-generator__bar'
)
const generatePasswordButton = document.querySelector(
	'.password-generator__generate-button'
)

let userCanCopy = false

/* Calculate Password Strength */

function calculateStrength(passwordLength, config) {
	const typeCount = Object.values(config).filter((value) => value).length
	const lengthScore =
		passwordLength >= 12
			? 40
			: passwordLength >= 8
			? 30
			: passwordLength >= 6
			? 20
			: passwordLength >= 4
			? 10
			: 0
	const typeScore = typeCount * 15 // 15 points per character type selected
	let strength = lengthScore + typeScore
	return Math.min(strength, 100) // Ensures strength doesn't exceed 100
}

/* Generate Password */

function generatePassword() {
	const characters = {
		uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		lowercase: 'abcdefghijklmnopqrstuvwxyz',
		numbers: '0123456789',
		symbols: '_<.!@->/]}|;#$%^&*():?=+[{,'
	}

	let passwordChars = ''
	let generatedPassword = ''
	let config = {
		uppercase: uppercaseCheckbox.checked,
		lowercase: lowercaseCheckbox.checked,
		numbers: numbersCheckbox.checked,
		symbols: symbolsCheckbox.checked
	}

	let length = parseInt(passwordLengthSlider.value)
	let passwordStrength = calculateStrength(length, config)

	/* Ensure at least one of each required character type is included */

	Object.keys(config).forEach((key) => {
		if (config[key]) {
			passwordChars += characters[key]
			generatedPassword +=
				characters[key][Math.floor(Math.random() * characters[key].length)]
			length--
		}
	})

	/* Fill the rest of the password randomly */

	for (let i = 0; i < length; i++) {
		generatedPassword +=
			passwordChars[Math.floor(Math.random() * passwordChars.length)]
	}

	setPasswordStrengthVisuals(passwordStrength)
	return generatedPassword
}

/* Set Password Strength Visuals */

function setPasswordStrengthVisuals(passwordStrength) {
	const barColors = [
		'var(--color-red)',
		'var(--color-orange)',
		'var(--color-yellow)',
		'var(--color-neon-green)'
	]
	const messages = ['TOO WEAK!', 'WEAK', 'MEDIUM', 'STRONG']

	let index = Math.min(Math.floor(passwordStrength / 25), barColors.length - 1)
	passwordStrengthText.textContent = messages[index]
	passwordStrengthBars.forEach((bar, idx) => {
		bar.style.backgroundColor = idx <= index ? barColors[index] : 'transparent'
		bar.style.borderColor =
			idx <= index ? barColors[index] : 'var(--color-light-grey)'
	})
}

/* Update Password Length UI */

function updateSliderProgress() {
	const sliderValue = passwordLengthSlider.value
	passwordLengthCount.textContent = sliderValue
	passwordLengthSlider.style.background = `linear-gradient(to right, #a4ffaf ${
		sliderValue * 5 - 5
	}%, #18171f ${sliderValue * 5 - 5}%)`
}

/* Update Generate Button State */

function updateGenerateButtonState() {
	const isAnyCheckboxChecked =
		uppercaseCheckbox.checked ||
		lowercaseCheckbox.checked ||
		numbersCheckbox.checked ||
		symbolsCheckbox.checked
	const passwordLength = parseInt(passwordLengthSlider.value)
	generatePasswordButton.disabled = !(
		isAnyCheckboxChecked && passwordLength > 1
	)
}

/* Event Listeners */

function setupEventListeners() {
	generatePasswordButton.addEventListener('click', (e) => {
		e.preventDefault()
		const generatedPassword = generatePassword()
		passwordResult.textContent = generatedPassword
		userCanCopy = true
	})

	copyButton.addEventListener('click', () => {
		if (userCanCopy) {
			navigator.clipboard.writeText(passwordResult.textContent).then(() => {
				copyNotification.style.opacity = '1'
				setTimeout(() => (copyNotification.style.opacity = '0'), 2000)
			})
		}
	})

	passwordConfig.addEventListener('input', updateGenerateButtonState)
	window.onload = () => {
		updateGenerateButtonState()
		updateSliderProgress()
	}
}

setupEventListeners()
