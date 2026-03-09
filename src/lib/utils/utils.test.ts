/**
 * @vitest-environment jsdom
 */
import '@testing-library/jest-dom/vitest';
import { test, expect, describe } from 'vitest';
import { parseErrors } from './parseErrors';
import { ThemeWithDreamDataResponse } from '@/types/themes';
import { getUniqueThemes } from './getUniqueThemes';
import { formatDate } from './formatDate';

describe('parseErrors should return:', () => {
    test('Correct error based on parameter.', () => {
        const input = [
            {param: 'email', msg: 'Email already in use.', value: 'user1@email.com'},
            {param: 'password', msg: 'Passowrd cannot contain "password".', value: 'password123'},
        ]
        const param = 'email'
        expect(parseErrors(input, param)).toBe('Email already in use.')
    })
    test('Empty string if parameter is not found in errors array:', () => {
        const input = [
            {param: 'email', msg: 'Email already in use.', value: 'user1@email.com'},
        ]        
        const param = 'password'
        expect(parseErrors(input, param)).toBe('')
    })
    test('Empty string if empty array is supplied.', () => {
        expect(parseErrors([], 'email')).toBe('')
    })
})

describe('getUniqueThemes should return:', () => {
    test('Themes array with duplicates removed for non empty inputs.', () => {
        const themes = ['Fear', 'Fear', 'Animals', 'Nature', 'Nature', 'Freedom']
        const input: ThemeWithDreamDataResponse[] = []
        themes.forEach((theme) => {
            input.push({
                theme,
                dream: {title: 'Dream 1', date: new Date(), _id: '123'},
                _id: '123'
            })
        })
        expect(getUniqueThemes(input)).toEqual(['Fear', 'Animals', 'Nature', 'Freedom'])
    })
    test('Empty array for empty input.', () => {
        expect(getUniqueThemes([])).toEqual([])
    })
})

describe('formatDate should return:', () => {
    test('Correct string for dates ending in st.', () => {
        const dates = [
            new Date('2025-01-01'),
            new Date('2025-01-21'),
            new Date('2025-01-31'),
        ]
        const strings = [
            '1st', '21st', '31st'
        ]
        dates.forEach((date, index) => 
            expect(formatDate(date)).toBe(strings[index])
        )
    })
    test('Correct string for dates ending in nd.', () => {
        const dates = [
            new Date('2025-01-02'),
            new Date('2025-01-22'),
        ]
        const strings = [
            '2nd', '22nd'
        ]
        dates.forEach((date, index) => 
            expect(formatDate(date)).toBe(strings[index])
        )
    })
    test('Correct string for dates ending in rd.', () => {
        const dates = [
            new Date('2025-01-03'),
            new Date('2025-01-23'),
        ]
        const strings = [
            '3rd', '23rd'
        ]
        dates.forEach((date, index) => 
            expect(formatDate(date)).toBe(strings[index])
        )
    })   
    test('Correct string for dates ending in th, with month included if specified.', () => {
        const dates = [
            new Date('2025-01-04'),
            new Date('2025-01-11'),
            new Date('2025-01-12'),
            new Date('2025-01-13'),

        ]
        const strings = [
            '4th Jan', '11th Jan', '12th Jan', '13th Jan'
        ]
        dates.forEach((date, index) => 
            expect(formatDate(date, true)).toBe(strings[index])
        )
    })   
})