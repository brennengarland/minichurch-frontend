import './App.css';
import { Avatar, Button, Chip, CircularProgress, Container, Divider, MenuItem, Stack, Typography } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import RHFTextField from './components/FormComponents/RHFTextField';
import RHFSelectField from './components/FormComponents/RHFSelectField';
import { gql, useMutation, useQuery } from '@apollo/client';
import { CREATE_MEAL, CREATE_PERSON, GET_PEOPLE, Meal, People, Person, GET_MEALS } from './backend/graphql';
import RHFDateField from './components/FormComponents/RHFDateField';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import RHFPhoneNumber from './components/FormComponents/RHFPhoneNumber';
import RHFEmail from './components/FormComponents/RHFEmailField';
import React from 'react';

enum NewStatus {
  NEW,
  SUBMITTED,
  UNKNOWN
}

export default function App() {
  const [newPerson, setNewPerson] = useState<NewStatus>(NewStatus.UNKNOWN);
  const [date, setDate] = useState<string>();
  const addNewPerson = () => setNewPerson(NewStatus.NEW);
  const newPersonAdded = () => setNewPerson(NewStatus.SUBMITTED);

  const { data: mealsData, loading: loadingMeals} = useQuery(GET_MEALS);
  console.log(mealsData);
  const { handleSubmit: handleSubmitPerson, reset: resetPerson, ...personMethods } = useForm();
  const [createPerson] = useMutation(CREATE_PERSON, {
    update(cache, { data: { createPerson } }) {
      setValue('person', createPerson._id)
      cache.modify({
        fields: {
          people(existingPeople = []) {
            const newPersonRef = cache.writeFragment({
              data: createPerson,
              fragment: gql`
                fragment NewPerson on Person {
                  _id
                  name
                }
              `
            });
            return [...existingPeople, newPersonRef];
          }
        }
      });
    }
  });

  const handleCreatePerson = (data: any) => {
    let person = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber
    }
    createPerson({ variables: {
      person: person
    }});
    resetPerson();
    enqueueSnackbar("You've been added, welcome!", {variant: "info"});
    newPersonAdded();
  }


  const { enqueueSnackbar } = useSnackbar();


  const [createMeal] = useMutation(CREATE_MEAL);
  console.log(newPerson)
  const { handleSubmit: handleSubmitMeal, reset: resetMeal, setValue, getValues, watch, ...mealMethods } = useForm({defaultValues: {
    mealName: "",
    person:  "",
    date: "",
    category: "",
  }});
  const dateField = watch('date');
  useEffect(() => {
    setDate(dateField);
  }, [dateField]);
  const handleCreateMeal = (data: any) => {
    let meal = {
      name: data.mealName,
      category: data.category.toUpperCase(),
      date: data.date,
      people: [{id: data.person}],
    }
    createMeal({ variables: {
      meal: meal
    }});
    resetMeal();
    enqueueSnackbar("Meal Added", {variant: "success"});
    refetchPeople();
  }
  let peopleMenuItems = null;
  const { data, loading: loadingPeople, error, refetch: refetchPeople } = useQuery<People, {}>(GET_PEOPLE);
  if (error) return <div>{error.message}</div>;
  if (data) {
    peopleMenuItems = data.people.map((person: Person) => (
      <MenuItem key={person._id} value={person._id}>
        {person.name}
      </MenuItem>
    ))
  }
  let coursesNeeded = {
    "Entree": 2,
    "Side": 2,
    "Dessert": 1
  }
  if(mealsData && date) {
    console.log(mealsData)
      const datesMeals = mealsData.meals.filter((meal: Meal) => (new Date(date)).toISOString().split('T')[0] === meal.date)
      console.log(datesMeals)
      const entreesOnDate = datesMeals.filter((meal: Meal) => meal.course.toString() === "ENTREE")
      const sidesOnDate = datesMeals.filter((meal: Meal) => meal.course.toString() === "SIDE")
      const dessertsOnDate = datesMeals.filter((meal: Meal) => meal.course.toString() === "DESSERT");
      console.log(sidesOnDate.length);
      coursesNeeded = {
        "Entree": Math.max(0, coursesNeeded.Entree - entreesOnDate.length),
        "Side": Math.max(0, coursesNeeded.Side - sidesOnDate.length),
        "Dessert": Math.max(0, coursesNeeded.Dessert - dessertsOnDate.length),
      }
  }
  const courseMenuItems = Object.entries(coursesNeeded).map((course) => (
    <MenuItem key={`course-${course[0]}`} value={course[0]}>
      <Stack direction="row" spacing={3}>
        <span>{course[0]}</span>
        <Chip variant="outlined" color="warning" size="small" label="needed" avatar={<Avatar>{course[1]}</Avatar>} />
      </Stack>
    </MenuItem>
  ));

    return (
      <Container>
            <Stack spacing={2}>
              <Typography variant="h2">Mini-Church Meal Sign-Up</Typography>
              { newPerson === NewStatus.NEW ?
              <FormProvider {...personMethods} handleSubmit={handleSubmitPerson} reset={resetPerson}>
                <form onSubmit={
                  handleSubmitPerson(handleCreatePerson)
                }>
                  <Stack direction="row" spacing={2}>
                  <RHFTextField name="name" required={true} label="Full Name" />
                  <RHFEmail name="email" required={true} label="Email" />
                  <RHFPhoneNumber name="phoneNumber" required={true} label="Phone Number" />
                  <Button type="submit" variant="outlined">Add</Button>
                  </Stack>
                </form>
              </FormProvider>
              : 
              <Button variant="contained" onClick={addNewPerson} disabled={newPerson === NewStatus.SUBMITTED}>I'm New!</Button>
              }
              <Divider />

            <FormProvider {...mealMethods} handleSubmit={handleSubmitMeal} watch={watch} reset={resetMeal} setValue={setValue} getValues={getValues}>
              <form onSubmit={
                handleSubmitMeal(handleCreateMeal)
              }>
                <Stack spacing={2}>
                  <RHFTextField name="mealName" required={true} label="Meal Name" />
                  <RHFSelectField name="person" required={true} label="Your Name" InputProps={{
            endAdornment: (
              <React.Fragment>
                {loadingMeals ? <CircularProgress color="inherit" size={20} sx={{marginRight:'3%'}} /> : null}
              </React.Fragment>
            )
          }}>
                    {peopleMenuItems} 
                  </RHFSelectField>
                  <RHFDateField name="date" required={true} label="Date" />
                  <RHFSelectField name='category' label='Course' required={true} InputProps={{
            endAdornment: (
              <React.Fragment>
                {loadingPeople ? <CircularProgress color="inherit" size={20} /> : null}
              </React.Fragment>
            )
          }}>
                    {courseMenuItems}
                  </RHFSelectField>
                  <Button type="submit" variant='outlined'>Submit</Button>
                </Stack>
            </form>
          </FormProvider>
        </Stack>
      </Container>
    );
}
