import { gql } from '@apollo/client';

export interface Person {
    _id: string,
    name: string
}

export interface People {
    people: Person[]
}

export interface PersonInput {
    name: string,
    email: string,
    phoneNumber: string
  }
  
export enum Course {
    Entree,
    Side,
    Dessert
}

export interface Meal {
    id: string,
    title: string,
    date: string,
    course: Course,
    people: {id: string}[]
}

export interface MealInput {
    name: string
    category: Course
    date: Date
    people: string[]
}

export const GET_PEOPLE = gql`
    query GetPeople {
        people {
            _id
            name
        }
    }
`;

export const CREATE_MEAL = gql`
mutation CreateMeal($meal: MealInput) {
    createMeal(meal: $meal)
  }
`;

export const CREATE_PERSON = gql`
mutation CreatePerson($person: PersonInput) {
    createPerson(person: $person) {
      _id
      name
      email
      phone
    }
  }
`;

export const GET_MEALS = gql`
    query Query {
    meals {
        _id
        name
        course
        date
    }
}

`
