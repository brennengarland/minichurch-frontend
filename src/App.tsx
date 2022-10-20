import './App.css';
import { Button, Container, MenuItem, Stack, Typography } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import RHFTextField from './components/FormComponents/RHFTextField';
import RHFSelectField from './components/FormComponents/RHFSelectField';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_MEAL, GET_PEOPLE, People, Person } from './backend/graphql';
import RHFDateField from './components/FormComponents/RHFDateField';
import { useSnackbar } from 'notistack';



export default function App() {
  const { handleSubmit, reset, ...methods } = useForm({defaultValues: {
    mealName: "",
    person: "",
    date: "",
    category: "",
  }});


  const { enqueueSnackbar } = useSnackbar();


  const [createMeal] = useMutation(CREATE_MEAL);

  const handleCreateMeal = (data: any, e: any) => {
    console.log("Form Submitted!")
    console.log(data)
    let meal = {
      name: data.mealName,
      category: data.category.toUpperCase(),
      date: data.date,
      people: [{id: data.person}],
    }
    createMeal({ variables: {
      meal: meal
    }});
    reset();
    enqueueSnackbar("Meal Added", {variant: "success"});
    
  }
  let peopleMenuItems = null;
  const { data, loading, error } = useQuery<People, {}>(GET_PEOPLE);
  if (loading) return <div>Loading People</div>;
  if (error) return <div>{error.message}</div>;
  if (data) {
    peopleMenuItems = data.people.map((person: Person) => (
      <MenuItem key={person._id} value={person._id}>
        {person.name}
      </MenuItem>
    ))
  }

  const courseMenuItems = ["Entree", 'Side', 'Dessert'].map((course) => (
    <MenuItem key={`course-${course}`} value={course}>
      {course}
    </MenuItem>
  ));

    return (
      <Container>
        <FormProvider {...methods} handleSubmit={handleSubmit} reset={reset}>
          <form onSubmit={
            handleSubmit(handleCreateMeal)
          }>
            <Stack spacing={2}>
              <Typography variant="h2">Mini-Church Meal Sign-Up</Typography>
              <RHFTextField name="mealName" required={true} label="Meal Name" />
              <RHFSelectField name="person" required={true} label="Your Name">
                {peopleMenuItems} 
              </RHFSelectField>
              <RHFDateField name="date" required={true} label="Date" />
              <RHFSelectField name='category' label='Course' required={true}>
                {courseMenuItems}
              </RHFSelectField>
              <Button type="submit" variant="contained">Submit</Button>
            </Stack>
          </form>
        </FormProvider>
      </Container>
    );
}
