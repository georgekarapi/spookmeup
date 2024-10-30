export const generateSpookyFileName = () => {
    const firstNames = [
        'spooky',
        'creepy',
        'scary',
        'sinister',
        'eerie',
        'ghoul',
        'grim',
        'phantom',
        'shadow',
        'wraith'
    ]

    const lastNames = ['bones', 'skull', 'crypt', 'tomb', 'night', 'shade', 'doom', 'fear', 'nightmare', 'terror']

    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)]

    return `${randomFirstName}_${randomLastName}`
}
