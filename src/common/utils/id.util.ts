import { customAlphabet } from 'nanoid'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const generateNanoId = customAlphabet(alphabet, 8)

export const generateId = customAlphabet(alphabet, 16)
